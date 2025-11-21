/* ===================================
   assets/js/velha3.js - Script específico para o jogo da velha 3
=================================== */

// ========================
// ELEMENTOS DO JOGO
// ========================
const bigCells = document.querySelectorAll(".cell"); // células do tabuleiro grande

// ========================
// CRIAR TABULEIROS PEQUENOS
// ========================
bigCells.forEach((bigCell, bigIndex) => {
    const smallBoard = document.createElement("div");
    smallBoard.classList.add("small-board");

    for (let i = 0; i < 9; i++) {
        const smallCell = document.createElement("div");
        smallCell.classList.add("small-cell");
        smallCell.dataset.index = i;
        smallCell.dataset.bigIndex = bigIndex; // para saber qual tabuleiro grande pertence
        smallBoard.appendChild(smallCell);
    }

    bigCell.appendChild(smallBoard);
});

/* ============================
   BOTÃO VOLTAR PARA A HOME
============================ */

const homeBtn = document.getElementById("homeBtn");

if (homeBtn) {
    homeBtn.addEventListener("click", () => {
        window.location.href = "../../index.html";
    });
}

