function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const progressBar = document.getElementById("progressBar");

    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = function(event) {
        if (event.lengthComputable) {
            const progress = (event.loaded / event.total) * 100;
            progressBar.style.width = progress + "%";
        }
    };

    xhr.open("POST", "/upload", true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log("File uploaded successfully");
        } else {
            console.error("File upload failed");
        }
    };

    xhr.send(formData);
}
