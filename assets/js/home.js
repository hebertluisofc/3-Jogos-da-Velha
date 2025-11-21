/* ===================================
   assets/js/home.js - Script da Home
=================================== */

/* ============================
   ABRIR JOGOS USANDO LOADER GLOBAL
============================ */

function openGame(num) {
    const url = `assets/html/velha${num}.html`;

    if (typeof navigateWithLoader === "function") {
        navigateWithLoader(url);
    } else {
        const loader = document.getElementById("pageLoader");
        loader?.classList.remove("hidden");
        setTimeout(() => {
            window.location.href = url;
        }, 500);
    }
}

/* ============================
   POPUP DA HOME (USANDO bindPopup())
============================ */

bindPopup(
    document.getElementById("homeBtn"),
    document.getElementById("aboutPopup"),
    document.getElementById("closeAbout")
);