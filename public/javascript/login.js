function submitButton() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let data = {
        username: username,
        password: password
    }
    fetch(window.location, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
    }).catch((error) => {
        console.log(error);
    });
}
let r = document.querySelector(':root');

function checkIfFilled(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    if(username.length > 0 && password.length > 0){
        document.getElementById('login').style.cursor = 'pointer'
    //     set var button background color to #FFFAFA
        r.style.setProperty('--buttonbackground', '#FFFAFA');
        r.style.setProperty('--buttoncolor', '#397377');
        document.getElementById('login').style.animation = 'none'


    }else{
        document.getElementById('login').style.cursor = 'not-allowed'
        document.getElementById('login').style.animation = 'shakeError 0.7s'
        r.style.setProperty('--buttonbackground', '#d96363');
        r.style.setProperty('--buttoncolor', '#FFFAFA');
        setTimeout(function(){
            document.getElementById('login').style.animation = 'none'
        }, 700);

    }
}