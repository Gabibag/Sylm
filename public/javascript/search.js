let query = window.location.pathname.split('/')[2];
fetch('/api/search/' + query, {
    method: 'GET',
}).then(res => res.json()).then(data => {
    for(let v of data){
        let set = document.createElement('li');
        set.innerHTML = v.name;
        set.onclick = function(){
            window.location.href = '/sets/' + v.id;
        }
        document.getElementById('searchResults').appendChild(set);
    }
});
function searchKey(e){
    if(e.keyCode == 13){
        window.location.href = '/search/' + e.target.value;
    }
}