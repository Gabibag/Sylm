const seprater = "";

function submit() {
    const terms = document.getElementById("terms");
    let t = "";
    for (let v of terms.children) {
        t += v.innerHTML + seprater;
    }
    const defs = document.getElementById("defs");
    let d = "";
    for (let v of defs.children) {
        d += v.innerHTML + seprater;
    }

    const body = {
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
    let originalColor = element.style.backgroundColor;
    let originalBorder = element.style.borderColor;
    element.style.borderColor = "#d96363";
    element.style.backgroundColor = "#d96363";
    element.style.animation = "shakeError 0.5s";
    setTimeout(function () {
        element.style.animation = "none";
        element.style.borderColor = originalBorder;
        element.style.backgroundColor = originalColor;
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
    const terms = document.getElementById("terms");
    const defs = document.getElementById("defs");
    for (let v of terms.children) {
        if (v.innerHTML === document.getElementById("setname").value || v.innerHTML === document.getElementById("setdef").value) {
            //highlight the input box
            if (v.innerHTML === document.getElementById("setname").value) {
                shakeError(document.getElementById("setname"));
            }
            if (v.innerHTML === document.getElementById("setdef").value) {
                shakeError(document.getElementById("setdef"));
            }
            return;
        }
    }

    const term = document.getElementById("setname").value;
    const def = document.getElementById("setdef").value;
    let li = document.createElement("li");
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

function importFromCSVClipboard() {
    navigator.clipboard.readText().then(text => {
        const lines = text.split("\n");
        //     check to see if clipboard is valid and is actually in csv format
        if (lines.length < 2) {
            shakeError(document.getElementById("import"));
        }
        console.log(lines)
        //figure out the separator term separator
        let separator = "";
        // cycle through the first line and see if there is a comma or a tab
        for (let i of lines[0]) {
            console.log(i)
            console.log(lines[0])
            if (i.includes(",")) {
                separator = ",";
                console.log("separator is ,")
            } else if (i === "\t") {
                separator = "\t";
                console.log("separator is tab")
            } else if (i === ("|")) {
                separator = "|";
                console.log("separator is |")
            } else if (i === (";")) {
                separator = ";";
                console.log("separator is ;")
            } else if (i === (":")) {
                separator = ":";
                console.log("separator is :")
            }

        }
        if (separator === "") {
            // modify the defs and terms input boxes to have their placeholder text be "separator not found"
            document.getElementById("defs").placeholder = "separator not found";
            document.getElementById("terms").placeholder = "separator not found";
            setTimeout(function () {
                document.getElementById("defs").placeholder = "Enter definition";
                document.getElementById("terms").placeholder = "terms";
            }, 2000);
            shakeError(document.getElementById("import"));
            return;
        }
        console.log("separator is " + separator)


        for (let line of lines) {
            console.log(line)
            const parts = line.split(separator);
            if (parts.length <= 2 && parts.length > 0) {
                let li = document.createElement("li");
                li.innerHTML = parts[0];
                document.getElementById("terms").appendChild(li);
                li = document.createElement("li");
                li.innerHTML = parts[1];
                document.getElementById("defs").appendChild(li);
            } else {
                console.log("parts length is not 2, and is instead " + parts.length)
                shakeError(document.getElementById("import"));
                return;
            }
        }

    });
}





