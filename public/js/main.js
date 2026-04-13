var currentMap = null;
function destroyMap(){
    if (currentMap){
        currentMap.remove();
        currentMap = null;
    }
    const mapContainer = document.getElementById("map");
    if(mapContainer){
        mapContainer.innerHTML = "";
    }
}
function getUserLocation(){
    destroyMap();
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
    var m = document.getElementById("map");
    m.setAttribute("style", "height: 180px");
    m.innerHTML = "";
    currentMap = L.map('map').setView([lat, lon], 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(currentMap);
    var marker = L.marker([lat, lon]).addTo(currentMap);
    marker.bindPopup("<p>You are here!</p>").openPopup();
}
function error(err) {
    console.log(err.message);
    alert("Unable to retrieve your location");
}
async function openRoute(destLat, destLng, placeName) {
    destroyMap();
    const modal = document.getElementById('route-modal');
    modal.style.display = 'flex';
    document.getElementById('target-place-name').innerText =
        `Route from Kanyakumari Railway Station to ${placeName}`;
    const lat = 8.088422301768764;
    const lon = 77.54658072120985;
    const startName = "Kanyakumari Railway Station";
    // 1. Initialize map with autoClose: false to allow multiple popups

    currentMap = L.map('map', {
        closePopupOnClick: false 
    }).setView([lat, lon], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(currentMap);
    const url = `http://localhost:8080/ors/v2/directions/driving-car?start=${lon},${lat}&end=${destLng},${destLat}`;
    fetch(url)
    .then(res => res.json())
    .then(data => {
        if(data.error || !data.features){
            alert("Route not found");
            return;
        }
        const rawCoords = data.features[0].geometry.coordinates;
        // 2. Flip coordinates for Leaflet [Lat, Lon]
        const leafletCoords = rawCoords.map(c => [c[1], c[0]]);
        // 3. Draw the navigation path (Polyline)
        var routeLine = L.polyline(leafletCoords, {
            color: 'red', 
            weight: 5
        }).addTo(currentMap);
        // 4. Create Start Marker + Popup
        L.marker(leafletCoords[0])
            .addTo(currentMap)
            .bindPopup(`<b>${startName}</b>`, { autoClose: false })
            .openPopup();
        // 5. Create Destination Marker + Popup
        L.marker(leafletCoords[leafletCoords.length - 1])
            .addTo(currentMap)
            .bindPopup(`<b>${placeName}</b>`, { autoClose: false })
            .openPopup();
        // 6. Automatically zoom the map to fit the whole route
        currentMap.fitBounds(routeLine.getBounds());
    });
}