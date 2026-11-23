// ===== Match data (used by the booking summary) =====
const matches = {
    1: { name: "Match 1 - CSK vs MI",  date: "28 Mar 2026, 7:30 PM", venue: "Chennai",   prices: { General: 800, Premium: 2000, VIP: 5000 } },
    2: { name: "Match 2 - RCB vs KKR", date: "29 Mar 2026, 7:30 PM", venue: "Bengaluru", prices: { General: 900, Premium: 2200, VIP: 5500 } },
    3: { name: "Match 3 - MI vs SRH",  date: "30 Mar 2026, 3:30 PM", venue: "Mumbai",    prices: { General: 850, Premium: 2100, VIP: 5200 } },
    4: { name: "Match 4 - KKR vs CSK", date: "31 Mar 2026, 7:30 PM", venue: "Kolkata",   prices: { General: 750, Premium: 1900, VIP: 4800 } }
};

// ===== Activity 5: reusable toast notification =====
function showToast(message, type = "success") {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = "toast toast-" + type;
    toast.textContent = message;
    container.appendChild(toast);

    // small delay so the CSS transition runs
    setTimeout(() => toast.classList.add("show"), 10);

    // hide and remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ===== Activity 5: smooth scroll from Book button to the booking form =====
const bookingSection = document.getElementById("booking");
const matchSelect = document.getElementById("match");

document.querySelectorAll(".book-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
        const matchId = btn.dataset.match;
        matchSelect.value = matchId;
        updateSummary(false);
        bookingSection.scrollIntoView({ behavior: "smooth" });
        showToast(matches[matchId].name + " selected. Fill in your details to book.");
    });
});

// ===== Activity 7: live booking summary =====
const standSelect = document.getElementById("stand");
const ticketsInput = document.querySelector("#tickets");

function updateSummary(withToast = true) {
    const match = matches[matchSelect.value];
    const stand = standSelect.value;
    let qty = parseInt(ticketsInput.value, 10);
    if (isNaN(qty) || qty < 1) qty = 1;
    if (qty > 10) qty = 10;

    const price = match.prices[stand];
    const total = price * qty;

    document.getElementById("sumMatch").textContent = match.name;
    document.getElementById("sumDate").textContent = match.date;
    document.getElementById("sumVenue").textContent = match.venue;
    document.getElementById("sumStand").textContent = stand;
    document.getElementById("sumPrice").textContent = "₹" + price;
    document.getElementById("sumQty").textContent = qty;
    document.getElementById("sumTotal").textContent = "₹" + total;

    if (withToast) {
        showToast("Summary updated: " + qty + " x " + stand + " = ₹" + total, "info");
    }
}

matchSelect.addEventListener("change", () => updateSummary());
standSelect.addEventListener("change", () => updateSummary());
ticketsInput.addEventListener("change", () => updateSummary());

// confirm booking -> add a row to My Bookings
let bookingCount = 0;
document.getElementById("bookingForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const match = matches[matchSelect.value];
    const qty = ticketsInput.value;
    const total = match.prices[standSelect.value] * qty;
    bookingCount++;

    const row = document.createElement("tr");
    row.innerHTML = `<td>BK${1000 + bookingCount}</td><td>${match.name}</td>
                     <td>${standSelect.value}</td><td>${qty}</td><td>₹${total}</td>`;
    document.getElementById("bookingRows").appendChild(row);

    showToast("Booking confirmed! ID: BK" + (1000 + bookingCount));
    e.target.reset();
    updateSummary(false);
});

// ===== Activity 8: filter match cards by team =====
const matchCards = document.querySelectorAll(".match-card");
document.getElementById("teamFilter").addEventListener("change", (e) => {
    const team = e.target.value;
    let shown = 0;
    matchCards.forEach((card) => {
        const show = team === "all" || card.dataset.teams.split(" ").includes(team);
        card.style.display = show ? "" : "none";
        if (show) shown++;
    });
    document.getElementById("noMatches").hidden = shown > 0;
});

// ===== Activity 8: grid / list view toggle =====
const matchGrid = document.getElementById("matchGrid");
const gridBtn = document.getElementById("gridViewBtn");
const listBtn = document.getElementById("listViewBtn");

gridBtn.addEventListener("click", () => {
    matchGrid.classList.remove("list-view");
    gridBtn.classList.add("active");
    listBtn.classList.remove("active");
});
listBtn.addEventListener("click", () => {
    matchGrid.classList.add("list-view");
    listBtn.classList.add("active");
    gridBtn.classList.remove("active");
});

// ===== Activity 8: hamburger menu (mobile) =====
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", open);
});

// close the menu after choosing a link
navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navLinks.classList.remove("open"));
});
