
let query = window.location.pathname.split('/')[2];
fetch('/api/search/' + query, {
    method: 'POST',
    headers: {
        accept: 'application/json',
        'content-type': 'application/json'
    },
    body: JSON.stringify({
        amount: 10,
        start: 0,
    })
}).then(res => res.json()).then(data => {
    if(data.length === 0){
        let sc = document.getElementById('searchResults');
        sc.style.fontFamily = "'Titan One', cursive";
        sc.innerHTML = "No results found";
        sc.style.padding = "30px";
        sc.style.paddingTop = "100px";
        sc.style.fontSize = "20px";
        sc.style.fontWeight = "bold";
        sc.style.width = '100vw';
        sc.style.height = '100%';
        sc.style.color = 'white';
        sc.style.display = 'flex';
        sc.style.justifyContent = 'center';
        sc.style.alignItems = 'center';
        return;
    }
    for(let v of data){
        let set = document.createElement('li');
        let desc = document.createElement('p');
        //go through v.terms and put it in a list, v.terms being seperated by a "" . Attach v.defs seperated by  to the end of each term
        let termShow = "";
        let termList = v.terms.split("");
        let defList = v.defs.split("");
        for(let i = 0; i < termList.length && i< 3; i++){
            termShow += termList[i];
            if(i < defList.length && defList[i] !== ""){
                termShow += " - " + defList[i];
            }
            termShow += "<br>";
        }

        desc.innerHTML = v.desc + "<br>" + termShow;
        set.innerHTML = v.name;
        set.appendChild(desc);
        set.onclick = function(){
            window.location.href = '/sets/' + v.id;
        }
        document.getElementById('searchResults').appendChild(set);
    }
});
function searchKey(e){
    if(e.keyCode === 13){
        window.location.href = '/search/' + e.target.value;
    }
}

//set the value of the search bar to the query after page loads
document.addEventListener('DOMContentLoaded', function(){
    // loop through the query and replace all %20 with a space
    for (let i = 0; i < query.length; i++) {
        if (query[i] === '%' && query[i + 1] === '2' && query[i + 2] === '0') {
            query = query.substring(0, i) + ' ' + query.substring(i + 3, query.length);
        }
    }

    document.getElementById('searchInput').value = query;
//     focus on the search bar
    document.getElementById('searchInput').focus();
});