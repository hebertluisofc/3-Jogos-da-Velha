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

        smallCell.dataset.index = i;      // índice da célula no tabuleiro menor
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

// Controle de tabuleiros finalizados
// null = jogável | "X" ou "O" = vencedor | "D" = velha
let finishedBoards = Array(9).fill(null);

/* ========================
   5. DESTAQUE DO TABULEIRO ATIVO
======================== */
function updateActiveBoard() {
    bigCells.forEach((bigCell, index) => {
        bigCell.classList.remove("active-board-x", "active-board-o");

        if (!running) return;
        if (finishedBoards[index] !== null) return; // tabuleiro já finalizado não pisca

        if (activeBigIndex === null || activeBigIndex === index) {
            bigCell.classList.add(currentPlayer === "X" ? "active-board-x" : "active-board-o");
        }
    });

    if (statusText) {
        statusText.innerHTML = `Vez do jogador: <span class="${currentPlayer === "X" ? "x-turn" : "o-turn"}">${currentPlayer}</span>`;
    }
}

/* ========================
   6. VERIFICAÇÃO DE VITÓRIA DO TABULEIRO MENOR
======================== */
function checkSmallBoardWinner(bigIndex) {
    const board = bigBoards[bigIndex];
    const cells = Array.from(board.querySelectorAll(".small-cell"))
        .map(c => c.textContent);

    const wins = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const [a, b, c] of wins) {
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
            return cells[a]; // "X" ou "O"
        }
    }

    if (cells.every(v => v !== "")) {
        return "D"; // velha
    }

    return null; // jogo continua
}

/* ========================
   6b. MARCAR TABULEIRO GRANDE COM OVERLAY
======================== */
function markBigBoard(bigCell, winner) {
    if (bigCell.querySelector(".winner-overlay")) return;

    const overlay = document.createElement("div");
    overlay.classList.add("winner-overlay");
    overlay.textContent = winner;

    // COR DO JOGADOR
    overlay.style.color = winner === "X"
        ? "var(--playerX)"
        : "var(--playerY)";

    bigCell.appendChild(overlay);
    bigCell.classList.add("board-finished");
}

/* ========================
   7. EVENTOS DE CLIQUE NAS CÉLULAS
======================== */
bigBoards.forEach((smallBoard, bigIndex) => {
    const smallCells = smallBoard.querySelectorAll(".small-cell");

    smallCells.forEach(cell => {
        cell.addEventListener("click", () => {
            if (!running) return;

            if (finishedBoards[bigIndex] !== null) return; // tabuleiro já finalizado
            if (activeBigIndex !== null && activeBigIndex !== bigIndex) return;
            if (cell.textContent !== "") return;

            cell.textContent = currentPlayer;
            cell.style.color = currentPlayer === "X" ? "var(--playerX)" : "var(--playerY)";

            // Verifica vitória no tabuleiro menor
            const result = checkSmallBoardWinner(bigIndex);

            if (result && finishedBoards[bigIndex] === null) {
                finishedBoards[bigIndex] = result;

                const winner =
                    result === "D"
                        ? (currentPlayer === "X" ? "O" : "X") // velha → penúltimo jogador
                        : result;

                markBigBoard(bigCells[bigIndex], winner);
            }

            // Próximo tabuleiro
            const nextBoard = parseInt(cell.dataset.index);

            if (finishedBoards[nextBoard] !== null) {
                activeBigIndex = null; // livre para jogar em qualquer tabuleiro ativo
            } else {
                activeBigIndex = nextBoard;
            }

            currentPlayer = currentPlayer === "X" ? "O" : "X";
            updateActiveBoard();
        });
    });
});

/* ========================
   6c. HOVER DINÂMICO
======================== */
bigBoards.forEach((smallBoard, bigIndex) => {
    const smallCells = smallBoard.querySelectorAll(".small-cell");

    smallCells.forEach(cell => {
        cell.addEventListener("mouseenter", () => {
            if (!running) return;
            if (cell.textContent !== "") return;
            if (finishedBoards[bigIndex] !== null) return;
            if (activeBigIndex !== null && activeBigIndex !== bigIndex) return;

            cell.style.background =
                currentPlayer === "X"
                    ? "rgba(0, 255, 255, 0.2)"
                    : "rgba(255, 0, 255, 0.2)";

            cell.style.transform = "scale(1.05)";
        });

        cell.addEventListener("mouseleave", () => {
            cell.style.background = "rgba(255, 255, 255, 0.1)";
            cell.style.transform = "scale(1)";
        });
    });
});

/* ========================
   7. FUNÇÃO DE REINICIAR
======================== */
function restartGame() {
    // Limpa células
    bigBoards.forEach(smallBoard => {
        smallBoard.querySelectorAll(".small-cell").forEach(cell => {
            cell.textContent = "";
            cell.style.color = "";
        });
    });

    // Remove overlays
    bigCells.forEach(c => {
        c.classList.remove("board-finished");
        const overlay = c.querySelector(".winner-overlay");
        if (overlay) overlay.remove();

        // Reset de animação neon
        c.style.animation = "none";
        void c.offsetWidth;
        c.style.animation = "";
    });

    // Resetar variáveis
    currentPlayer = "X";
    running = true;
    activeBigIndex = null;
    finishedBoards = Array(9).fill(null);

    updateActiveBoard();
}

/* ========================
   8. INICIALIZAÇÃO
======================== */
window.addEventListener("load", () => {
    updateActiveBoard();
    helpPopup.style.display = "flex";
});
