function setMaker(){
    window.location.href = "/setmaker";
}

function SearchKey(event){
    if(event.keyCode == 13){
        window.location.href = "/search/" + event.target.value;
    }
}