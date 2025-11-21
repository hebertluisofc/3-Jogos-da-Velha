/* ===================================
   assets/js/home.js - Script da Home
=================================== */

/* ============================
   NAVEGAÇÃO ENTRE JOGOS (USANDO LOADER GLOBAL)
============================ */

/**
 * Abre um jogo usando o loader global.
 */
function openGame(num) {
    const url = `assets/html/velha${num}.html`;

    // Se a função global existir, usa a navegação oficial
    if (typeof navigateWithLoader === "function") {
        navigateWithLoader(url);
    }
    else {
        // Fallback se global.js não estiver carregado
        const loader = document.getElementById("pageLoader");
        loader?.classList.remove("hidden");
        setTimeout(() => {
            window.location.href = url;
        }, 500);
    }
}


/* ============================
   POPUP (SOBRE / INFO)
============================ */

const homeBtn = document.getElementById("homeBtn");
const aboutPopup = document.getElementById("aboutPopup");
const closeAbout = document.getElementById("closeAbout");

if (homeBtn && aboutPopup) {

    /* Abrir popup */
    homeBtn.addEventListener("click", () => {
        aboutPopup.style.display = "flex";
    });

    /* Fechar no botão X */
    closeAbout?.addEventListener("click", () => {
        aboutPopup.style.display = "none";
    });

    /* Fechar clicando fora */
    aboutPopup.addEventListener("click", (e) => {
        if (e.target === aboutPopup) {
            aboutPopup.style.display = "none";
        }
    });
}
