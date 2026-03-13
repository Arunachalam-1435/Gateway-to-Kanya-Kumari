const msg = document.getElementById("msg");
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success, error);
    }
    else{
        alert("Geolocation is not supported by this browser!");
    }
}
function success(position){
    msg.remove();
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var map = L.map("id").setView([lat, lon], 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    var marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup("<b>You're here</b>").openPopup();
}
function error(){
    alert("No position available");
}