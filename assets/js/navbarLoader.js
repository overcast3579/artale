// js/navbarLoader.js

document.addEventListener("DOMContentLoaded", function () {
    const navbarContainer = document.getElementById("navbar-container");
    if (!navbarContainer) return;

    fetch("../common/navbar.html")
        .then(res => res.text())
        .then(html => {
            navbarContainer.innerHTML = html;
        })
        .then(() => {
            const isLoggedIn = localStorage.getItem("loggedIn") === "1";
            const account = localStorage.getItem("account");

            if (!isLoggedIn) {
                location.href = "../index.html";
                return;
            }

            const userAccEl = document.getElementById("userAcc");
            if (userAccEl && account) {
                userAccEl.textContent = account;
            }

            const logoutBtn = document.getElementById("logoutBtn");
            if (logoutBtn) {
                logoutBtn.addEventListener("click", function () {
                    localStorage.removeItem("loggedIn");
                    localStorage.removeItem("account");
                    location.href = "../index.html";
                });
            }
        });
});
