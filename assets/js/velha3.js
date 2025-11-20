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
