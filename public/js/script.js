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
    var notification = document.getElementById("signup-notification");
    var login_notification = document.getElementById("login-notification");
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
        notification.innerText = "Invalid Email Format";
        notification.setAttribute("style", "color: red;");
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
            notification.innerText = "Passwords does not match";
            notification.setAttribute("style", "color: red;");
            return;
        }
    }
    else{
        notification.innerText = "Password must have atleast 8 characters";
        notification.setAttribute("style", "color: red;");
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
            notification.innerText = data['message'];
        }
        else{
            showLogin();
            login_notification.innerText = "Account Created Successfully";
            login_notification.setAttribute("style", "color: green;");
            location.replace("http://localhost:8000/home#login-section");
        }
    });
}

function userLogin(){
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var login_notification = document.getElementById("login-notification");
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
                login_notification.innerText = data['message'];
                login_notification.setAttribute("style", "color: red;");
            }
            else{
                
                location.replace("http://localhost:8000/dashboard");
            }
        });
    }
    else{
        login_notification.innerText = "Invalid Email format";
        login_notification.setAttribute("style", "color: red;");
    }
}
function userLogout(){
    fetch("http://localhost:8000/logout",{
        redirect: "follow"
    }).then(response => {
        if(response.redirected){
            window.location.href = response.url;
        }
        else{
            console.log(response);
        }
    });
}
function showSignup() {
    document.getElementById("login-section").style.display = "none";
    let signup = document.getElementById("signup-section");
    signup.style.display = "flex";
    signup.scrollIntoView({ behavior: "smooth" });
}

function showLogin() {
    document.getElementById("signup-section").style.display = "none";
    let login = document.getElementById("login-section");
    login.style.display = "flex";
    login.scrollIntoView({ behavior: "smooth" });
}