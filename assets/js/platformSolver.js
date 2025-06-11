function solvePuzzle() {
    const input0 = parseInt(document.getElementById("input0").value);
    const inputL = parseInt(document.getElementById("inputL").value);
    const inputM = parseInt(document.getElementById("inputM").value);
    const inputR = parseInt(document.getElementById("inputR").value);

    const answers = [];

    for (let l = 0; l <= 4; l++) {
        for (let m = 0; m <= 4 - l; m++) {
            let r = 4 - l - m;

            const match0 = (l === 0 ? 1 : 0) + (m === 0 ? 1 : 0) + (r === 0 ? 1 : 0);
            const matchL = (l === 1 ? 1 : 0) + (m === 0 ? 1 : 0) + (r === 0 ? 1 : 0);
            const matchM = (l === 0 ? 1 : 0) + (m === 1 ? 1 : 0) + (r === 0 ? 1 : 0);
            const matchR = (l === 0 ? 1 : 0) + (m === 0 ? 1 : 0) + (r === 1 ? 1 : 0);

            if (
                match0 === input0 &&
                matchL === inputL &&
                matchM === inputM &&
                matchR === inputR
            ) {
                answers.push({ 左: l, 中: m, 右: r });
            }
        }
    }

    const result = document.getElementById("result");
    if (answers.length === 0) {
        result.innerHTML = `<div class="alert alert-danger">找不到符合條件的組合</div>`;
    } else if (answers.length === 1) {
        const a = answers[0];
        result.innerHTML = `<div class="alert alert-success">正確分配為：左 ${a.左} 人，中 ${a.中} 人，右 ${a.右} 人</div>`;
    } else {
        result.innerHTML = `<div class="alert alert-warning">找到多種可能解：<br>${answers
            .map(a => `左 ${a.左}, 中 ${a.中}, 右 ${a.右}`)
            .join("<br>")}</div>`;
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const ids = ["input0", "inputL", "inputM", "inputR"];

    // 點第一個欄位清空所有
    document.getElementById("input0").addEventListener("focus", () => {
        ids.forEach(id => {
            document.getElementById(id).value = "";
        });
        document.getElementById("result").innerHTML = "";
    });

    ids.forEach((id, index) => {
        const input = document.getElementById(id);
        input.addEventListener("input", () => {
            if (input.value.length >= 1) {
                if (index < ids.length - 1) {
                    document.getElementById(ids[index + 1]).focus();
                } else {
                    solvePuzzle();
                }
            }
        });
    });
});
