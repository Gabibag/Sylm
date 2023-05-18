function setMaker(){
    window.location.href = "/setmaker";
}

function SearchKey(event){
    if(event.keyCode == 13){
        window.location.href = "/search/" + event.target.value;
    }
}
var loadedSets = [];
function LoadSets(){
    fetch("/api/mysets", {
        method: "GET",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
        },
    }).then((response) => response.json()).then((data) => {
        if(data.length == 0){
            document.getElementById("Center").innerHTML = "You have no sets";
        }
        loadedSets = data;
        let sets = document.getElementById("SetList");
        sets.innerHTML = "";
        for(let set of data){
            let li = document.createElement("li");
            li.className = "set";
            li.innerHTML = set.name;
            li.onclick = function(){
                window.location.href = "/sets/" + set.id;
            }
            sets.appendChild(li);
        }
    }).catch((error) => {
        console.error(error);
    });
}
LoadSets()