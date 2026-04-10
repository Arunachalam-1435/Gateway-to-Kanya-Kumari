function getUserLocation(){
    document.getElementById("map").innerHTML = "<p style='color: blue;'>Getting your location...</p>";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error,{
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    } else {
        alert("Geolocation not supported");
    }
}

function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    //const lat = 10.422904499999998;
    //const lon = 77.884921;

    var m = document.getElementById("map");
    m.setAttribute("style", "height: 180px");
    m.innerHTML = "";

    if(window.userMap){
        window.userMap.remove();
    }

    window.userMap = L.map('map').setView([lat, lon], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(window.userMap);
    var marker = L.marker([lat, lon]).addTo(window.userMap);
    marker.bindPopup("<p>You are here!</p>").openPopup();
}

function error(err) {
    console.log(err.message);
    alert("Unable to retrieve your location");
}