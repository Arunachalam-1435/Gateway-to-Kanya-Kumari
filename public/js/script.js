function userRegister(){
    //User input
    var username = document.getElementById("fullname").value;
    var password = document.getElementById("signup-password").value;
    var retype_password = document.getElementById("confirm-password").value;
    var email = document.getElementById("signup-email").value;

    //DOM
    var password_match_indicator = document.getElementById("password-match-indicator");
    var match_indicator = document.getElementById("match-indicator");
    var confirm_password = document.getElementById("confirm-password");
    var mail = document.getElementById("signup-email");
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(pattern.test(email)){
        match_indicator.innerHTML = "✔";
        match_indicator.className = "match-success";
        mail.style.borderColor = "#4CAF50";
    }
    else{
        match_indicator.innerHTML = "✖";
        match_indicator.className = "match-error";
        mail.style.borderColor = "#f44336";
        return;
    }

    if(password.length >= 8){
        if(password === retype_password){
            password_match_indicator.innerHTML = "✔";
            password_match_indicator.className = "match-success";
            confirm_password.style.borderColor = "#4CAF50";
        }
        else{
            password_match_indicator.innerHTML = "✖";
            password_match_indicator.className = "match-error";
            confirm_password.style.borderColor = "#f44336";
            document.getElementById("notification").innerText = "Passwords does not match";
            return;
        }
    }
    else{
        document.getElementById("notification").innerText = "Password must have atleast 8 characters";
    }
    fetch("http://localhost:8000/register",{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: retype_password,
            email: email
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data['status'] !== "success"){
            document.getElementById("notification").innerText = data['message'];
        }
        else{
            location.replace("http://localhost:8000/home#login-section");
        }
    });
}

function userLogin(){
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var notification = document.getElementById("notification");
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(pattern.test(email)){
        fetch("http://localhost:8000/login",{
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data['status'] !== "success"){
                document.getElementById("notification").innerText = data['message'];
            }
            else{
                localStorage.setItem();
                location.replace("http://localhost:8000/dashboard");
            }
        });
    }
    else{
        notification.innerText = "Invalid Email format";
    }
}