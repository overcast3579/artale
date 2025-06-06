import { itemTypeData } from './item.js';

const scrollContainer = document.getElementById("scrollContainer");
const addRowBtn = document.getElementById("addRowBtn");
const calculateBtn = document.getElementById("calculateBtn");
const totalValueSpan = document.getElementById("totalValue");

function createRow(index) {
    const row = document.createElement("div");
    row.className = "row g-3 align-items-center mb-2";
    row.dataset.index = index;

    // 裝備類型下拉選單
    const typeSelect = document.createElement("select");
    typeSelect.className = "form-select col type-select";
    typeSelect.innerHTML = `<option disabled selected>選擇裝備類型</option>`;
    for (const key in itemTypeData) {
        typeSelect.innerHTML += `<option value="${key}">${itemTypeData[key].name}</option>`;
    }

    // 卷軸種類下拉選單
    const scrollSelect = document.createElement("select");
    scrollSelect.className = "form-select col scroll-select";
    scrollSelect.disabled = true;

    // 數量輸入
    const input = document.createElement("input");
    input.type = "number";
    input.min = 1;
    input.className = "form-control col";
    input.placeholder = "數量";

    // 監聽裝備類型變化，更新卷軸下拉選單
    typeSelect.addEventListener("change", () => {
        const itemType = typeSelect.value;
        scrollSelect.innerHTML = `<option disabled selected>選擇卷軸</option>`;
        if (itemTypeData[itemType] && itemTypeData[itemType].scrolls) {
            const scrolls = itemTypeData[itemType].scrolls;
            for (const scrollKey in scrolls) {
                scrollSelect.innerHTML += `<option value="${scrollKey}">${scrolls[scrollKey].name}</option>`;
            }
            scrollSelect.disabled = false;
        } else {
            scrollSelect.disabled = true;
        }
    });

    // 加入欄位結構
    const col1 = document.createElement("div");
    col1.className = "col-4";
    col1.appendChild(typeSelect);

    const col2 = document.createElement("div");
    col2.className = "col-4";
    col2.appendChild(scrollSelect);

    const col3 = document.createElement("div");
    col3.className = "col-4";
    col3.appendChild(input);

    row.appendChild(col1);
    row.appendChild(col2);
    row.appendChild(col3);

    scrollContainer.appendChild(row);
}

let rowIndex = 0;
createRow(rowIndex++);

addRowBtn.addEventListener("click", () => {
    createRow(rowIndex++);
    totalValueSpan.textContent = "價值：";
});

calculateBtn.addEventListener("click", () => {
    let total = 0;
    const rows = scrollContainer.querySelectorAll(".row");

    rows.forEach(row => {
        const typeSelect = row.querySelector("select.type-select");
        const scrollSelect = row.querySelector("select.scroll-select");
        const quantityInput = row.querySelector("input");
        if (!typeSelect || !scrollSelect || !quantityInput) {
            alert("欄位元素異常，請確認每列欄位是否完整。");
            return;
        }
        if (
            !typeSelect.value || typeSelect.value === "選擇裝備類型" ||
            !scrollSelect.value || scrollSelect.value === "選擇卷軸" ||
            !quantityInput.value || quantityInput.value <= 0
        ) {
            alert("請確認所有欄位已填寫且數量大於0。");
            return;
        }
        const itemType = typeSelect.value;
        const scrollType = scrollSelect.value;
        const quantity = parseInt(quantityInput.value);

        if (
            itemTypeData[itemType] &&
            itemTypeData[itemType].scrolls &&
            itemTypeData[itemType].scrolls[scrollType] &&
            quantity > 0
        ) {
            let priceStr = itemTypeData[itemType].scrolls[scrollType].price;
            let unitPrice = parseInt(priceStr);
            if (isNaN(unitPrice)) {
                unitPrice = 0;
            }
            total += unitPrice * quantity;
        }
    });

    totalValueSpan.textContent = `價值：${total.toLocaleString()}`;
});
