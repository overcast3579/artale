document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const users = [
        { acc: "faedfcfd0a77f12e8741873df8c6aa36", pwd: "7c6a180b36896a0a8c02787eeafb0e4c" }, // sa
        { acc: "39384f44c997c0a1adec1b3eb609ed0e", pwd: "6cb75f652a9b52798eb6cf2201057c73" }, // boo
        { acc: "4ed662e2f364214735d99e04fba35f99", pwd: "819b0643d6b89dc9b579fdfc9094f28e" }, // st
        { acc: "24f91952c16f1edf8ab98d8251493782", pwd: "34cc93ece0ba9e3f6f235d4af979b16c" }, // ah
        { acc: "3d200b72bf2ee84aef113d07ef0f9a7c", pwd: "db0edd04aaac4506f7edab03ac855d56" }, // vv
        { acc: "30ec85b4d1ce02fe671cf56c94fe758b", pwd: "30ec85b4d1ce02fe671cf56c94fe758b" }, // oc
    ];

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const hashedAcc = md5(username);
        const hashedPwd = md5(password);
        const matchedUser = users.find(user => user.acc === hashedAcc && user.pwd === hashedPwd);
        if (matchedUser) {
            localStorage.setItem("loggedIn", "1");
            localStorage.setItem("account", username);
            location.href = "html/home.html"; 
        } else {
            alert("帳號或密碼錯誤！");
        }
    });
    
    // 沒登入就導回登入頁
    if (localStorage.getItem("loggedIn") !== "1") {
        location.href = "../index.html";
    }

    const userAcc = localStorage.getItem("account");
    if (userAcc) {
        document.getElementById("userAcc").textContent = userAcc;
    }
    // 登出功能
    document.getElementById("logoutBtn").addEventListener("click", function () {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("account");
        location.href = "../index.html";
    });
});
