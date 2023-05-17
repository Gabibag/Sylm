let r = document.querySelector(':root');

function checkIfFilled(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let checkPassword = document.getElementById("repeatPassword").value;

    let login = document.getElementById('login');
    if(username.length > 0 && password.length > 0 && password === checkPassword ){
        login.style.cursor = 'pointer'
        r.style.setProperty('--buttonbackground', '#FFFAFA');
        r.style.setProperty('--buttoncolor', '#397377');
        login.style.animation = 'none'
        console.log("passwords match")



    } else if(password !== checkPassword){
        login.style.cursor = 'not-allowed'
        login.style.animation = 'shakeError 0.5s'
        login.innerText = 'Passwords do not match'

        r.style.setProperty('--buttonbackground', '#d96363');
        r.style.setProperty('--buttoncolor', '#FFFAFA');

        setTimeout(function(){
            login.style.animation = 'none'
            login.innerText = 'Create User'
        }, 3000);
    }
    else{
        login.style.cursor = 'not-allowed'
        login.style.animation = 'shakeError 0.5s'
        r.style.setProperty('--buttonbackground', '#d96363');
        r.style.setProperty('--buttoncolor', '#FFFAFA');
        setTimeout(function(){
            login.style.animation = 'none'
        }, 700);

    }
}
function submitButton() {
    let password = document.getElementById("password").value;
    let checkPassword = document.getElementById("repeatPassword").value;
    if( password !== checkPassword){
        console.log("passwords do not match")
        document.getElementById('login').innerText = "Passwords do not match"
        document.getElementById("password").style.border = "3px solid #d96363";
        document.getElementById("repeatPassword").style.border = "3px solid #d96363";

        setTimeout(function(){
            document.getElementById("password").style.border = "3px solid transparent";
            document.getElementById("repeatPassword").style.border = "3px solid transparent";
            document.getElementById('login').innerText = "Create User"
        }, 3000);

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
        if(d === "Register success"){
            window.location = "/home"
        }
        else {
            document.getElementById('login').style.cursor = 'not-allowed'
        document.getElementById('login').style.animation = 'shakeError 0.5s'
        r.style.setProperty('--buttonbackground', '#d96363');
        r.style.setProperty('--buttoncolor', '#FFFAFA');
        setTimeout(function(){
            document.getElementById('login').style.animation = '3px solid transparent'
        }, 700);
        document.getElementById("password").style.border = "3px solid #d96363"
        setTimeout(function(){
            document.getElementById("password").style.border = "3px solid transparent";
        }, 3000);
        }
    })

}