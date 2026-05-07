function switchSection(name, btn) {
    document.querySelectorAll('.section-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`section-${name}`).classList.add('active');
}
function openModal(id) {
    document.getElementById(id).classList.add('open');
}
function closeModal(id) {
    document.getElementById(id).classList.remove('open');
    clearFormNotification(id);
}
document.querySelectorAll('.admin-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
        if (e.target === this) closeModal(this.id);
    });
});
function showNotification(elementId, message, type) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerText = message;
    el.style.color = type === 'success' ? '#27ae60' : 'red';
}
function clearFormNotification(modalId) {
    const notifMap = {
        'add-user-modal':  'add-user-notification',
        'add-hotel-modal': 'add-hotel-notification'
    };
    const notifId = notifMap[modalId];
    if (notifId) {
        const el = document.getElementById(notifId);
        if (el) el.textContent = '';
    }
    if (modalId === 'add-user-modal') {
        const ind = document.getElementById('retype-match-indicator');
        if (ind) { ind.textContent = ''; ind.className = ''; }
        const retype = document.getElementById('new-user-retype-password');
        if (retype) retype.style.borderColor = '';
    }
}
function confirmDelete(message, onConfirm) {
    document.getElementById('confirm-delete-msg').textContent = message;
    openModal('confirm-delete-modal');
    const btn = document.getElementById('confirm-delete-execute');
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', () => {
        closeModal('confirm-delete-modal');
        onConfirm();
    });
}
function setCount(id, val) {
    document.getElementById(id).textContent = val;
}
function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
function renderUsers(data) {
    const tbody = document.getElementById('users-tbody');
    if (!Array.isArray(data) || data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="loading-row">No users found.</td></tr>`;
        setCount('count-users', '—');
        return;
    }
    setCount('count-users', data.length);
    tbody.innerHTML = '';
    data.forEach(u => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${u.id}</td>
            <td>${escHtml(u.username)}</td>
            <td>${escHtml(u.email)}</td>
            <td><span class="role-badge ${u.role === 'admin' ? 'role-admin' : 'role-user'}">${u.role}</span></td>
            <td><button class="delete-row-btn" onclick="handleDeleteUser(${u.id}, '${escHtml(u.username)}')">Delete</button></td>`;
        tbody.appendChild(tr);
    });
} 

function handleDeleteUser(id, name) {
    confirmDelete(`Delete user "${name}" (ID: ${id})? This cannot be undone.`, () => {
        fetch("/users",{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: id
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.status !== "success"){
                alert(data.message);
            }
            else{
                alert(data.message);
                fetch('/users').then(r => r.json()).then(renderUsers);
            }
        })
    });
}

function submitAddUser() {
    const username = document.getElementById('new-username').value.trim();
    const email    = document.getElementById('new-user-email').value.trim();
    const password = document.getElementById('new-user-password').value;
    const retype   = document.getElementById('new-user-retype-password').value;
    if (!username || !email || !password || !retype) {
        showNotification('add-user-notification', 'All fields are required.', 'error');
        return;
    }
    if (password.length < 8) {
        showNotification('add-user-notification', 'Password must be at least 8 characters.', 'error');
        return;
    }
    if (password !== retype) {
        showNotification('add-user-notification', 'Passwords do not match.', 'error');
        return;
    }
    fetch('/register',{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: retype,
            email: email
        })
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === "success"){
            showNotification('add-user-notification', "User Created Successfully", "success");
            setTimeout(() => closeModal('add-user-modal'), 1200);
            fetch('/users').then(r => r.json()).then(renderUsers);
        }
        else{
            showNotification('add-user-notification', data.message, "failed");
        }
    });
}
function renderHotels(data) {
    const tbody = document.getElementById('hotels-tbody');
    if (!Array.isArray(data) || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading-row">No hotels found.</td></tr>';
        setCount('count-hotels', '-');
        return;
    }
    setCount('count-hotels', data.length);
    tbody.innerHTML = '';
    data.forEach(h => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${h.id}</td>
            <td>${escHtml(h.name)}</td>
            <td>₹${h.fee}</td>
            <td>${h.available_rooms}</td>
            <td><button class="delete-row-btn" onclick="handleDeleteHotel(${h.id}, '${escHtml(h.name)}')">Delete</button></td>`;
        tbody.appendChild(tr);
    });
}
function handleDeleteHotel(id, name) {
    confirmDelete(`Delete hotel "${name}" (ID: ${id})? This cannot be undone.`, () => {
        fetch("/api/hotels",{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.status !== "success"){
                alert(data.message);
            }
            else{
                alert(data.message);
                fetch('/api/hotels').then(r => r.json()).then(renderHotels);
            }
        })
    });
}
function submitAddHotel() {
    const name   = document.getElementById('new-hotel-name').value.trim();
    const fee    = document.getElementById('new-hotel-fee').value.trim();
    const rooms  = document.getElementById('new-hotel-rooms').value.trim();
    const imgFile = document.getElementById('new-hotel-img').files[0];
    if (!name || !fee || !rooms || !imgFile) {
        showNotification('add-hotel-notification', 'Name, fee, rooms, and image are required.', 'error');
        return;
    }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('fee', fee);
    formData.append('available_rooms', rooms);
    if (imgFile) formData.append('img', imgFile);
    fetch('/api/hotels', { method: 'POST', 
        body: formData 
    })
    .then(r => r.json())
    .then(data => {
        if(data.status === 'success'){
            showNotification('add-hotel-notification', 'Hotel added successfully', 'success');
            setTimeout(() => closeModal('add-hotel-modal'), 1200);
            fetch('api/hotels').then(r => r.json()).then(renderHotels);
        }
        else{
            showNotification('add-hotel-notification', data.message, 'error');
        }
    });
}
function checkPasswordMatch() {
    const password = document.getElementById('new-user-password').value;
    const retype   = document.getElementById('new-user-retype-password').value;
    const indicator = document.getElementById('retype-match-indicator');
    const retypeInput = document.getElementById('new-user-retype-password');

    if (!retype) {
        indicator.textContent = '';
        indicator.className = '';
        retypeInput.style.borderColor = '';
        return;
    }
    if (password === retype) {
        indicator.textContent = '✔';
        indicator.className = 'match-success';
        retypeInput.style.borderColor = '#4CAF50';
    } else {
        indicator.textContent = '✖';
        indicator.className = 'match-error';
        retypeInput.style.borderColor = '#f44336';
    }
}
function renderRooms(data) {
    const tbody = document.getElementById('rooms-tbody');
    if (!Array.isArray(data) || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="loading-row">No bookings found.</td></tr>';
        setCount('count-rooms', '-');
        return;
    }
    setCount('count-rooms', data.length);
    tbody.innerHTML = '';
    data.forEach(room => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${room.room_id}</td>
            <td>${room.user_id}</td>
            <td>${escHtml(room.hotel_name)}</td>
            <td>₹${room.price}</td>
            <td>${room.check_in ? room.check_in.slice(0, 10) : '—'}</td>
            <td>${room.check_out ? room.check_out.slice(0, 10) : '—'}</td>
            <td>${room.person_count}</td>
            <td><span class="status-badge ${room.status}">${room.status}</span></td>
            <td><button class="delete-row-btn" onclick="handleDeleteRoom(${room.room_id}, ${room.user_id}, '${room.hotel_name}')">Delete</button></td>`;
        tbody.appendChild(tr);
    });
}
function handleDeleteRoom(room_id, user_id, hotel_name) {
    confirmDelete(`Delete room booking ID ${room_id}? This cannot be undone.`, () => {
        fetch("/all_rooms",{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: user_id,
                room_id: room_id,
                hotel_name: hotel_name
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.status !== "success"){
                alert(data.message);
            }
            else{
                alert(data.message);
                fetch('/all_rooms').then(r => r.json()).then(renderRooms);
            }
        })
    });
}
function renderOrders(data) {
    const tbody = document.getElementById('orders-tbody');
    if (!Array.isArray(data) || data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading-row">No orders found.</td></tr>';
        setCount('count-orders', '-');
        return;
    }
    setCount('count-orders', data.length);
    tbody.innerHTML = '';
    data.forEach(order => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${order.order_id}</td>
            <td>${order.user_id}</td>
            <td>${escHtml(order.product_name)}</td>
            <td>₹${order.price}</td>
            <td>${order.order_date ? order.order_date.slice(0, 10) : '—'}</td>
            <td><span class="status-badge ${order.status}">${order.status}</span></td>
            <td><button class="delete-row-btn" onclick="handleDeleteOrder(${order.order_id}, ${order.user_id})">Delete</button></td>`;
        tbody.appendChild(tr);
    });
}
function handleDeleteOrder(order_id, user_id) {
    confirmDelete(`Delete order ID ${order_id}? This cannot be undone.`, () => {
        fetch("/all_orders",{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: user_id,
                order_id: order_id
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.status !== "success"){
                alert(data.message);
            }
            else{
                alert(data.message);
                fetch('/all_orders').then(r => r.json()).then(renderOrders);
            }
        })
    });
}
function userLogout(){
    fetch("/logout",{
        redirect: "follow"
    })
    .then(response => {
        if(response.redirected){
            window.location.href = response.url;
        }
        else{
            console.log(response);
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    fetch('/users').then(r => r.json()).then(renderUsers);
    fetch('/api/hotels').then(r => r.json()).then(renderHotels);
    fetch('/all_rooms').then(r => r.json()).then(renderRooms);
    fetch('/all_orders').then(r => r.json()).then(renderOrders);
});