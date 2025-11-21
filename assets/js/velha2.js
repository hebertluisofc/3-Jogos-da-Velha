/* ===================================
   assets/js/velha2.js - Script específico para o jogo da velha 2
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
const timerDisplay = document.getElementById("timer");

// ========================
// VARIÁVEIS
// ========================
let board = Array(9).fill("");
let currentPlayer = "X";
let running = true;
let playerMoves = { X: 0, O: 0 };
let maxPieces = 3;
let selectedPiece = null;

let timer = null;
let timeLimit = 3.0; // segundos por jogada
let timeRemaining = timeLimit;
let timerActive = false; // só inicia após primeira jogada

const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

// ========================
// EVENTOS
// ========================
cells.forEach(cell => cell.addEventListener("click", cellClicked));
restartBtn.addEventListener("click", restartGame);
homeBtn.addEventListener("click", () => window.location.href = "../../index.html");
helpBtn.addEventListener("click", () => helpPopup.style.display = "flex");
closeHelp.addEventListener("click", () => helpPopup.style.display = "none");
helpPopup.addEventListener("click", e => { if(e.target === helpPopup) helpPopup.style.display = "none"; });

// ========================
// INICIALIZAÇÃO
// ========================
updateStatus();
updateTimerDisplay(); // ⏳ 3.00, cor inicial, sem iniciar a contagem

// ========================
// Mostrar popup de ajuda ao entrar na página
// ========================
window.addEventListener("load", () => {
    helpPopup.style.display = "flex"; // abre o popup automaticamente
});

// ========================
// FUNÇÕES PRINCIPAIS
// ========================
function cellClicked() {
    if (!running) return;
    const index = parseInt(this.dataset.index);

    // Inicia timer na primeira jogada
    if (!timerActive) {
        startTimer();
        timerActive = true;
    }

    // Mover peça
    if (selectedPiece !== null) {
        if (board[index] === "") {
            movePiece(selectedPiece, index);
            selectedPiece = null;
            cells.forEach(c => c.classList.remove("selected"));
            if(running) resetTimer();
        } else if (board[index] === currentPlayer) {
            cells[selectedPiece].classList.remove("selected");
            selectedPiece = index;
            this.classList.add("selected");
        }
        return;
    }

    // Colocando peças iniciais
    if (playerMoves[currentPlayer] < maxPieces) {
        if (board[index] !== "") return;
        placePiece(index);
        return;
    }

    // Selecionar peça própria para mover
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
    cells[fromIndex].classList.remove("filled","x","o","win","selected");

    if (!checkWinner(currentPlayer)) {
        changePlayer();
        resetTimer();
    } else {
        stopTimer();
    }
}

function updateStatus() {
    if (!running) return;
    const colorClass = currentPlayer === "X" ? "x-turn" : "o-turn";
    statusText.innerHTML = `Vez do jogador: <span class="${colorClass}">${currentPlayer}</span>`;
    const boardEl = document.querySelector(".board");
    boardEl.classList.remove("board-x","board-o");
    boardEl.classList.add(currentPlayer === "X" ? "board-x" : "board-o");
}

function changePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus();
}

// ========================
// TIMER
// ========================
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
    const hourglass = "⏳";
    timerDisplay.textContent = `${hourglass} ${timeRemaining.toFixed(2)}`;

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
    statusText.innerHTML = `Jogador <span class="${currentPlayer === "X" ? "x-turn" : "o-turn"}">${currentPlayer}</span> perdeu por tempo!`;
}

// ========================
// VERIFICAR VITÓRIA
// ========================
function checkWinner(player) {
    let winningPattern = null;
    for (const pattern of winPatterns) {
        const [a,b,c] = pattern;
        if(board[a] && board[a]===board[b] && board[a]===board[c]){
            winningPattern = pattern;
            break;
        }
    }

    if(winningPattern){
        running = false;
        const colorClass = player==="X"?"x-turn":"o-turn";
        statusText.innerHTML = `Jogador <span class="${colorClass}">${player}</span> venceu!`;

        winningPattern.forEach(i => {
            cells[i].classList.add("win");
            cells[i].classList.remove("x","o");
            cells[i].classList.add(player==="X"?"x":"o");
        });

        const boardEl = document.querySelector(".board");
        boardEl.classList.remove("board-x","board-o");
        boardEl.classList.add(player==="X"?"board-x":"board-o");

        stopTimer();
        return true;
    }
    return false;
}

// ========================
// REINICIAR
// ========================
function restartGame() {
    board.fill("");
    currentPlayer = "X";
    running = true;
    playerMoves = { X:0, O:0 };
    selectedPiece = null;

    cells.forEach(c=>{
        c.textContent = "";
        c.classList.remove("filled","x","o","win","selected");
        c.style.animation="";
    });

    const boardEl = document.querySelector(".board");
    boardEl.classList.remove("board-x","board-o");
    boardEl.classList.add("board-x");

    stopTimer(); // para timer caso estivesse rodando
    timerActive = false;
    timeRemaining = timeLimit;
    updateTimerDisplay();

    updateStatus();
}
