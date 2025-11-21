/* ===================================
   assets/js/home.js - Script específico para a página home
=================================== */

/* ============================
   NAVEGAÇÃO ENTRE JOGOS
============================ */

function openGame(num) {
    document.getElementById("pageLoader").classList.remove("fade-out");
    window.location.href = `assets/html/velha${num}.html`;
}


/* ============================
   POPUP GERAL DA HOME
============================ */

const homeBtn = document.getElementById("homeBtn");
const aboutPopup = document.getElementById("aboutPopup");
const closeAbout = document.getElementById("closeAbout");

if (homeBtn && aboutPopup) {

    // abrir
    homeBtn.addEventListener("click", () => {
        aboutPopup.style.display = "flex";
    });

    // fechar
    closeAbout.addEventListener("click", () => {
        aboutPopup.style.display = "none";
    });

    // fechar clicando fora da caixa
    aboutPopup.addEventListener("click", (e) => {
        if (e.target === aboutPopup) {
            aboutPopup.style.display = "none";
        }
    });
}