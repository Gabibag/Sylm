document.getElementById("login").addEventListener("click", function () {
        let username = document.getElementById("username").value;
        let password = document.getElementById("password").value;
        let data = {
            username: username,
            password: password
        }
        fetch(window.location, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
        }).catch((error) => {
            console.log(error);
        });
    }
);