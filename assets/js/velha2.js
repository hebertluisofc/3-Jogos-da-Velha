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

const timerSelectorContainer = document.getElementById("timerSelectorContainer");
const timerRange = document.getElementById("timerRange");
const timerValue = document.getElementById("timerValue");
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
let timeLimit = parseFloat(timerRange.value);
let timeRemaining = timeLimit;
let timerActive = false;

const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
];

// Thumb colors
const thumbColors = {
    1: "#ff0048",
    2: "#ff5e00",
    3: "#ffb300",
    4: "#fdd77d",
    5: "#00ffa6",
    6: "#00eaff"  
};

/* ========================
   3. EVENTOS
======================== */
cells.forEach(cell => cell.addEventListener("click", cellClicked));
restartBtn.addEventListener("click", restartGame);
homeBtn.addEventListener("click", () => window.location.href = "../../index.html");

helpBtn.addEventListener("click", () => helpPopup.style.display = "flex");
closeHelp.addEventListener("click", () => helpPopup.style.display = "none");
helpPopup.addEventListener("click", e => { if(e.target===helpPopup) helpPopup.style.display="none"; });

// Slider
timerRange.addEventListener("input", () => {
    const val = parseInt(timerRange.value);
    updateThumbColor(val);
});

/* ========================
   4. INICIALIZAÇÃO
======================== */
window.addEventListener("load", () => {
    helpPopup.style.display = "flex";
    updateStatus();
    updateTimerDisplay();
    updateThumbColor(timerRange.value);
    // Inicialmente: mostra seletor, esconde timer
    timerDisplay.style.display = "none";
    timerSelectorContainer.style.display = "flex";
});

/* ========================
   5. FUNÇÕES PRINCIPAIS
======================== */
function cellClicked() {
    if (!running) return;

    // Configura tempo antes da primeira jogada
    if (!timerActive) {
        timeLimit = parseInt(timerRange.value);
        if (timeLimit === 6) timeLimit = Infinity;
        timeRemaining = timeLimit;
        startTimer();
        timerActive = true;

        // Oculta seletor, mostra timer
        timerSelectorContainer.style.display = "none";
        timerDisplay.style.display = "flex";
    }

    const index = parseInt(this.dataset.index);

    // Movendo peça
    if (selectedPiece !== null) {
        if (board[index] === "") {
            movePiece(selectedPiece, index);
            selectedPiece = null;
            cells.forEach(c => c.classList.remove("selected"));
            if (running && timeLimit !== Infinity) resetTimer();
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
        if (timeLimit !== Infinity) resetTimer();
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
        if (timeLimit !== Infinity) resetTimer();
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
}

function changePlayer() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus();
}

function updateThumbColor(value) {
    const color = thumbColors[value] || "var(--btn-velha3)";
    timerRange.style.setProperty("--thumb-color", color);
    timerRange.style.setProperty("--moz-thumb-color", color);

    if (value == 6) {
        timerValue.textContent = "♾️";
        timerValue.style.color = thumbColors[6]; // azul
    } else {
        timerValue.textContent = value + "s";
        timerValue.style.color = color; // mesma cor do thumb
    }
}

/* ========================
   7. TIMER
======================== */
function startTimer() {
    if(timeLimit === Infinity) {
        timerDisplay.textContent = "⏳ ♾️";
        return;
    }

    clearInterval(timer);
    timeRemaining = timeLimit;
    updateTimerDisplay();

    timer = setInterval(() => {
        timeRemaining -= 0.01;
        if(timeRemaining <= 0) {
            clearInterval(timer);
            timeRemaining = 0;
            updateTimerDisplay();
            endGameByTimeout();
        } else updateTimerDisplay();
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
    if (timeLimit === Infinity) {
        timerDisplay.textContent = "⏳ ♾️";
        timerDisplay.style.color = thumbColors[6]; // azul
        return;
    }

    // Determina o segundo atual (arredonda para cima)
    const currentSecond = Math.ceil(timeRemaining);

    // Para cores, pegamos do 1 até timeLimit
    let colorIndex = Math.min(currentSecond, timeLimit); // evita passar do número máximo
    timerDisplay.style.color = thumbColors[colorIndex];

    timerDisplay.textContent = `⏳ ${timeRemaining.toFixed(2)}`;
}

/* ========================
   8. VERIFICAÇÃO DE VITÓRIA
======================== */
function checkWinner(player) {
    let winningPattern = null;

    for (const p of winPatterns) {
        const [a,b,c] = p;
        if(board[a] && board[a] === board[b] && board[a] === board[c]){
            winningPattern = p;
            break;
        }
    }

    if(winningPattern){
        running = false;
        const colorClass = player === "X" ? "x-turn" : "o-turn";
        statusText.innerHTML = `Jogador <span class="${colorClass}">${player}</span> venceu!`;

        winningPattern.forEach(i=>{
            cells[i].classList.add("win");
            cells[i].classList.remove("x","o");
            cells[i].classList.add(player==="X"?"x":"o");
        });

        stopTimer();
        return true;
    }

    return false;
}

/* ========================
   9. FIM POR TEMPO
======================== */
function endGameByTimeout() {
    running = false;
    const colorClass = currentPlayer==="X"?"x-turn":"o-turn";
    statusText.innerHTML = `Jogador <span class="${colorClass}">${currentPlayer}</span> perdeu!`;
}

/* ========================
   10. REINICIAR JOGO
======================== */
function restartGame(){
    board.fill("");
    currentPlayer = "X";
    running = true;

    playerMoves = { X:0, O:0 };
    selectedPiece = null;

    cells.forEach(c=>{
        c.textContent="";
        c.classList.remove("filled","x","o","win","selected");
    });

    // Reseta timer e seletor
    timerDisplay.style.display="none";
    timerSelectorContainer.style.display="flex";
    timerActive = false;
    timeLimit = parseInt(timerRange.value);
    timeRemaining = timeLimit;
    updateThumbColor(timerRange.value);
    updateTimerDisplay();
    updateStatus();
}
