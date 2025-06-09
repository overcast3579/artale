import { usefulLinks } from "./linksData.js";

const listContainer = document.getElementById("useful-links-list");
const tabsContainer = document.getElementById("category-tabs");
const searchInput = document.getElementById("search-input");
const clearBtn = document.getElementById("clear-search-btn");
// 取得分類並建立 tabs
const categories = ["全部", ...new Set(usefulLinks.map(link => link.category))];

categories.forEach((cat, idx) => {
    const li = document.createElement("li");
    li.className = "nav-item";
    li.role = "presentation";

    const button = document.createElement("button");
    button.className = `nav-link${idx === 0 ? " active" : ""}`;
    button.dataset.category = cat;
    button.textContent = cat;
    button.type = "button";
    button.role = "tab";

    button.addEventListener("click", () => {
        renderLinks(cat, searchInput.value.trim());
        // 切換 active 樣式
        document.querySelectorAll("#category-tabs .nav-link").forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
    });

    li.appendChild(button);
    tabsContainer.appendChild(li);
});

// 渲染連結
function renderLinks(category = "全部", searchTerm = "") {
    listContainer.innerHTML = "";

    const filtered = usefulLinks.filter(link => {
        const matchCat = category === "全部" || link.category === category;
        const matchText = link.text.toLowerCase().includes(searchTerm.toLowerCase());
        return matchCat && matchText;
    });

    if (filtered.length === 0) {
        const li = document.createElement("li");
        li.className = "list-group-item text-muted";
        li.textContent = "找不到符合條件的連結";
        listContainer.appendChild(li);
    } else {
        filtered.forEach(link => {
            const li = document.createElement("li");
            li.className = "list-group-item";

            const a = document.createElement("a");
            a.href = link.url;
            a.target = "_blank";
            a.textContent = link.text;

            li.appendChild(a);
            listContainer.appendChild(li);
        });
    }
}

// 搜尋事件
searchInput.addEventListener("input", () => {
    const activeCatBtn = document.querySelector("#category-tabs .nav-link.active");
    const selectedCategory = activeCatBtn ? activeCatBtn.dataset.category : "全部";
    renderLinks(selectedCategory, searchInput.value.trim());
});

// 清空input
clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    const activeCatBtn = document.querySelector("#category-tabs .nav-link.active");
    const selectedCategory = activeCatBtn ? activeCatBtn.dataset.category : "全部";
    renderLinks(selectedCategory, "");
    searchInput.focus();
});

// 初始渲染
renderLinks();
