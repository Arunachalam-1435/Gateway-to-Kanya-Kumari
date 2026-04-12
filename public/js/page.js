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
        loadComponent("main-footer", "../includes/footer.html")
    ]);
    if(document.getElementById("product-container")) addProducts();
    if(document.getElementById("places-list")) addPlaces();
    if(document.getElementById("hotel-grid")) addHotels();
});

function addProducts(){
    var card = document.getElementById("product-container");
    if(!card) return;
    fetch("http://localhost:8000/products")
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
    fetch("http://localhost:8000/api/places")
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
    fetch("http://localhost:8000/orders",{
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
            console.log(data['message']);
        }
        else{
            alert(data['message']);
        }
    })
}

function addHotels(){
    var card = document.getElementById("hotel-grid");
    if(!card) return;
    fetch("http://localhost:8000/api/hotels")
    .then(response => response.json())
    .then(data => {
        if(data){
            data.slice(0,3).forEach(hotel => {
                card.innerHTML += `
                    <div class="hotel-card">
                    <img src="${hotel.img_src}" alt="${hotel.name}" class="hotel-img">
                    <div class="hotel-info">
                        <h3>${hotel.name}</h3>
                        <p class="price">₹${hotel.fee}</p>
                        <span class="room-info">${hotel.available_rooms} rooms available</span>
                        <button class="book-hotel-btn" onclick="bookRoom('${hotel.name}')">Book hotel</button>
                    </div>
                    </div>`;
            });
        }
        else{
            console.log("No Hotels Found");
        }
    });
}

function bookRoom(name){
    var rooms = { name: name};
    localStorage.setItem('rooms', JSON.stringify(rooms));
    alert("Hotel booked");
}