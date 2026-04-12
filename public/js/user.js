document.addEventListener("DOMContentLoaded", function() {
    fetch("http://localhost:8000/user")
    .then(response => response.json())
    .then(data => {
        if(data['status'] !== "success"){
            location.replace(`http://localhost:8000${data['redirect']}`);
        }
        else{
            var username = document.getElementById("display-name");
            var email = document.getElementById("display-email");
            if(username && email){
                username.innerText = data['username'];
                email.innerText = data['email'];
            }
        }
    })
});

function openTab(tabName, button) {
    // Hide all content
    document.querySelectorAll('.tab-content')
        .forEach(tab => tab.classList.remove('active'));
    // Remove active class from buttons
    document.querySelectorAll('.tab-btn')
        .forEach(btn => btn.classList.remove('active'));
    // Show current
    document.getElementById(tabName).classList.add('active');
    if(button) button.classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".tab-btn")
        .forEach(btn => {
            btn.addEventListener("click", () => {
                const tabName = btn.dataset.tab;
                openTab(tabName, btn);
            });
        });
    const params = new URLSearchParams(window.location.search);
    const tab = params.get("tab");
    if(tab){
        const btn = document.querySelector(`.tab-btn[data-tab="${tab}"]`);
        if (btn) openTab(tab, btn);
    }
    loadOrder();
});

function loadOrder(){
    const ordersCard = document.getElementById("orders");
    if(!ordersCard) return;
        fetch("http://localhost:8000/orders")
        .then(response => response.json())
        .then(data => {
            if(data.status && data.status !== "success"){
                ordersCard.innerHTML = `<h1 style="color: red;display: flex;justify-content: center;align-items: center;">
                ${data['message']}</h1>`;
                return;
            }
            
            data.forEach(order => {
                ordersCard.innerHTML += `<div class="activity-card">
                    <div class="status-badge ${order.status.toLowerCase()}">${order.status}</div>
                    <div class="card-details">
                        <p>📦 ${order.product_name}</p>
                        <p>💰 Total: ₹${order.price}</p>
                        <p>📅 Delivery on: ${order.order_date}</p>
                    </div>
                </div>`;
            });
        });
}