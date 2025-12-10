document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById('searchInput');
    const boxes = document.querySelectorAll('.menu-box');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(event) {
            const query = event.target.value.toLowerCase();
            boxes.forEach(box => {
                const text = box.querySelector('span') ? box.querySelector('span').textContent.toLowerCase() : "";
                if (text.includes(query)) { box.style.display = 'flex'; } else { box.style.display = 'none'; }
            });
        });
    }
    const navLinks = document.querySelectorAll('a[href="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => { e.preventDefault(); alert('Coming Soon!'); });
    });
});

window.toggleJob = function(header) {
    const card = header.parentElement;
    const details = card.querySelector('.job-details');
    const isOpen = details.style.display === "block";
    document.querySelectorAll('.job-details').forEach(d => d.style.display = 'none');
    document.querySelectorAll('.job-card').forEach(c => c.classList.remove('active'));
    if (!isOpen) { details.style.display = "block"; card.classList.add('active'); }
};

window.addEventListener('offline', function() { alert("⚠️ No Internet"); document.body.style.filter = "grayscale(100%)"; });
window.addEventListener('online', function() { alert("✅ Internet Back"); document.body.style.filter = "none"; });
/* --- SIDEBAR LOGIC --- */
function openNav() {
    document.getElementById("mySidenav").style.width = "280px"; // Menu ki choudai
    document.getElementById("menu-overlay").style.display = "block"; // Kala parda dikhao
    document.body.style.overflow = "hidden"; // Piche ka scroll band karo
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("menu-overlay").style.display = "none";
    document.body.style.overflow = "auto"; // Scroll wapis chalu
}
