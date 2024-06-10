const { Server } = require("socket.io");
require('dotenv').config(); // to set env variables
const path = require('path');
const http = require("http");
const express = require("express");
const multer = require("multer");

const app = express();
const server = http.createServer(app); // creating an http server
const io = new Server(server); // initializing socket.io

// Set up Multer storage for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save uploaded files to the 'uploads' directory
    },
    filename: function (req, file, cb) {
        // Generate a unique ID for the file
        const uniqueID = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Use the unique ID as the filename
        const filename = uniqueID + path.extname(file.originalname);
        cb(null, filename);
    }
});
const upload = multer({ storage: storage });
// Serve static files
app.use(express.static(path.resolve('./')));

// Route for root
app.get('/', (req, res) => {
    res.sendFile(path.resolve('./index.html')); // Adjust the file path as needed
});
app.get('/home', (req, res) => {
    res.sendFile(path.resolve('./action.html')); // Adjust the file path as needed
});
app.get('/uploadFile',(req,res)=>{
    res.sendFile(path.resolve('./upload.html'));
});
app.post("/uploadFile", upload.single('file'), (req, res) => {
    // Get the filename of the uploaded file
    const filename = req.file.filename;
    // Send the filename (unique ID) back to the client
    res.send(filename);
});

const userCount={};
// Socket.io connection
io.on("connection", (socket) => {
    console.log("A new user has connected ->", socket.id);
    // Join room based on meeting ID
    socket.on("join-room", ({meetId,userInput}) => {
        socket.join(meetId);
        if(userCount[meetId]){
            userCount[meetId]++;
        }
        else{
            userCount[meetId]=1;
        }
        const userName=userInput;
        socket.to(meetId).emit("joined-chat",`${userName} joined room`);
        io.to(meetId).emit("user-count",userCount[meetId]);
        console.log(`Socket ${socket.id} ${userName} joined room ${meetId}`);
        
        // Receive a message from the client
        socket.on("user-message", (message) => {
            console.log(`Room ${meetId} - ${socket.id}: ${message}`);
            io.to(meetId).emit("message", { socketId: userName, message: message });
        });
        //#play
        socket.on("#play",({meetId})=>{
            socket.to(meetId).emit("#play-live");
        })
        //live sync
        socket.on('live',({currentTime,meetId})=>{
            console.log(currentTime);
            socket.to(meetId).emit("sync-live",{time:currentTime});
        });
        //stream source
        socket.on('stream-src',({src})=>{
            socket.to(meetId).emit('stream-live',{src:src});
        });

        // Handle user disconnect
        socket.on("disconnect", () => {
            userCount[meetId]--;
            if(!userCount[meetId]){
                delete userCount[meetId];
            }
            io.to(meetId).emit("user-count",userCount[meetId]);
            socket.to(meetId).emit("left-chat",`${userName} left room`);
            console.log(`Socket ${socket.id} $(userName) left room ${meetId}`);
        });
    });
});
//handle file


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server started at PORT ${PORT}`));
