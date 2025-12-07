/* script.js - Main Logic */
document.addEventListener("DOMContentLoaded", function() {

    // --- 1. SHOP STATUS LOGIC (Change here for all pages) ---
    const manualMessage = "";  // Example: "Closed till Monday"

    const statusContainer = document.getElementById('shopStatusText');
    if (statusContainer) {
        const now = new Date();
        const hours = now.getHours();
        const openHour = 7;
        const closeHour = 19;

        if (manualMessage !== "") {
            statusContainer.innerHTML = `<span class="status-badge" style="background:#fde8e8; color:#c32f19;">🔴 ${manualMessage}</span>`;
        } else if (hours >= openHour && hours < closeHour) {
            statusContainer.innerHTML = `<span class="status-badge" style="background:#d4edda; color:#155724;">🟢 Open • Closes 7 PM</span>`;
        } else {
            statusContainer.innerHTML = `<span class="status-badge" style="background:#fde8e8; color:#c32f19;">🔴 Closed • Opens 7 AM</span>`;
        }
    }

    // --- 2. SEARCH FUNCTIONALITY ---
    const searchInput = document.getElementById('searchInput');
    const boxes = document.querySelectorAll('.menu-box');

    if (searchInput) {
        searchInput.addEventListener('keyup', function(event) {
            const query = event.target.value.toLowerCase();
            boxes.forEach(box => {
                const text = box.querySelector('span') ? box.querySelector('span').textContent.toLowerCase() : "";
                if (text.includes(query)) {
                    box.style.display = 'flex';
                } else {
                    box.style.display = 'none';
                }
            });
        });
    }

    // --- 3. MOBILE LINK ALERT ---
    const navLinks = document.querySelectorAll('a[href="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            alert('This link is not connected yet.');
        });
    });
});
