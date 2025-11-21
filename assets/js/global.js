/* ===================================
   assets/js/global.js - Script global
=================================== */

/* ============================
   TEMA (LIGHT / DARK)
============================ */

const toggleBtn = document.getElementById("themeToggle");
const body = document.body;

if (toggleBtn) {

    const savedTheme = localStorage.getItem("theme") || "dark";
    body.className = savedTheme;

    toggleBtn.classList.add(savedTheme === "light" ? "sun" : "moon");

    toggleBtn.addEventListener("click", () => {
        const isDark = body.classList.contains("dark");
        const newTheme = isDark ? "light" : "dark";

        body.classList.replace(isDark ? "dark" : "light", newTheme);
        localStorage.setItem("theme", newTheme);

        toggleBtn.classList.toggle("sun", newTheme === "light");
        toggleBtn.classList.toggle("moon", newTheme === "dark");
    });
}

/* ============================
   FUNÇÃO GLOBAL DE POPUP
============================ */

function bindPopup(openBtn, popupEl, closeBtn) {
    if (!openBtn || !popupEl) return;

    openBtn.addEventListener("click", () => {
        popupEl.style.display = "flex";
    });

    closeBtn?.addEventListener("click", () => {
        popupEl.style.display = "none";
    });

    popupEl.addEventListener("click", (e) => {
        if (e.target === popupEl) {
            popupEl.style.display = "none";
        }
    });
}

/* ============================
   LOADER ENTRE PÁGINAS
============================ */

const loader = document.getElementById("pageLoader");

window.addEventListener("load", () => {
    setTimeout(() => loader?.classList.add("hidden"), 300);
});

function navigateWithLoader(url) {
    loader?.classList.remove("hidden");
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

/* ============================
   NAVEGAÇÃO VIA data-nav
============================ */

document.addEventListener("click", (e) => {
    const target = e.target;

    if (target.matches("[data-nav]")) {
        e.preventDefault();
        navigateWithLoader(target.getAttribute("data-nav"));
    }
});
