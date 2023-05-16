let buttons = document.getElementsByClassName('buttons')


window.onload = function(){
    let mainTitle = document.getElementsByClassName('mainTitle')[0]
    let pencil = document.getElementsByClassName('pencil')[0]
    //set pencil's transition speed to 0
    pencil.style.transform = 'rotate(' + (Math.atan(mainTitle.offsetHeight/mainTitle.offsetWidth) * 180 / Math.PI) + 'deg)'
    //set pencil's transition speed back to 0.5s
    setTimeout(function() {
        pencil.style.transition = '0.5s cubic-bezier(.73,.11,.48,1.04) transform'
    }, 10)
}

function redirectButton(redirect){
    setTimeout(function(){
        window.location.href=redirect
    }, 175)
}

//when mainTitle is hovered, randomize the random-rotate variable in root
let mainTitle = document.getElementsByClassName('mainTitle')[0]
function mouseOverTittle(){
    //when main title is hovered, hide the brackets
    document.getElementsByClassName('bracketLeft')[0].style.transform = 'translateX(-4vw) scale(1)'
    document.getElementsByClassName('bracketRight')[0].style.transform = 'translateX(4vw) scale(1)'
    //move the graduation cap up and to the left a bit
    document.getElementsByClassName('gradHat')[0].style.transform = 'translate(-25%, -25%) scale(1.1)'
    //move the pencil up and to the right a bit
    document.getElementsByClassName('pencil')[0].style.transform = 'translate(25%, -25%) scale(1.1)'
    //move the calculator down and to the left a bit
    document.getElementsByClassName('calculator')[0].style.transform = 'translate(-25%, 25%) scale(1.1)'
    //move the book down and to the right a bit
    document.getElementsByClassName('book')[0].style.transform = 'translate(25%, 25%) scale(1.1)'
}

function mouseExitTittle(){
    document.getElementsByClassName('bracketLeft')[0].style.transform = 'translateX(0) scale(1)'
    document.getElementsByClassName('bracketRight')[0].style.transform = 'translateX(0) scale(1)'

    document.getElementsByClassName('gradHat')[0].style.transform = 'translate(0, 0) scale(1)'
    //move the pencil up and to the right a bit
    document.getElementsByClassName('pencil')[0].style.transform = 'translate(0, 0) scale(1)'
    //move the calculator down and to the left a bit
    document.getElementsByClassName('calculator')[0].style.transform = 'translate(0,0) scale(1)'
    //move the book down and to the right a bit
    document.getElementsByClassName('book')[0].style.transform = 'translate(0,0) scale(1)'

}
