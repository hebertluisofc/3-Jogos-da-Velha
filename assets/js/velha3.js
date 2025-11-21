/* ===================================
   assets/js/velha3.js - Jogo da Velha 3 (Ultimate Tic Tac Toe)
=================================== */

/* ========================
   1. ELEMENTOS DA INTERFACE
   ======================== */
const bigCells = document.querySelectorAll(".cell"); // Células do tabuleiro grande
const homeBtn = document.getElementById("homeBtn");
const helpBtn = document.getElementById("helpBtn");
const helpPopup = document.getElementById("helpPopup");
const closeHelp = document.getElementById("closeHelp");

/* ========================
   2. EVENTOS
   ======================== */

// Popup de ajuda
window.addEventListener("load", () => {
    helpPopup.style.display = "flex";
});

helpBtn.addEventListener("click", () => helpPopup.style.display = "flex");
closeHelp.addEventListener("click", () => helpPopup.style.display = "none");

helpPopup.addEventListener("click", e => {
    if (e.target === helpPopup) helpPopup.style.display = "none";
});

// Botão Home
if (homeBtn) {
    homeBtn.addEventListener("click", () => {
        window.location.href = "../../index.html";
    });
}

/* ========================
   3. CRIAÇÃO DOS TABULEIROS
   ======================== */
bigCells.forEach((bigCell, bigIndex) => {

    const smallBoard = document.createElement("div");
    smallBoard.classList.add("small-board");

    for (let i = 0; i < 9; i++) {
        const smallCell = document.createElement("div");
        smallCell.classList.add("small-cell");

        smallCell.dataset.index = i;      // Índice da célula dentro do tabuleiro pequeno
        smallCell.dataset.bigIndex = bigIndex; // Índice do tabuleiro grande que pertence

        smallBoard.appendChild(smallCell);
    }

    bigCell.appendChild(smallBoard);
});