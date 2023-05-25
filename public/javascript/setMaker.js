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
        if (document.getElementById("setname").value === "") {
            //highlight the input box
            document.getElementById("setname").style.borderColor = "#d96363";
            document.getElementById("setname").style.backgroundColor = "#d96363";
            document.getElementById("setname").style.animation = "shakeError 0.5s";
            setTimeout(function () {
                document.getElementById("setname").style.animation = "none";
                document.getElementById("setname").style.borderColor = "3px solid #397377";
                document.getElementById("setname").style.backgroundColor = "#FFFAFA";
            }, 500);
            if(document.getElementById("setdef").value !== ""){
                return
            }

        }
        if (document.getElementById("setdef").value === "") {
            //highlight the input box
            document.getElementById("setdef").style.borderColor = "#d96363";
            document.getElementById("setdef").style.backgroundColor = "#d96363";
            document.getElementById("setdef").style.animation = "shakeError 0.5s";
            setTimeout(function () {
                document.getElementById("setdef").style.animation = "none";
                document.getElementById("setdef").style.borderColor = "3px solid #397377";
                document.getElementById("setdef").style.backgroundColor = "#FFFAFA";
            }, 500);
            return
        }

        var term = document.getElementById("setname").value;
        var def = document.getElementById("setdef").value;
        var li = document.createElement("li");
        li.innerHTML = term;
        document.getElementById("terms").appendChild(li);
        li = document.createElement("li");
        li.innerHTML = def;
        document.getElementById("defs").appendChild(li);
        document.getElementById("setname").value = "";
        document.getElementById("setdef").value = "";
        document.getElementById("setdef").style.borderColor = "#397377";
        document.getElementById("setname").style.borderColor = "#397377";
    }





