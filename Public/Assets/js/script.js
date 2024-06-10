document.addEventListener("DOMContentLoaded", function() {

    //inital transition
    function initialTransitions() {
        const icons = document.getElementsByClassName('large-icon');
        const navbar = document.querySelector('.navbar');
        const dateContainer = document.querySelector('.datetime-container');
        const logoTitle = document.querySelector('.logo-title');

        navbar.style.height = '7%';

        Array.from(icons).forEach(icon => {
            icon.style.fontSize = '2.25rem';
        });

        dateContainer.style.fontSize = '1rem';
        logoTitle.style.fontSize = '1.4rem';

        updateDateTime();
    }

    setTimeout(initialTransitions, 200);

    function updateDateTime() {
        var now = new Date();
        
        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var day = days[now.getDay()];
        
        var date = now.getDate();

        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var month = now.getMonth();

        var hours = now.getHours();
        var minutes = now.getMinutes();
        
        // Format time with leading zeros
        if (hours < 10) hours = '0' + hours;
        if (minutes < 10) minutes = '0' + minutes;
        
        var formattedDate = date + ' ' + months[month];
        var formattedTime = hours + ':' + minutes;

        var datetimeDisplay = document.querySelector('.datetime-display');
        if (datetimeDisplay) {
            datetimeDisplay.textContent = formattedTime + ' • ' + day + ', ' + formattedDate;
        }
    }
    
    // Update the date and time every second
    setInterval(updateDateTime, 10000);
    
    //create new meeting
    const createMeet = document.getElementById('newMeet');

    createMeet.addEventListener("click", function(event) {
        event.preventDefault();
        
        var randomID = Math.floor(Math.random()*100000000); 

        console.log('meetID:', meetID);

        var meetURL = window.location.origin + "?meetId=" + randomID;
        console.log('meetURL:', meetURL);

        window.location=meetURL;
    });
    
    // Joining a meeting
    const joinMeet = document.getElementById('joinMeet');

    joinMeet.addEventListener("click", function(event) {
        event.preventDefault();

        var meetID = document.getElementById('meetID').value;

        console.log('meetID:', meetID);

        var meetURL = window.location.origin + "?meetId=" + meetID;
        console.log('meetURL:', meetURL);

        window.location=meetURL;
    });

    //crousal sliding
    var slideIndex = 0;
    var totalSlides = document.querySelectorAll('.crousal-items').length;

    function updateSlide() {
        const dots= document.querySelectorAll('.dot');
        const slides = document.querySelectorAll('.crousal-items');
        slides.forEach((slide, index) => {
            slide.style.display = index === slideIndex ? 'flex' : 'none';
        });
        dots.forEach((dot, index) => {
            dot.style.color = index === slideIndex ? 'blue' : 'white';
        });
    }

    function moveRight() {
        slideIndex = (slideIndex + 1) % totalSlides;
        updateSlide();
    }

    function moveLeft() {
        slideIndex = (slideIndex - 1 + totalSlides) % totalSlides;
        updateSlide();
    }

    const left = document.getElementsByClassName('left-arrow')[0];
    const right = document.getElementsByClassName('right-arrow')[0];

    left.addEventListener('click', moveLeft);
    right.addEventListener('click', moveRight);

    // Initial slide to display
    updateSlide();

});
