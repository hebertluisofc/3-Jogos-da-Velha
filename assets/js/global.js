/* ===================================
   assets/js/global.js - Script global
=================================== */

/* ============================
   TEMA (LIGHT / DARK)
============================ */

const toggleBtn = document.getElementById("themeToggle");
const body = document.body;

/* Se existir um botão de tema na página */
if (toggleBtn) {

    /* Recupera tema salvo ou define dark como padrão */
    const savedTheme = localStorage.getItem("theme") || "dark";
    body.className = savedTheme;

    /* Define ícone inicial */
    toggleBtn.classList.add(savedTheme === "light" ? "sun" : "moon");

    /* Alternar tema */
    toggleBtn.addEventListener("click", () => {
        const isDark = body.classList.contains("dark");
        const newTheme = isDark ? "light" : "dark";

        /* Atualiza classe do body */
        body.classList.replace(isDark ? "dark" : "light", newTheme);
        localStorage.setItem("theme", newTheme);

        /* Atualiza ícone do botão */
        toggleBtn.classList.toggle("sun", newTheme === "light");
        toggleBtn.classList.toggle("moon", newTheme === "dark");
    });
}

/* ============================
   PARTÍCULAS DE FUNDO
============================ */

const canvas = document.getElementById("particlesCanvas");

if (canvas) {
    const ctx = canvas.getContext("2d");

    /* Ajusta tamanho */
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();

    /* Cores neon */
    const colors = [
        "rgba(0, 255, 255, 0.6)",
        "rgba(255, 0, 255, 0.6)",
        "rgba(0, 255, 100, 0.6)",
        "rgba(255, 255, 0, 0.6)"
    ];

    /* Partículas */
    const particles = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 0.7,
        speedY: (Math.random() - 0.5) * 0.7
    }));

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            /* Desenho */
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 15;
            ctx.fill();

            /* Movimento */
            p.x += p.speedX;
            p.y += p.speedY;

            /* Colisão com bordas */
            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        });

        requestAnimationFrame(animate);
    }

    animate();

    /* Recalcula ao redimensionar */
    window.addEventListener("resize", resizeCanvas);
}

/* ============================
   LOADER ENTRE PÁGINAS
============================ */

const loader = document.getElementById("pageLoader");

/* Remove loader após carregamento */
window.addEventListener("load", () => {
    setTimeout(() => loader?.classList.add("hidden"), 300);
});

/* Função que navega com animação */
function navigateWithLoader(url) {
    loader?.classList.remove("hidden");
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

/* Detecta qualquer link com data-nav */
document.addEventListener("click", (e) => {
    const target = e.target;

    if (target.matches("[data-nav]")) {
        e.preventDefault();
        navigateWithLoader(target.getAttribute("data-nav"));
    }
});