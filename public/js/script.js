function userRegister(){
    var username = document.getElementById("fullname").value;
    var password = document.getElementById("signup-password").value;
    var retype_password = document.getElementById("confirm-password").value;
    var email = document.getElementById("signup-email").value;
    console.log(username, password, retype_password, email);
}
var button = document.getElementById("signup-form")
button.addEventListener('submit', function(event) {
    event.preventDefault();
    userRegister();
});