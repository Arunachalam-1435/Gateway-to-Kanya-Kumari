let map;
let hotelLayer;
let userLayer;
let placeLayer;
let routeLayer;
//initialize map
function initMap() {
    const defaultLat = 8.174450;
    const defaultLon = 77.4322159;
    map = L.map("map").setView([defaultLat, defaultLon], 12);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    hotelLayer = L.layerGroup().addTo(map);
    userLayer = L.layerGroup().addTo(map);
    placeLayer = L.layerGroup().addTo(map);
}
//add markers
function addMarker(lat, lon, msg) {
    if (!map) return;
    userLayer.clearLayers(); 
    let marker = L.marker([lat, lon]).addTo(userLayer);
    marker.bindPopup(msg).openPopup();    
    map.setView([lat, lon], 14);
}
//show hotels
function showHotels() {
    placeLayer.clearLayers();
    let hotels = localStorage.getItem("hotels");

    if (hotels) {
        addHotelMarkers(JSON.parse(hotels));
    } else {
        fetch("http://localhost:8000/api/hotels")
            .then(res => res.json())
            .then(data => {
                const limitedData = data.slice(0, 57);
                localStorage.setItem("hotels", JSON.stringify(limitedData));
                addHotelMarkers(limitedData);
            })
            .catch(err => console.error("Fetch error:", err));
    }
}
//add hotel markers
function addHotelMarkers(hotels) {
    hotelLayer.clearLayers();
    hotels.forEach(hotel => {
        const marker = L.marker([hotel.lat, hotel.lon])
            .addTo(hotelLayer)
            .bindTooltip(hotel.name, { 
                permanent: true, 
                direction: 'top',
                className: 'hotel-label' 
            });
    });
}
//show tourist places
function showPlaces() {
    hotelLayer.clearLayers();
    let places = localStorage.getItem("places");

    // Check if data exists and is valid JSON
    if (places) {
        try {
            addPlaceMarkers(JSON.parse(places));
        } catch (e) {
            console.error("Error parsing places from localStorage", e);
            fetchPlaces(); // Fallback to fetch if data is corrupted
        }
    } else {
        fetchPlaces();
    }
}
// Separate fetch logic for cleaner code
function fetchPlaces() {
    fetch("http://localhost:8000/api/places")
        .then(res => res.json())
        .then(data => {
            const limitedData = data.slice(0, 57);
            localStorage.setItem("places", JSON.stringify(limitedData));
            addPlaceMarkers(limitedData);
        })
        .catch(err => {
            console.error("Fetch error:", err);
            alert("Could not load tourist places.");
        });
}
// add tourist place markers
function addPlaceMarkers(places) {
    placeLayer.clearLayers(); // Good: this prevents duplicates
    places.forEach(place => {
        // Ensure place.lat and place.lon exist in your API data
        if(place.lat && place.lon) {
            L.marker([place.lat, place.lon])
                .addTo(placeLayer)
                .bindTooltip(place.name || "Tourist Spot", { 
                    permanent: true, 
                    direction: 'top',
                    className: 'place-label' 
                });
        }
    });
}
//show user location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        alert("Geolocation not supported");
    }
}
//success callback
function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    sessionStorage.setItem("userLocation", JSON.stringify({ lat, lon }));
    addMarker(lat, lon, "You are here");
}
//error callback
function error() {
    alert("Can't show your location");
}
function openRouteDialog() {
    const select = document.getElementById("destinationSelect");
    select.innerHTML = ""; // Clear old options

    // Get data from localStorage
    const hotels = JSON.parse(localStorage.getItem("hotels") || "[]");
    const places = JSON.parse(localStorage.getItem("places") || "[]");
    const allDestinations = [...hotels, ...places];

    if (allDestinations.length === 0) {
        alert("Please show Hotels or Tourist Places first to load destinations!");
        return;
    }

    allDestinations.forEach(item => {
        let option = document.createElement("option");
        option.value = JSON.stringify({lat: item.lat, lon: item.lon});
        option.text = item.name;
        select.appendChild(option);
    });

    document.getElementById("routeModal").style.display = "block";
}

function closeModal() {
    document.getElementById("routeModal").style.display = "none";
}

function calculateRoute() {
    //const userLoc = JSON.parse(sessionStorage.getItem("userLocation"));
    const userLoc = { lon: 77.5492, lat: 8.0877 }; 
    if (!userLoc) {
        alert("Please click 'Show your location' first!");
        return;
    }

    const dest = JSON.parse(document.getElementById("destinationSelect").value);
    
    // ORS URL: Use [Lon, Lat]
    const url = `http://localhost:8080/ors/v2/directions/driving-car?start=${userLoc.lon},${userLoc.lat}&end=${dest.lon},${dest.lat}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (routeLayer) map.removeLayer(routeLayer);

            // Extract coordinates and flip to [lat, lon] for Leaflet
            const rawCoords = data.features[0].geometry.coordinates;
            const latLngs = rawCoords.map(c => [c[1], c[0]]);

            routeLayer = L.polyline(latLngs, {color: 'blue', weight: 6}).addTo(map);
            map.fitBounds(routeLayer.getBounds());
            
            closeModal();
            const dist = (data.features[0].properties.summary.distance / 1000).toFixed(2);
            alert(`Route Found: ${dist} km`);
        })
        .catch(err => alert("Error calculating route. Ensure ORS is running."));
}
initMap();