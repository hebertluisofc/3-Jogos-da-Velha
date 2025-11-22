/* ===================================
   assets/js/velha3.js - Jogo da Velha 3 (Ultimate Tic Tac Toe)
   Versão reorganizada, com verificação de vitória grande + destaque
=================================== */

/* ========================
   0. QUERY SELECTORS (cache)
======================== */
const bigCells = Array.from(document.querySelectorAll(".cell")); // 9 células grandes
const homeBtn = document.getElementById("homeBtn");
const restartBtn = document.getElementById("restartBtn");
const helpBtn = document.getElementById("helpBtn");
const helpPopup = document.getElementById("helpPopup");
const closeHelp = document.getElementById("closeHelp");
const statusText = document.getElementById("gameStatus");

/* ========================
   1. ESTADO DO JOGO
======================== */
let currentPlayer = "X";
let running = true;
let activeBigIndex = null; // null = qualquer tabuleiro no início

// small boards DOM references (criadas dinamicamente)
let bigBoards = [];

// finishedBoards: null = jogável | "X" | "O" = vencedor do tabuleiro grande
let finishedBoards = Array(9).fill(null);

/* ========================
   2. INICIALIZAÇÃO
======================== */
function init() {
    createSmallBoards();
    bindUI();
    bindBoardEvents();
    updateActiveBoard();
    if (helpPopup) helpPopup.style.display = "flex";
}

/* ========================
   3. CRIAÇÃO DINÂMICA DOS TABULEIROS MENORES
======================== */
function createSmallBoards() {
    bigBoards = bigCells.map((bigCell, bigIndex) => {
        // se já existir small-board (recarregar), remove para evitar duplicação
        const existing = bigCell.querySelector(".small-board");
        if (existing) existing.remove();

        const smallBoard = document.createElement("div");
        smallBoard.classList.add("small-board");

        for (let i = 0; i < 9; i++) {
            const smallCell = document.createElement("div");
            smallCell.classList.add("small-cell");

            smallCell.dataset.index = i; // índice no pequeno
            smallCell.dataset.bigIndex = bigIndex; // índice do grande

            smallBoard.appendChild(smallCell);
        }

        bigCell.appendChild(smallBoard);
        return smallBoard;
    });
}

/* ========================
   4. BIND UI (buttons, popups)
======================== */
function bindUI() {
    // help popup
    window.addEventListener("load", () => { if (helpPopup) helpPopup.style.display = "flex"; });

    helpBtn?.addEventListener("click", () => { if (helpPopup) helpPopup.style.display = "flex"; });
    closeHelp?.addEventListener("click", () => { if (helpPopup) helpPopup.style.display = "none"; });
    helpPopup?.addEventListener("click", e => { if (e.target === helpPopup) helpPopup.style.display = "none"; });

    // home
    if (homeBtn) {
        homeBtn.addEventListener("click", () => window.location.href = "../../index.html");
    }

    // restart
    if (restartBtn) {
        restartBtn.addEventListener("click", restartGame);
    }
}

/* ========================
   5. LÓGICA: VITÓRIA NO TABULEIRO MENOR
   Retorna "X", "O" ou null
======================== */
function determineSmallWinner(bigIndex) {
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

    // return null; full-board "penúltimo wins" is handled by caller
    return null;
}

/* ========================
   6. MARCAR TABULEIRO GRANDE (overlay) E VISUAL
======================== */
function markBigBoardWinner(bigIndex, winner) {
    const bigCell = bigCells[bigIndex];
    if (!bigCell) return;
    if (bigCell.querySelector(".winner-overlay")) return; // já marcado

    // overlay texto
    const overlay = document.createElement("div");
    overlay.classList.add("winner-overlay");
    overlay.textContent = winner;
    overlay.style.color = winner === "X" ? "var(--playerX)" : "var(--playerY)";
    bigCell.appendChild(overlay);

    // marca estado
    bigCell.classList.add("board-finished");
    finishedBoards[bigIndex] = winner;
}

/* ========================
   7. EVENT HANDLER: clique em célula pequena
======================== */
function handleSmallCellClick(evt) {
    if (!running) return;

    const cell = evt.currentTarget;
    const bigIndex = Number(cell.dataset.bigIndex);
    const smallIndex = Number(cell.dataset.index);

    // bloqueios iniciais
    if (finishedBoards[bigIndex] !== null) return;
    if (activeBigIndex !== null && activeBigIndex !== bigIndex) return;
    if (cell.textContent !== "") return;

    // joga
    const playerWhoPlayed = currentPlayer;
    cell.textContent = playerWhoPlayed;
    cell.style.color = playerWhoPlayed === "X" ? "var(--playerX)" : "var(--playerY)";

    // verifica vitória clássica no pequeno
    const smallWin = determineSmallWinner(bigIndex);

    // determina vencedor do pequeno (incluindo regra do penúltimo)
    let winner = null;
    if (smallWin === "X" || smallWin === "O") {
        winner = smallWin;
    } else {
        // se o pequeno ficou cheio, penúltimo vence
        const cellsNow = Array.from(bigBoards[bigIndex].querySelectorAll(".small-cell"));
        const full = cellsNow.every(c => c.textContent !== "");
        if (full) {
            winner = playerWhoPlayed === "X" ? "O" : "X";
        }
    }

    // se há vencedor no pequeno, marca e checa vitória grande
    if (winner && finishedBoards[bigIndex] === null) {
        markBigBoardWinner(bigIndex, winner);
        // checar vitória grande (linha ou maioria)
        const bigResult = checkBigBoardVictory();
        if (bigResult) {
            // se houve finalização por linha, highlight já aplicado em checkBigBoardVictory()
            // endGame será chamado ali
            return;
        }
    }

    // define próximo tabuleiro ativo
    const nextBoard = smallIndex;
    activeBigIndex = (finishedBoards[nextBoard] !== null) ? null : nextBoard;

    // alterna jogador
    currentPlayer = currentPlayer === "X" ? "O" : "X";

    updateActiveBoard();
}

/* ========================
   8. BIND EVENTOS NAS CÉLULAS PEQUENAS (hover + click)
======================== */
function bindBoardEvents() {
    bigBoards.forEach((smallBoard, bigIndex) => {
        const smallCells = smallBoard.querySelectorAll(".small-cell");

        smallCells.forEach(cell => {
            // remover listeners duplicate (se reiniciar)
            cell.replaceWith(cell.cloneNode(true));
        });

        // re-query after cloneNode
        const freshCells = smallBoard.querySelectorAll(".small-cell");

        freshCells.forEach(cell => {
            // click
            cell.addEventListener("click", handleSmallCellClick);

            // hover (condicional: só quando ativo e não finalizado)
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
}

/* ========================
   9. CHECAR VITÓRIA NO TABULEIRO GRANDE
   - retorna winner ("X" or "O") se finalizado, ou null
   - aplica destaques visuais na linha vencedora (classe .win aplicada aos 3 bigCells)
   - se nenhum linha e todos finalizados => decide por maioria e aplica destaque a todos tabuleiros do vencedor
======================== */
function checkBigBoardVictory() {
    const wins = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

    // 1) checar vitória clássica (linha)
    for (const [a,b,c] of wins) {
        if (finishedBoards[a] && finishedBoards[a] === finishedBoards[b] && finishedBoards[a] === finishedBoards[c]) {
            const winner = finishedBoards[a];

            // aplicar destaque de vitória apenas nos 3 tabuleiros da linha
            clearBigWinHighlights();
            [a,b,c].forEach(i => bigCells[i].classList.add("win"));

            // finalizar jogo
            endGame(winner, `Jogador ${winner} venceu por linha!`);
            return winner;
        }
    }

    // 2) se ainda existir tabuleiro não finalizado, não decide por pontos
    if (finishedBoards.includes(null)) return null;

    // 3) todos finalizados → decide por maioria de pontos
    const countX = finishedBoards.filter(v => v === "X").length;
    const countO = finishedBoards.filter(v => v === "O").length;

    const winner = countX > countO ? "X" : "O";

    // destacar todos os tabuleiros vencidos pelo vencedor
    clearBigWinHighlights();
    finishedBoards.forEach((v, idx) => {
        if (v === winner) bigCells[idx].classList.add("win");
    });

    endGame(winner, `Jogador ${winner} venceu por maioria (${countX} × ${countO})!`);
    return winner;
}

/* ========================
   10. REMOVER DESTAQUES DE VITÓRIA GRANDES
======================== */
function clearBigWinHighlights() {
    bigCells.forEach(c => c.classList.remove("win"));
}

/* ========================
   11. FINALIZA JOGO: atualiza status e bloqueia jogadas
   - message é opcional (texto exibido)
======================== */
function endGame(winner, message) {
    running = false;
    activeBigIndex = null;

    // remover highlights de tabuleiro ativo
    bigCells.forEach(c => c.classList.remove("active-board-x", "active-board-o"));

    // Mostrar mensagem no status (estilizada pela classe x-turn / o-turn)
    if (statusText) {
        if (message) {
            statusText.innerHTML = `<span class="${winner === "X" ? "x-turn" : "o-turn"}">${message}</span>`;
        } else {
            statusText.innerHTML = `<span class="${winner === "X" ? "x-turn" : "o-turn"}">Jogador ${winner} venceu a partida!</span>`;
        }
    }
}

/* ========================
   12. ATUALIZAÇÃO DO TABULEIRO ATIVO (bordas)
======================== */
function updateActiveBoard() {
    bigCells.forEach((bigCell, index) => {
        bigCell.classList.remove("active-board-x", "active-board-o");

        if (!running) return;
        if (finishedBoards[index] !== null) return;

        if (activeBigIndex === null || activeBigIndex === index) {
            bigCell.classList.add(currentPlayer === "X" ? "active-board-x" : "active-board-o");
        }
    });

    if (statusText) {
        statusText.innerHTML = `Vez do jogador: <span class="${currentPlayer === "X" ? "x-turn" : "o-turn"}">${currentPlayer}</span>`;
    }
}

/* ========================
   13. REINICIAR PARTIDA (RESET LIMPO)
======================== */
function restartGame() {
    // limpa pequenas
    bigBoards.forEach(smallBoard => {
        smallBoard.querySelectorAll(".small-cell").forEach(cell => {
            cell.textContent = "";
            cell.style.color = "";
            cell.style.background = "";
            cell.style.transform = "";
        });
    });

    // remove overlays e classes de status nos grandes
    bigCells.forEach(c => {
        // remove overlay
        const overlay = c.querySelector(".winner-overlay");
        if (overlay) overlay.remove();

        // remove finished & win classes
        c.classList.remove("board-finished", "win", "active-board-x", "active-board-o");

        // restart animação (sincronizar)
        c.style.animation = "none";
        void c.offsetWidth; // force reflow
        c.style.animation = "";
    });

    // reset estado
    currentPlayer = "X";
    running = true;
    activeBigIndex = null;
    finishedBoards = Array(9).fill(null);

    // recriar small boards and rebind events (safe)
    createSmallBoards();
    bindBoardEvents();

    updateActiveBoard();
}

/* ========================
   14. START
======================== */
init();
