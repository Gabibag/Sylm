let r = document.querySelector(':root');

function checkIfFilled(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let checkPassword = document.getElementById("repeatPassword").value;
    if(username.length > 0 && password.length > 0 && password === checkPassword ){
        document.getElementById('login').style.cursor = 'pointer'
        //     set var button background color to #FFFAFA
        r.style.setProperty('--buttonbackground', '#FFFAFA');
        r.style.setProperty('--buttoncolor', '#397377');
        document.getElementById('login').style.animation = 'none'


    }else{
        document.getElementById('login').style.cursor = 'not-allowed'
        document.getElementById('login').style.animation = 'shakeError 0.5s'
        r.style.setProperty('--buttonbackground', '#d96363');
        r.style.setProperty('--buttoncolor', '#FFFAFA');
        setTimeout(function(){
            document.getElementById('login').style.animation = 'none'
        }, 700);

    }
}
function submitButton() {
    if(document.getElementById("password").value !== document.getElementById("repeatPassword").value){
        alert("Passwords do not match")
        return
    }
    let data = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
    }
    fetch(window.location, {
        method:"POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(data)
    }).then(response => response.text()).then(function(d){
        document.getElementById('login').style.cursor = 'not-allowed'
        document.getElementById('login').style.animation = 'shakeError 0.5s'
        r.style.setProperty('--buttonbackground', '#d96363');
        r.style.setProperty('--buttoncolor', '#FFFAFA');
        setTimeout(function(){
            document.getElementById('login').style.animation = 'none'
        }, 700);
    })
}