/* ===================================
   assets/js/velha2.js - Jogo da Velha 2 (3 peças + timer)
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
const timerDisplay = document.getElementById("timer");

/* ========================
   2. VARIÁVEIS DO JOGO
   ======================== */
let board = Array(9).fill("");
let currentPlayer = "X";
let running = true;

let playerMoves = { X: 0, O: 0 };
let maxPieces = 3;
let selectedPiece = null;

// Timer
let timer = null;
let timeLimit = 3.0;
let timeRemaining = timeLimit;
let timerActive = false;

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
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
updateTimerDisplay();

/* ========================
   5. FUNÇÕES PRINCIPAIS
   ======================== */
function cellClicked() {
    if (!running) return;

    const index = parseInt(this.dataset.index);

    // Inicia timer na primeira jogada
    if (!timerActive) {
        startTimer();
        timerActive = true;
    }

    // Caso esteja movendo uma peça
    if (selectedPiece !== null) {
        if (board[index] === "") {
            movePiece(selectedPiece, index);
            selectedPiece = null;
            cells.forEach(c => c.classList.remove("selected"));
            if (running) resetTimer();
        }
        else if (board[index] === currentPlayer) {
            cells[selectedPiece].classList.remove("selected");
            selectedPiece = index;
            this.classList.add("selected");
        }
        return;
    }

    // Colocar peças iniciais (até 3)
    if (playerMoves[currentPlayer] < maxPieces) {
        if (board[index] !== "") return;
        placePiece(index);
        return;
    }

    // Selecionar peça para mover
    if (board[index] === currentPlayer) {
        if (selectedPiece !== null) cells[selectedPiece].classList.remove("selected");
        selectedPiece = index;
        this.classList.add("selected");
    }
}

function placePiece(index) {
    board[index] = currentPlayer;

    cells[index].textContent = currentPlayer;
    cells[index].classList.add("filled", currentPlayer === "X" ? "x" : "o");

    playerMoves[currentPlayer]++;

    if (!checkWinner(currentPlayer)) {
        changePlayer();
        resetTimer();
    } else {
        stopTimer();
    }
}

function movePiece(fromIndex, toIndex) {
    board[toIndex] = currentPlayer;
    board[fromIndex] = "";

    cells[toIndex].textContent = currentPlayer;
    cells[toIndex].classList.add("filled", currentPlayer === "X" ? "x" : "o");

    cells[fromIndex].textContent = "";
    cells[fromIndex].classList.remove("filled", "x", "o", "win", "selected");

    if (!checkWinner(currentPlayer)) {
        changePlayer();
        resetTimer();
    } else {
        stopTimer();
    }
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
   7. TIMER
   ======================== */
function startTimer() {
    clearInterval(timer);
    timerActive = true;

    timeRemaining = timeLimit;
    updateTimerDisplay();

    timer = setInterval(() => {
        timeRemaining -= 0.01;

        if (timeRemaining <= 0) {
            clearInterval(timer);
            timeRemaining = 0;
            updateTimerDisplay();
            endGameByTimeout();
        } else {
            updateTimerDisplay();
        }
    }, 10);
}

function resetTimer() {
    clearInterval(timer);
    timeRemaining = timeLimit;
    updateTimerDisplay();
    startTimer();
}

function stopTimer() {
    clearInterval(timer);
    timerActive = false;
    timeRemaining = timeLimit;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    timerDisplay.textContent = `⏳ ${timeRemaining.toFixed(2)}`;

    if (timeRemaining <= 1) {
        timerDisplay.style.color = "var(--btn-velha3)";
    } else if (timeRemaining <= 2) {
        timerDisplay.style.color = "var(--btn-velha2)";
    } else {
        timerDisplay.style.color = "var(--btn-velha1)";
    }
}

function endGameByTimeout() {
    running = false;
    const colorClass = currentPlayer === "X" ? "x-turn" : "o-turn";
    statusText.innerHTML = `Jogador <span class="${colorClass}">${currentPlayer}</span> perdeu!`;
}

/* ========================
   8. VERIFICAÇÃO DE VITÓRIA
   ======================== */
function checkWinner(player) {
    let winningPattern = null;

    for (const p of winPatterns) {
        const [a, b, c] = p;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            winningPattern = p;
            break;
        }
    }

    if (winningPattern) {
        running = false;

        const colorClass = player === "X" ? "x-turn" : "o-turn";
        statusText.innerHTML = `Jogador <span class="${colorClass}">${player}</span> venceu!`;

        winningPattern.forEach(i => {
            cells[i].classList.add("win");
            cells[i].classList.remove("x", "o");
            cells[i].classList.add(player === "X" ? "x" : "o");
        });

        const boardEl = document.querySelector(".board");
        boardEl.classList.remove("board-x", "board-o");
        boardEl.classList.add(player === "X" ? "board-x" : "board-o");

        stopTimer();
        return true;
    }

    return false;
}

/* ========================
   9. REINICIAR JOGO
   ======================== */
function restartGame() {
    board.fill("");
    currentPlayer = "X";
    running = true;

    playerMoves = { X: 0, O: 0 };
    selectedPiece = null;

    cells.forEach(c => {
        c.textContent = "";
        c.classList.remove("filled", "x", "o", "win", "selected");
        c.style.animation = "";
    });

    const boardEl = document.querySelector(".board");
    boardEl.classList.remove("board-x", "board-o");
    boardEl.classList.add("board-x");

    stopTimer();
    timerActive = false;

    timeRemaining = timeLimit;
    updateTimerDisplay();

    updateStatus();
}