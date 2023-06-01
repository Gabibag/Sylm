const s = "";

function submit() {
    //check if the total length of charecters is more than 5000
    let total = 0;
    for (let v of document.getElementById("terms").children) {
        total += v.innerHTML.length;
    }
    for (let v of document.getElementById("defs").children) {
        total += v.innerHTML.length;
    }
    if (total > 100000) {
        shakeError(document.getElementById("def"));
        return;
    }
    const terms = document.getElementById("terms");
    let t = "";
    for (let v of terms.children) {
        t += v.innerHTML + s;
    }
    const defs = document.getElementById("defs");
    let d = "";
    for (let v of defs.children) {
        d += v.innerHTML + s;
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

    setTimeout(function () {

        element.style.animation = "shakeError 0.5s";
        setTimeout(function () {
            element.style.animation = "none";

        }, 500);
    }, 1);
}

function addTerm() {
    if (document.getElementById("setname").value.trim() === "") {
        //highlight the input box
        shakeError(document.getElementById("setname"));

    }
    if (document.getElementById("setdef").value.trim() === "") {
        //highlight the input box
        shakeError(document.getElementById("setdef"));
        return
    }
    // check if term or def is too long
    if (document.getElementById("setname").value.length > 400) {
        shakeError(document.getElementById("setname"));
    }
    if (document.getElementById("setdef").value.length > 400) {
        shakeError(document.getElementById("setdef"));
        return;
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
    //remove the import button
    document.getElementById("import").style.display = "none";
}

function importError(message) {
    // shakeError(document.getElementById("import"));
    document.getElementById("setname").value = message;
    document.getElementById("setdef").value = message;
    /*shakeError(document.getElementById("setdef"));
    shakeError(document.getElementById("setname"));*/
}

function importFromCSVClipboard() {
    navigator.clipboard.readText().then(text => {
        const lines = text.split("\n");
        //     check to see if clipboard is valid and is actually in csv format
        if (lines.length < 2) {
            shakeError(document.getElementById("import"));
        }
        //figure out the separator term separator
        let separator = "";
        // cycle through the first line and see if there is a comma or a tab
        let commonSeparators = [",", "\t", "|", ";", ":", "-", "_", "/"];
        for (let i = 0; i < lines.length; i++) {
            for (let i of lines[0]) {
                for (let j of commonSeparators) {
                    if (i === j) {
                        separator = j;
                    }
                }
            }
        }
        if (separator === "") {
            // modify the defs and terms input boxes to have their placeholder text be "separator not found"
            importError("Separator not found");
            shakeError(document.getElementById("import"));
            return;
        }
        // check to see if the seprator is "-". if it is, then loop through a random line and see if there is a "+, -, *, or /". if it is, redo the separator but remove the +, -, *, or /
        let hasMath = false;
        let mathSymbols = ["+", "-", "*", "/"];
        if (separator === "-") {
            for (let i of lines[0]) {
                for (let j of mathSymbols) {
                    if (i === j) {
                        hasMath = true;
                        break;
                    }
                }
            }
        }

        if (hasMath) {
            console.log("has math")
            commonSeparators = [",", "\t", "|", ";", ":", "_", "/"];
            for (let i = 0; i < lines.length; i++) {
                for (let i of lines[0]) {
                    for (let j of commonSeparators) {
                        if (i === j) {
                            separator = j;
                        }
                    }
                }
            }
        }

        // console.log(separator)

        //go through separator and count the number of duplicates. after that, use the one with the most duplicates
        let max = 0;
        let maxChar = "";
        for (let i of separator) {
            let count = 0;
            for (let j of separator) {
                if (i === j) {
                    count++;
                }
            }
            if (count > max) {
                max = count;
                maxChar = i;
            }
        }
        separator = maxChar;

        let errorLines = "";
        for (let line of lines) {

            const parts = line.split(separator);
            if (parts.length <= 2 && parts.length > 0) {
                let li = document.createElement("li");
                li.innerHTML = parts[0];
                document.getElementById("terms").appendChild(li);
                li = document.createElement("li");
                li.innerHTML = parts[1];
                document.getElementById("defs").appendChild(li);
            } else {
                errorLines += line + " / ";
            }
        }
        if (errorLines.length > 0) {
            errorLines = errorLines.substring(0, errorLines.length - 3);
            importError("Error on lines: " + errorLines);
            return;
        }
        //remove the import button
        document.getElementById("import").style.display = "none";

    });
}

function swapTermAndDef() {

    const terms = document.getElementById("terms");
    const defs = document.getElementById("defs");
    let termsArray = [];
    let defsArray = [];
    if (terms.children.length !== defs.children.length || terms.children.length === 0 || defs.children.length === 0) {
        //highlight the input box
        shakeError(document.getElementById("swap"));
        return;
    }
    for (let i = 0; i < terms.children.length; i++) {
        termsArray.push(terms.children[i].innerHTML);
        defsArray.push(defs.children[i].innerHTML);
    }
    terms.innerHTML = "";
    defs.innerHTML = "";
    for (let i = 0; i < termsArray.length; i++) {
        let li = document.createElement("li");
        li.innerHTML = defsArray[i];
        terms.appendChild(li);
        li = document.createElement("li");
        li.innerHTML = termsArray[i];
        defs.appendChild(li);
    }
}




