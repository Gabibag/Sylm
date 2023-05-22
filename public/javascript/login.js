let username = "";
let password = "";

function submitButton() {
    let u = username.value;
    let p = password.value;
    let data = {
        username: u,
        password: p
    }
    fetch(window.location, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then((response) => {
        return response.text();
    }).then((data) => {
        if(data === "Login success"){
            window.location.href = "/home";
        }else {
            let login = document.getElementById('login');
            login.style.cursor = 'not-allowed'
            login.style.animation = 'shakeError 0.5s'
            r.style.setProperty('--buttonbackground', '#d96363');
            r.style.setProperty('--buttoncolor', '#FFFAFA');
            login.innerText = "Invalid Username or Password"
            setTimeout(function () {
                login.style.animation = 'none'
                // switcher.animation = 'none'
            }, 700);
            setTimeout(function () {
                login.innerText = "Login"
            }, 3000);
        }
    }).catch((error) => {

        alert(error);
    });
}
let r = document.querySelector(':root');


//when the user press enter on the password field it will submit the form

document.addEventListener("DOMContentLoaded", function () {
    username = document.getElementById("username");
    password = document.getElementById("password");

    password.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            submitButton();
        }
    });

//if the user press enter on the username field it will focus on the password field

    username.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            password.focus();
        }
    });
});
function checkIfFilled(){
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    let login = document.getElementById('login').style;
    if(username.length > 0 && password.length > 0){
        login.cursor = 'pointer'
        r.style.setProperty('--buttonbackground', '#FFFAFA');
        r.style.setProperty('--buttoncolor', '#397377');
        login.animation = 'none'
    }else{
        login.cursor = 'not-allowed'
        login.animation = 'shakeError 0.5s'
        r.style.setProperty('--buttonbackground', '#d96363');
        r.style.setProperty('--buttoncolor', '#FFFAFA');
        setTimeout(function(){
            login.animation = 'none'
            r.style.setProperty('--buttonbackground', '#FFFAFA');
            r.style.setProperty('--buttoncolor', '#397377');
        }, 700);

    }
}