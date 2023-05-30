// on load

function setMaker() {
    window.location.href = "/setmaker";
}

function SearchKey(event) {
    if (event.keyCode == 13) {
        window.location.href = "/search/" + event.target.value;
    }
}

let selectedSet = null;
let loadedSets = [];

function LoadSets() {
    fetch("/api/mysets", {
        method: "GET",
        headers: {
            accept: "application/json",
            "content-type": "application/json",
        },
    }).then((response) => response.json()).then((data) => {
        if (data.length == 0) {
            document.getElementById("Center").innerHTML = "You have no sets";
        }
        loadedSets = data;
        let sets = document.getElementById("SetList");
        sets.innerHTML = "";
        for (let set of data) {
            let li = document.createElement("li");
            li.className = "set";
            li.innerHTML = set.name;
            li.id = set.id;
            li.onclick = function () {
                selectedSet = set;
                UpdateToNewSet();
            }
            sets.appendChild(li);
        }
    }).catch((error) => {
        console.error(error);
    });
}
function UpdateToNewSet() {
    document.getElementById("Center").innerHTML = "";
    let div = document.createElement("div");
    div.id = "SetInfo";
    let name = document.createElement("h1");
    name.innerHTML = selectedSet.name;
    div.appendChild(name);
    let img = document.createElement("img");
    img.src = "/images/openin.svg";
    img.id = "OpenIn";
    img.width = img.height = 50;
    img.onclick = function () {
        window.location.href = "/sets/" + selectedSet.id;
    }
    div.appendChild(img);
    document.getElementById("Center").appendChild(div);
    let desc = document.createElement("p");
    desc.innerHTML = selectedSet.desc;
    document.getElementById("Center").appendChild(desc);
    let child = document.createElement("div");
    child.id = "TermsDefs";
    document.getElementById("Center").appendChild(child);
    let termlist = document.createElement("ul");
    let deflist = document.createElement("ul");
    termlist.id = "TermList";
    deflist.id = "DefList";
    let termslistdata = selectedSet.terms.split("");
    let defslistdata = selectedSet.defs.split("");
    for(let i = 0; i < termslistdata.length; i++) {
        let term = document.createElement("li");
        term.innerHTML = termslistdata[i];
        termlist.appendChild(term);
        let def = document.createElement("li");
        def.innerHTML = defslistdata[i];
        deflist.appendChild(def);
    }
    document.getElementById("TermsDefs").appendChild(termlist);
    document.getElementById("TermsDefs").appendChild(deflist);
}

LoadSets()