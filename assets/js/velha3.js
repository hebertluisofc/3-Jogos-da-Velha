/* ===================================
   assets/js/velha3.js - Jogo da Velha 3 (Ultimate Tic Tac Toe)
=================================== */

/* ========================
   1. ELEMENTOS DA INTERFACE
======================== */
const bigCells = document.querySelectorAll(".cell"); // Células do tabuleiro grande
const homeBtn = document.getElementById("homeBtn");
const restartBtn = document.getElementById("restartBtn");
const helpBtn = document.getElementById("helpBtn");
const helpPopup = document.getElementById("helpPopup");
const closeHelp = document.getElementById("closeHelp");
const statusText = document.getElementById("gameStatus");

/* ========================
   2. EVENTOS
======================== */
window.addEventListener("load", () => { helpPopup.style.display = "flex"; });

helpBtn.addEventListener("click", () => helpPopup.style.display = "flex");
closeHelp.addEventListener("click", () => helpPopup.style.display = "none");
helpPopup.addEventListener("click", e => { if (e.target === helpPopup) helpPopup.style.display = "none"; });

if (homeBtn) {
    homeBtn.addEventListener("click", () => {
        window.location.href = "../../index.html";
    });
}

if (restartBtn) {
    restartBtn.addEventListener("click", restartGame);
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

        smallCell.dataset.index = i;      // índice da célula no tabuleiro pequeno
        smallCell.dataset.bigIndex = bigIndex; // índice do tabuleiro grande

        smallBoard.appendChild(smallCell);
    }

    bigCell.appendChild(smallBoard);
});

/* ========================
   4. VARIÁVEIS DO JOGO
======================== */
let currentPlayer = "X";
let running = true;
let activeBigIndex = null; // null = qualquer tabuleiro no início
const bigBoards = Array.from(bigCells).map(cell => cell.querySelector(".small-board"));

/* ========================
   5. FUNÇÃO DE DESTAQUE DO TABULEIRO ATIVO
======================== */
function updateActiveBoard() {
    bigCells.forEach((bigCell, index) => {
        bigCell.classList.remove("active-board-x", "active-board-o");

        if (!running) return;

        if (activeBigIndex === null || activeBigIndex === index) {
            bigCell.classList.add(currentPlayer === "X" ? "active-board-x" : "active-board-o");
        }
    });

    if (statusText) {
        statusText.innerHTML = `Vez do jogador: <span class="${currentPlayer === "X" ? "x-turn" : "o-turn"}">${currentPlayer}</span>`;
    }
}

/* ========================
   6. EVENTOS DE CLIQUE NAS CÉLULAS
======================== */
bigBoards.forEach((smallBoard, bigIndex) => {
    const smallCells = smallBoard.querySelectorAll(".small-cell");

    smallCells.forEach(cell => {
        cell.addEventListener("click", () => {
            if (!running) return;

            if (activeBigIndex !== null && activeBigIndex !== bigIndex) return;
            if (cell.textContent !== "") return;

            cell.textContent = currentPlayer;
            cell.style.color = currentPlayer === "X" ? "var(--playerX)" : "var(--playerY)";

            activeBigIndex = parseInt(cell.dataset.index);
            currentPlayer = currentPlayer === "X" ? "O" : "X";

            updateActiveBoard();
        });
    });
});

/* ========================
   6b. HOVER DINÂMICO PARA CÉLULAS PEQUENAS
======================== */
bigBoards.forEach((smallBoard, bigIndex) => {
    const smallCells = smallBoard.querySelectorAll(".small-cell");

    smallCells.forEach(cell => {
        cell.addEventListener("mouseenter", () => {
            if (!running) return;
            if (cell.textContent !== "") return; // não altera hover se célula preenchida
            if (activeBigIndex !== null && activeBigIndex !== bigIndex) return; // só hover se tabuleiro ativo

            // Aplica cor do jogador da vez
            cell.style.background = currentPlayer === "X" 
                ? "rgba(0, 255, 255, 0.2)"   // mesma cor do X
                : "rgba(255, 0, 255, 0.2)"; // mesma cor do O
            cell.style.transform = "scale(1.05)";
        });

        cell.addEventListener("mouseleave", () => {
            cell.style.background = "rgba(255, 255, 255, 0.1)"; // cor padrão
            cell.style.transform = "scale(1)";
        });
    });
});


/* ========================
   7. FUNÇÃO DE REINICIAR
======================== */
function restartGame() {
    // Limpa todas as células pequenas
    bigBoards.forEach(smallBoard => {
        smallBoard.querySelectorAll(".small-cell").forEach(cell => {
            cell.textContent = "";
            cell.style.color = ""; // remove cor do jogador
        });
    });

    // Reseta variáveis do jogo
    currentPlayer = "X";
    running = true;
    activeBigIndex = null; // qualquer tabuleiro ativo no início

    // Atualiza bordas e status
    updateActiveBoard();
}

/* ========================
   8. INICIALIZAÇÃO
======================== */
window.addEventListener("load", () => {
    updateActiveBoard();
    helpPopup.style.display = "flex";
});
