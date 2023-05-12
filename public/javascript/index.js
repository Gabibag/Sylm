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

//when mainTitle is hovered, randomize the random-rotate variable in root
let mainTitle = document.getElementsByClassName('mainTitle')[0]
function randomizeRotate(){
    let randomRotate = (Math.random() * 6) - 3
    if (randomRotate <= 1 && randomRotate >= -1 ){
        randomRotate += 1
    }
    let r = document.querySelector(':root');
    r.style.setProperty('--random-rotate', randomRotate + 'deg');
}
