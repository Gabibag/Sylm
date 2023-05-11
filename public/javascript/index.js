let swapToSignin = document.getElementsByClassName('swapToSignin')[0]
let loginButton = document.getElementsByClassName('loginButton')[0]

window.onload = function(){
    let mainTitle = document.getElementsByClassName('mainTitle')[0]
    let pencil = document.getElementsByClassName('pencil')[0]
    pencil.style.transform = 'rotate(' + (Math.atan(mainTitle.offsetHeight/mainTitle.offsetWidth) * 180 / Math.PI) + 'deg)'
}

function redirectButton(redirect){
    setTimeout(function(){
        window.location.href=redirect
    }, 175)
}