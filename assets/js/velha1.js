/* ===================================
   assets/js/velha1.js - Jogo da Velha 1
=================================== */

/* ========================
   1. ELEMENTOS DA INTERFACE
   ======================== */
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("gameStatus");
const restartBtn = document.getElementById("restartBtn");
const homeBtn = document.getElementById("homeBtn");
const helpBtn = document.getElementById("helpBtn");
const helpPopup = document.getElementById("helpPopup");
const closeHelp = document.getElementById("closeHelp");

/* ========================
   2. VARIÁVEIS DO JOGO
   ======================== */
let board = Array(9).fill("");
let currentPlayer = "X";
let running = true;

const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

/* ========================
   3. EVENTOS
   ======================== */
cells.forEach(cell => cell.addEventListener("click", cellClicked));
restartBtn.addEventListener("click", restartGame);
homeBtn.addEventListener("click", () => window.location.href = "../../index.html");

helpBtn.addEventListener("click", () => helpPopup.style.display = "flex");
closeHelp.addEventListener("click", () => helpPopup.style.display = "none");
helpPopup.addEventListener("click", e => { if (e.target === helpPopup) helpPopup.style.display = "none"; });

/* ========================
   4. INICIALIZAÇÃO
   ======================== */
window.addEventListener("load", () => { helpPopup.style.display = "flex"; });
updateStatus();

/* ========================
   5. FUNÇÕES PRINCIPAIS
   ======================== */
function cellClicked() {
    const index = this.dataset.index;
    if (board[index] !== "" || !running) return;

    board[index] = currentPlayer;
    this.textContent = currentPlayer;
    this.classList.add("filled", currentPlayer === "X" ? "x" : "o");

    checkWinner();
}

function checkWinner() {
    let winningPattern = null;

    for (const p of winPatterns) {
        const [a, b, c] = p;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            winningPattern = p;
            break;
        }
    }

    if (winningPattern) {
        const colorClass = currentPlayer === "X" ? "x-turn" : "o-turn";
        statusText.innerHTML = `Jogador <span class="${colorClass}">${currentPlayer}</span> venceu!`;
        running = false;

        winningPattern.forEach(i => cells[i].classList.add("win"));
        return;
    }

    if (!board.includes("")) {
        statusText.textContent = "Deu velha!";
        running = false;

        const boardEl = document.querySelector(".board");
        boardEl.classList.remove("board-x", "board-o");
        boardEl.classList.add("board-neutral");
        return;
    }

    changePlayer();
}

/* ========================
   6. FUNÇÕES AUXILIARES
   ======================== */
function updateStatus() {
    if (!running) return;

    const colorClass = currentPlayer === "X" ? "x-turn" : "o-turn";
    statusText.innerHTML = `Vez do jogador: <span class="${colorClass}">${currentPlayer}</span>`;

    const boardEl = document.querySelector(".board");
    boardEl.classList.remove("board-x", "board-o");
    boardEl.classList.add(currentPlayer === "X" ? "board-x" : "board-o");
}

function changePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus();
}

/* ========================
   7. REINICIAR JOGO
   ======================== */
function restartGame() {
    board.fill("");
    currentPlayer = "X";
    running = true;

    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("filled","x","o","win");
        cell.style.animation = "";
    });

    const boardEl = document.querySelector(".board");
    boardEl.classList.remove("board-neutral","board-x","board-o");
    boardEl.classList.add("board-x");

    updateStatus();
}