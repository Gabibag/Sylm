let swapToSignin = document.getElementsByClassName('swapToSignin')
let loginButton = document.getElementsByClassName('loginButton')

window.onload = function(){
    // wait for 3 seconds
    setTimeout(function() {
        console.log(swapToSignin)
        swapToSignin.style.height = loginButton.offsetHeight
    }, 3000);
}