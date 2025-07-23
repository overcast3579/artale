document.addEventListener("DOMContentLoaded", () => {
    const statsBlock = document.createElement("div");
    statsBlock.classList.add("mb-3");
    statsBlock.innerHTML = `
        目前使用裝備數：<span id="used-equips-count">0</span><br />
        使用卷軸數：<span id="total-enhance-count">0</span>
    `;
    statsBlock.style.border = "2px solid #007bff"; 
    statsBlock.style.padding = "10px 20px";
    statsBlock.style.borderRadius = "8px";
    statsBlock.style.textAlign = "center";        
    statsBlock.style.width = "250px";               
    statsBlock.style.margin = "10px auto";           
    statsBlock.style.backgroundColor = "#f0f8ff";   
    
    const navbarContainer = document.getElementById("navbar-container");
    navbarContainer.insertAdjacentElement("afterend", statsBlock);

    const leftZone = document.createElement("div");
    const rightZone = document.createElement("div");
    const enhanceZone = document.createElement("div");

    leftZone.id = "good-equips";
    rightZone.id = "broken-equips";
    enhanceZone.id = "enhance-control";

    leftZone.classList.add("col-4", "p-3", "border", "rounded", "bg-white", "min-vh-50");
    rightZone.classList.add("col-4", "p-3", "border", "rounded", "bg-white", "min-vh-50");
    enhanceZone.classList.add("col-4", "p-3", "border", "rounded", "bg-light");

    leftZone.innerHTML = "<h5>未損壞裝備</h5>";
    rightZone.innerHTML = "<h5>損壞裝備</h5>";
    enhanceZone.innerHTML = "<h5>衝裝區</h5>";

    // 拖曳區允許放置裝備
    [leftZone, rightZone].forEach(zone => {
        zone.addEventListener("dragover", e => e.preventDefault());
        zone.addEventListener("drop", e => {
            e.preventDefault();
            const equipId = e.dataTransfer.getData("text/plain");
            const dragged = document.getElementById(equipId);
            if (dragged) zone.appendChild(dragged);
        });
    });

    // 控制元件
    const input = document.createElement("input");
    input.type = "number";
    input.classList.add("form-control", "w-50", "d-inline-block", "me-2");
    input.min = 1;
    input.placeholder = "可衝次數";

    const button = document.createElement("button");
    button.textContent = "新增裝備";
    button.classList.add("btn", "btn-primary");

    const controlWrapper = document.createElement("div");
    controlWrapper.classList.add("mt-3");
    controlWrapper.appendChild(input);
    controlWrapper.appendChild(button);

    let equipCounter = 0;

    button.addEventListener("click", () => {
        const tries = parseInt(input.value);
        if (!tries || tries <= 0) {
            alert("請輸入可衝次數");
            return;
        }

        const equip = document.createElement("div");
        const usedEquipsCountSpan = document.getElementById("used-equips-count");
        equipCounter++;
        equip.id = `equip-${equipCounter}`;
        equip.classList.add("p-2", "my-2", "equip-box", "rounded", "bg-secondary", "text-white");
        equip.draggable = true;

        equip.innerHTML = `
            <div>成功次數：0</div>
            <div>失敗次數：0</div>
            <div>剩餘可衝次數：${tries}</div>
        `;

        equip.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", equip.id);
        });

        leftZone.appendChild(equip);
        input.value = "";
        usedEquipsCountSpan.textContent = parseInt(usedEquipsCountSpan.textContent) + 1;    
    });

    // 衝裝按鈕
    const enhanceButtonsWrapper = document.createElement("div");
    enhanceButtonsWrapper.classList.add("mt-3", "d-flex", "gap-2");

    const enhanceBtn10 = document.createElement("button");
    enhanceBtn10.textContent = "衝 10%";
    enhanceBtn10.classList.add("btn", "btn-danger");

    const enhanceBtn60 = document.createElement("button");
    enhanceBtn60.textContent = "衝 60%";
    enhanceBtn60.classList.add("btn", "btn-warning");

    enhanceButtonsWrapper.appendChild(enhanceBtn10);
    enhanceButtonsWrapper.appendChild(enhanceBtn60);
    enhanceZone.appendChild(controlWrapper);
    enhanceZone.appendChild(enhanceButtonsWrapper);

    [enhanceBtn10, enhanceBtn60].forEach(btn => btn.disabled = true);

    function handleEnhance(successRate) {
        const equip = enhanceZone.querySelector("div[id^='equip-']");
        if (!equip) return;

        const successDiv = equip.querySelector("div:nth-child(1)");
        const failDiv = equip.querySelector("div:nth-child(2)");
        const triesDiv = equip.querySelector("div:nth-child(3)");

        let successCount = parseInt(successDiv.textContent.replace(/\D/g, ""));
        let failCount = parseInt(failDiv.textContent.replace(/\D/g, ""));
        let triesLeft = parseInt(triesDiv.textContent.replace(/\D/g, ""));

        if (triesLeft <= 0) {
            alert("這件裝備已無可衝次數！");
            [enhanceBtn10, enhanceBtn60].forEach(btn => btn.disabled = true);
            return;
        }

        triesLeft--;
        const roll = Math.random() * 100;
        const isSuccess = roll < successRate;

        if (isSuccess) {
            successCount++;
            flashBorder(equip, "gold");
        } else {
            failCount++;
            flashBorder(equip, "black");
        }

        successDiv.textContent = `成功次數：${successCount}`;
        failDiv.textContent = `失敗次數：${failCount}`;
        triesDiv.textContent = `剩餘可衝次數：${triesLeft}`;
        const totalEnhanceCountSpan = document.getElementById("total-enhance-count");
        totalEnhanceCountSpan.textContent = parseInt(totalEnhanceCountSpan.textContent) + 1;
        if (triesLeft <= 0) {
            [enhanceBtn10, enhanceBtn60].forEach(btn => btn.disabled = true);
        }
    }

    function flashBorder(element, color) {
        const className = color === "gold" ? "flash-gold" : "flash-black";
        element.classList.add(className);

        setTimeout(() => {
            element.classList.remove(className);
        }, 500);
    }
    enhanceBtn10.addEventListener("click", () => handleEnhance(10));
    enhanceBtn60.addEventListener("click", () => handleEnhance(60));

    // 限制衝裝區只能放一件
    enhanceZone.addEventListener("dragover", e => e.preventDefault());
    enhanceZone.addEventListener("drop", e => {
        e.preventDefault();
        const equipId = e.dataTransfer.getData("text/plain");
        const dragged = document.getElementById(equipId);
        if (!dragged) return;

        const existingEquip = enhanceZone.querySelector("div[id^='equip-']");
        if (existingEquip && existingEquip !== dragged) {
            alert("衝裝區只能放一件裝備！");
            return;
        }

        enhanceZone.insertBefore(dragged, controlWrapper);
        [enhanceBtn10, enhanceBtn60].forEach(btn => btn.disabled = false);
    });

    const container = document.createElement("div");
    container.classList.add("container", "mt-4");
    const row = document.createElement("div");
    row.classList.add("row", "g-3");
    row.appendChild(leftZone);
    row.appendChild(enhanceZone);
    row.appendChild(rightZone);
    container.appendChild(row);

    document.body.appendChild(container);
});