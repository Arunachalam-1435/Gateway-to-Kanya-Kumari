// Initialize map
/*var map = L.map('map').setView([8.0883, 77.5385], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Layers for hotels and tourism places
var hotelsLayer = L.layerGroup().addTo(map);
var tourismLayer = L.layerGroup().addTo(map);
*/
//get Hotel details
async function showHotels(){
    fetch("http://localhost:8080/api/hotels").then(res => res.json())
    .then(data => console.log(data[56])).catch(err => console.log(err));
}
/*
var tourismPlaces = [
    {name:"Thiruvalluvar Statue", lat:8.086, lng:77.538},
    {name:"Vivekananda Rock Memorial", lat:8.080, lng:77.561}
];

// Add markers
hotels.forEach(h => L.marker([h.lat,h.lng]).bindPopup(h.name).addTo(hotelsLayer));
tourismPlaces.forEach(t => L.marker([t.lat,t.lng]).bindPopup(t.name).addTo(tourismLayer));

// Sidebar button toggles
document.getElementById('btn-hotels').onclick = function(){
    if(map.hasLayer(hotelsLayer)) map.removeLayer(hotelsLayer);
    else map.addLayer(hotelsLayer);
}

document.getElementById('btn-tourism').onclick = function(){
    if(map.hasLayer(tourismLayer)) map.removeLayer(tourismLayer);
    else map.addLayer(tourismLayer);
}

// Sample route line
var routeLine = L.polyline([[8.087,77.537],[8.086,77.538],[8.080,77.561]], {color:'blue'});

document.getElementById('btn-route').onclick = function(){
    if(map.hasLayer(routeLine)) map.removeLayer(routeLine);
    else map.addLayer(routeLine);
}
*/
function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success, error);
    }
    else{
        alert("Geolocation is not supported by this browser!");
    }
}
function success(position){
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let map2 = L.map("id").setView([lat, lon], 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map2);
    var marker = L.marker([lat, lon]).addTo(map2);
    marker.bindPopup("<b>You're here</b>").openPopup();
    console.log(lat, lon);
}
function error(){
    alert("No position available");
}