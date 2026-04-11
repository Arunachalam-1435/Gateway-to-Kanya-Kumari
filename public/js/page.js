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
    initShop();
    addProducts();
    addPlaces();
});

function initShop(){
    var menu = document.getElementById("ul");
    var cart = document.getElementById("cart");
    if (menu && !cart){
        var newList = document.createElement("li");
        newList.setAttribute("id", "cart");
        var cart = document.createElement("a");
        cart.setAttribute("href", "/my-activity?tab=orders");
        cart.textContent = "Cart";
        newList.appendChild(cart);
        menu.appendChild(newList);
    }
}

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
                        <button class="add-to-cart-btn" onclick="addToCart('${product.name}')">Add to Cart</button>
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
                            <button class="dir-btn">
                                Get Directions
                            </button>
                        </div>
                    </div>`;
            })
        }
    });
}
    /*onclick="openRoute('${p.lat}', '${place.lng}', '${place.name}')"*/