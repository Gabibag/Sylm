    const seprater = "";
    function submit() {
    var terms = document.getElementById("terms");
    var t = "";
    for (let v of terms.children) {
    t += v.innerHTML + seprater;
}
    var defs = document.getElementById("defs");
    var d = "";
    for (let v of defs.children) {
    d += v.innerHTML + seprater;
}

    var body = {
    terms: t,
    defs: d,
    name: document.getElementById("name").value,
    description: document.getElementById("desc").value,
};
    fetch("/api/createset", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
    "Content-Type": "application/json",
},
}).then(Response => {
    return Response.text();
}).then(data => {
    window.location.href = "/sets/" + data;
});
}
    function addTerm() {
    var term = document.getElementById("setname").value;
    var def = document.getElementById("setdef").value;
    var li = document.createElement("li");
    li.innerHTML = term;
    document.getElementById("terms").appendChild(li);
    li = document.createElement("li");
    li.innerHTML = def;
    document.getElementById("defs").appendChild(li);
}