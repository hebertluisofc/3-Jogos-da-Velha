/* ===================================
   assets/js/velha1.js - Script específico para o jogo da velha 1
=================================== */

// ========================
// ELEMENTOS DA INTERFACE
// ========================
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("gameStatus");
const restartBtn = document.getElementById("restartBtn");
const homeBtn = document.getElementById("homeBtn");
const helpBtn = document.getElementById("helpBtn");
const helpPopup = document.getElementById("helpPopup");
const closeHelp = document.getElementById("closeHelp");

// ========================
// VARIÁVEIS DO JOGO
// ========================
let board = Array(9).fill("");
let currentPlayer = "X";
let running = true;

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
    [0, 4, 8], [2, 4, 6]             // Diagonais
];

// ========================
// REGISTRO DE EVENTOS
// ========================

// Células
cells.forEach(cell => cell.addEventListener("click", cellClicked));

// Botões principais
restartBtn.addEventListener("click", restartGame);
homeBtn.addEventListener("click", () => window.location.href = "../../index.html");

// Popup de ajuda
helpBtn.addEventListener("click", () => helpPopup.style.display = "flex");
closeHelp.addEventListener("click", () => helpPopup.style.display = "none");
helpPopup.addEventListener("click", e => {
    if (e.target === helpPopup) helpPopup.style.display = "none";
});

// Atualização inicial
updateStatus();

// ========================
// Mostrar popup de ajuda ao entrar na página
// ========================
window.addEventListener("load", () => {
    helpPopup.style.display = "flex"; // abre o popup automaticamente
});

// ========================
// FUNÇÕES DO JOGO
// ========================

// Clique em uma célula
function cellClicked() {
    const index = this.dataset.index;

    if (board[index] !== "" || !running) return;

    board[index] = currentPlayer;
    this.textContent = currentPlayer;

    // Aplica cor da letra
    this.classList.add("filled", currentPlayer === "X" ? "x" : "o");

    checkWinner();
}

// Atualiza texto "Vez do jogador"
function updateStatus() {
    if (!running) return;

    const colorClass = currentPlayer === "X" ? "x-turn" : "o-turn";

    // Atualiza mensagem
    statusText.innerHTML = `Vez do jogador: <span class="${colorClass}">${currentPlayer}</span>`;

    // 🔥 Atualiza cor da borda dinamicamente
    const boardEl = document.querySelector(".board");
    boardEl.classList.remove("board-x", "board-o");
    boardEl.classList.add(currentPlayer === "X" ? "board-x" : "board-o");
}

// Alterna jogador
function changePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus();
}

// Verifica vitória ou empate
function checkWinner() {
    let winningPattern = null;

    // Procura padrão vencedor
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            winningPattern = pattern;
            break;
        }
    }

    if (winningPattern) {
        const colorClass = currentPlayer === "X" ? "x-turn" : "o-turn";

        statusText.innerHTML =
            `Jogador <span class="${colorClass}">${currentPlayer}</span> venceu!`;
        running = false;

        // 🔥 Aplica animação nas 3 células vencedoras
        winningPattern.forEach(index => {
            cells[index].classList.add("win");
        });

        return;
    }

    // Empate
    if (!board.includes("")) {
    statusText.textContent = "Deu velha!";
    running = false;

    const boardEl = document.querySelector(".board");
    boardEl.classList.remove("board-x", "board-o");
    boardEl.classList.add("board-neutral");

    return;
}

    // Continua o jogo
    changePlayer();
}

// Reinicia o jogo
function restartGame() {
    board.fill("");
    currentPlayer = "X";
    running = true;

    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("filled", "x", "o", "win");
        cell.style.animation = ""; // reset total
    });

    const boardEl = document.querySelector(".board");
    boardEl.classList.remove("board-neutral", "board-x", "board-o");
    boardEl.classList.add("board-x"); // X sempre começa

    updateStatus();
}

