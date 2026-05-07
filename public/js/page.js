async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load ${filePath}`);
        const content = await response.text();
        var dom = document.getElementById(elementId);
        if(dom){
            dom.innerHTML = content;
        }
    } catch (error) {
        console.error("Error loading component:", error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await Promise.all([
        loadComponent("main-header", "../includes/main-header.html"),
        loadComponent("header", '../includes/header.html'),
        loadComponent("main-footer", "../includes/footer.html"),
        loadComponent("header-2", "../includes/main-header-2.html")
    ]);
    if(document.getElementById("product-container")) addProducts();
    if(document.getElementById("places-list")) addPlaces();
    if(document.getElementById("hotel-grid")) addHotels();
});

function addProducts(){
    var card = document.getElementById("product-container");
    if(!card) return;
    fetch("/products")
    .then(response => response.json())
    .then(data => {
        if(data){
            data.forEach(product => {
                card.innerHTML += `
                    <div class="product-card">
                    <img src="${product.img_src}" alt="${product.name}" class="product-img">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="price">₹${product.price}</p>
                        <span class="stock-info">${product.quantity} units available</span>
                        <button class="add-to-cart-btn" onclick="addToCart('${product.name}', ${product.price})">Buy</button>
                    </div>
                    </div>`;
            });
        }
        else{
            console.log("No Products Found");
        }
    });
}

function addPlaces(){
    var place = document.getElementById("places-list");
    if(!place) return;
    fetch("/api/places")
    .then(response => response.json())
    .then(data => {
        if(data){
            data.slice(0,3).forEach(p => {
                place.innerHTML += `
                    <div class="place-card">
                        <img src="${p.img_src}" alt="${p.name}" class="place-img">
                        <div class="place-content">
                            <h3>${p.name}</h3>
                            <p>${p.description}</p>
                            <div class="place-info">
                                <span>🕒 ${p.timing}</span>
                                <span>🎟️ ${p.fee}</span>
                            </div>
                            <button class="dir-btn" onclick="openRoute(${p.lat}, ${p.lon}, '${p.name}')">
                                Get Directions
                            </button>
                        </div>
                    </div>`;
            })
        }
    });
}
    
function addToCart(product_name, product_price){
    const date = new Date();
    date.setDate(date.getDate() +7);
    const timestamp = date.toISOString().slice(0, 19).replace('T', ' ');
    fetch("/orders",{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            product_name: product_name,
            price: product_price,
            order_date: timestamp
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data['status'] !== "success"){
            alert(data['message']);
        }
        else{
            alert(data['message']);
            location.reload();
        }
    })
}

function addHotels(){
    var card = document.getElementById("hotel-grid");
    if(!card) return;
    fetch("/api/hotels")
    .then(response => response.json())
    .then(data => {
        if(data){
            const today = new Date().toISOString().split('T')[0];
            data.slice(0,3).forEach(hotel => {
                card.innerHTML += `<div class="hotel-card">
                        <img src="${hotel.img_src}" alt="${hotel.name}" class="hotel-img">
                        <div class="hotel-info">
                            <h3>${hotel.name}</h3>
                            <p class="price">₹${hotel.fee}</p>
                            <span class="room-info">${hotel.available_rooms} rooms available</span>
                            <div class="booking-form">
                                <div class="booking-field">
                                    <label>Check-in</label>
                                    <input type="date" class="booking-input" id="checkin-${hotel.id}" min="${today}">
                                </div>
                                <div class="booking-field">
                                    <label>Check-out</label>
                                    <input type="date" class="booking-input" id="checkout-${hotel.id}" min="${today}">
                                </div>
                                <div class="booking-field">
                                    <label>Guests</label>
                                    <input type="number" class="booking-input" id="guests-${hotel.id}" min="1" max="10" value="1">
                                </div>
                            </div>
                            <button class="book-hotel-btn" onclick="bookRoom('${hotel.name}', ${hotel.fee}, ${hotel.id})">Book Hotel</button>
                        </div>
                    </div>`;
            });
        }
        else{
            alert("No Hotels Found");
        }
    });
}

function bookRoom(name, fee, id){
    var checkin = document.getElementById(`checkin-${id}`).value;
    var checkout = document.getElementById(`checkout-${id}`).value;
    var person_count = document.getElementById(`guests-${id}`).value;
    person_count = Number(person_count);

    if(!checkin || !checkout){
        alert("Please select checkin and checkout dates");
        return;
    }
    if(checkout <= checkin){
        alert("Check out must be after check in");
        return;
    }
    fetch("/rooms", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            hotel_name: name,
            price: fee,
            check_in: checkin,
            check_out: checkout,
            person_count: person_count
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === "success"){
            alert(data.message);
            location.reload();
        }
        else{
            alert(data.message);
        }
    });
}