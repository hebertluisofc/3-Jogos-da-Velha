/* ===================================
   assets/js/velha3.js - Jogo da Velha 3 (Ultimate Tic Tac Toe)
   Versão atualizada — retorna somente "X", "O" ou null para tabuleiros menores
=================================== */

/* ========================
   1. ELEMENTOS DA INTERFACE
======================== */
const bigCells = document.querySelectorAll(".cell"); // 9 células grandes
const homeBtn = document.getElementById("homeBtn");
const restartBtn = document.getElementById("restartBtn");
const helpBtn = document.getElementById("helpBtn");
const helpPopup = document.getElementById("helpPopup");
const closeHelp = document.getElementById("closeHelp");
const statusText = document.getElementById("gameStatus");

/* ========================
   2. EVENTOS (UI)
======================== */
window.addEventListener("load", () => { helpPopup?.style && (helpPopup.style.display = "flex"); });

helpBtn?.addEventListener("click", () => { if (helpPopup) helpPopup.style.display = "flex"; });
closeHelp?.addEventListener("click", () => { if (helpPopup) helpPopup.style.display = "none"; });
helpPopup?.addEventListener("click", e => { if (e.target === helpPopup) helpPopup.style.display = "none"; });

if (homeBtn) {
    homeBtn.addEventListener("click", () => {
        window.location.href = "../../index.html";
    });
}

if (restartBtn) {
    restartBtn.addEventListener("click", restartGame);
}

/* ========================
   3. CRIAÇÃO DINÂMICA DOS TABULEIROS MENORES
======================== */
bigCells.forEach((bigCell, bigIndex) => {
    const smallBoard = document.createElement("div");
    smallBoard.classList.add("small-board");

    for (let i = 0; i < 9; i++) {
        const smallCell = document.createElement("div");
        smallCell.classList.add("small-cell");

        smallCell.dataset.index = i;      // índice dentro do tabuleiro pequeno
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

// Controle de tabuleiros finalizados:
// null = jogável | "X" ou "O" = vencedor
let finishedBoards = Array(9).fill(null);

/* ========================
   5. ATUALIZAÇÃO DO DESTAQUE (TABULEIRO ATIVO)
======================== */
function updateActiveBoard() {
    bigCells.forEach((bigCell, index) => {
        bigCell.classList.remove("active-board-x", "active-board-o");

        if (!running) return;
        if (finishedBoards[index] !== null) return; // tabuleiro finalizado não pisca

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
   -> Retorna "X", "O" ou null (NUNCA retorna "D")
======================== */
function checkSmallBoardWinner(bigIndex) {
    const board = bigBoards[bigIndex];
    const cells = Array.from(board.querySelectorAll(".small-cell")).map(c => c.textContent);

    const wins = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

    for (const [a,b,c] of wins) {
        if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
            return cells[a]; // "X" ou "O"
        }
    }

    // Se o tabuleiro estiver cheio e não houver linha vencedora,
    // retornamos null aqui — a regra de 'penúltimo vence' será aplicada
    // no manipulador de clique (para preservar quem foi o último a jogar).
    return null;
}

/* ========================
   7. MARCAR TABULEIRO GRANDE COM OVERLAY (símbolo grande)
======================== */
function markBigBoard(bigCell, winner) {
    if (!bigCell || bigCell.querySelector(".winner-overlay")) return;

    const overlay = document.createElement("div");
    overlay.classList.add("winner-overlay");
    overlay.textContent = winner;

    // Cor do símbolo grande (sólida)
    overlay.style.color = winner === "X" ? "var(--playerX)" : "var(--playerY)";

    bigCell.appendChild(overlay);
    bigCell.classList.add("board-finished");

    // garantir que small-board fique translúcido (CSS controla .board-finished .small-board)
}

/* ========================
   8. CLIQUE NAS CÉLULAS (LÓGICA DE JOGADA)
======================== */
bigBoards.forEach((smallBoard, bigIndex) => {
    const smallCells = smallBoard.querySelectorAll(".small-cell");

    smallCells.forEach(cell => {
        cell.addEventListener("click", () => {
            if (!running) return;

            // se tabuleiro já finalizado, bloqueia
            if (finishedBoards[bigIndex] !== null) return;

            // se existe um tabuleiro ativo diferente deste, bloqueia
            if (activeBigIndex !== null && activeBigIndex !== bigIndex) return;

            // se célula já preenchida, bloqueia
            if (cell.textContent !== "") return;

            // jogador atual faz a jogada
            const playerWhoPlayed = currentPlayer;
            cell.textContent = playerWhoPlayed;
            cell.style.color = playerWhoPlayed === "X" ? "var(--playerX)" : "var(--playerY)";

            // 1) verifica vitória "clássica" no pequeno
            const winResult = checkSmallBoardWinner(bigIndex);

            // 2) determina vencedor do pequeno:
            // - se winResult é "X" ou "O", ele é o vencedor
            // - senão, se o tabuleiro ficou cheio após a jogada, o vencedor é o PENÚLTIMO jogador
            let winner = null;

            if (winResult === "X" || winResult === "O") {
                winner = winResult;
            } else {
                // checa se ficou cheio
                const smallCellsNow = Array.from(bigBoards[bigIndex].querySelectorAll(".small-cell"));
                const isFull = smallCellsNow.every(c => c.textContent !== "");

                if (isFull) {
                    // penúltimo jogador vence (quem jogou antes do 'playerWhoPlayed')
                    winner = playerWhoPlayed === "X" ? "O" : "X";
                }
            }

            // se houver vencedor para o tabuleiro menor, marca e bloqueia
            if (winner && finishedBoards[bigIndex] === null) {
                finishedBoards[bigIndex] = winner;
                markBigBoard(bigCells[bigIndex], winner);
            }

            // define próximo tabuleiro ativo: a posição (index) da célula jogada
            const nextBoard = parseInt(cell.dataset.index);

            // se o próximo já estiver finalizado, libera escolha (null)
            if (finishedBoards[nextBoard] !== null) {
                activeBigIndex = null;
            } else {
                activeBigIndex = nextBoard;
            }

            // alterna jogador
            currentPlayer = currentPlayer === "X" ? "O" : "X";

            // atualiza destaque
            updateActiveBoard();
        });
    });
});

/* ========================
   9. HOVER DINÂMICO (APENAS TABULEIRO ATIVO E NÃO FINALIZADO)
======================== */
bigBoards.forEach((smallBoard, bigIndex) => {
    const smallCells = smallBoard.querySelectorAll(".small-cell");

    smallCells.forEach(cell => {
        cell.addEventListener("mouseenter", () => {
            if (!running) return;
            if (cell.textContent !== "") return;
            if (finishedBoards[bigIndex] !== null) return;
            if (activeBigIndex !== null && activeBigIndex !== bigIndex) return;

            cell.style.background = currentPlayer === "X"
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
   10. REINICIAR PARTIDA
======================== */
function restartGame() {
    // limpa células pequenas
    bigBoards.forEach(smallBoard => {
        smallBoard.querySelectorAll(".small-cell").forEach(cell => {
            cell.textContent = "";
            cell.style.color = "";
            cell.style.background = ""; // restaura background padrao via CSS
            cell.style.transform = "";
        });
    });

    // remove overlays e estado finalizado dos tabuleiros grandes
    bigCells.forEach(c => {
        c.classList.remove("board-finished");
        const overlay = c.querySelector(".winner-overlay");
        if (overlay) overlay.remove();

        // forçar restart da animação neon aplicável (.active-board-x / o)
        c.style.animation = "none";
        void c.offsetWidth; // reflow
        c.style.animation = "";
    });

    // reset variáveis
    currentPlayer = "X";
    running = true;
    activeBigIndex = null;
    finishedBoards = Array(9).fill(null);

    updateActiveBoard();
}

/* ========================
   11. INICIALIZAÇÃO
======================== */
window.addEventListener("load", () => {
    updateActiveBoard();
    if (helpPopup) helpPopup.style.display = "flex";
});
