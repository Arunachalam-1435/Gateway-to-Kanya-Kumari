document.addEventListener("DOMContentLoaded", function() {
    fetch("http://localhost:8000/user")
    .then(response => response.json())
    .then(data => {
        if(data['status'] !== "success"){
            location.replace(`http://localhost:8000${data['redirect']}`);
        }
        else{
            document.getElementById("display-name").innerText = data['username'];
            document.getElementById("display-email").innerText = data['email'];
        }
    })
});