function checkLogin({
    navbarPath = "../common/navbar.html",
    redirectPath = "../index.html",
    basePath = "../"
} = {}) {
    const navbarContainer = document.getElementById("navbar-container");
    if (!navbarContainer) return;

    fetch(navbarPath)
        .then(res => res.text())
        .then(html => {
            navbarContainer.innerHTML = html;
            console.log('navbarContainer', navbarContainer)
        })
        .then(() => {
            const isLoggedIn = localStorage.getItem("loggedIn") === "1";
            const account = localStorage.getItem("account");
console.log('account', account)
            if (!isLoggedIn) {
                location.href = redirectPath;
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
                    location.href = redirectPath;
                });
            }
        });
}
