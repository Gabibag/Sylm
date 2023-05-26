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

    function shakeError(element) {
        element.style.borderColor = "#d96363";
        element.style.backgroundColor = "#d96363";
        element.style.animation = "shakeError 0.5s";
        setTimeout(function () {
            element.style.animation = "none";
            element.style.borderColor = "3px solid #397377";
            element.style.backgroundColor = "#FFFAFA";
        }, 500);
    }

    function addTerm() {
        if (document.getElementById("setname").value === "") {
            //highlight the input box
            shakeError(document.getElementById("setname"));

        }
        if (document.getElementById("setdef").value === "") {
            //highlight the input box
            shakeError(document.getElementById("setdef"));
            return
        }

        // loop through the terms and defs and see if the term or def is already in the set
        var terms = document.getElementById("terms");
        var defs = document.getElementById("defs");
        for (let v of terms.children) {
            if (v.innerHTML === document.getElementById("setname").value || v.innerHTML === document.getElementById("setdef").value) {
                //highlight the input box
                if (v.innerHTML === document.getElementById("setname").value){
                    shakeError(document.getElementById("setname"));
                }
                if (v.innerHTML === document.getElementById("setdef").value){
                    shakeError(document.getElementById("setdef"));
                }
                return;
            }
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





