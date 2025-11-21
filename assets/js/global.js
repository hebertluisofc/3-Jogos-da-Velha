/* ============================
   TOGGLE DE TEMA GLOBAL
============================ */

/* Referências */
const toggleBtn = document.getElementById("themeToggle");
const body = document.body;

/* Garante que o botão exista (caso alguma página não tenha) */
if (toggleBtn) {

    /* Tema salvo ou padrão */
    const savedTheme = localStorage.getItem("theme") || "dark";
    body.className = savedTheme;

    /* Define o ícone inicial */
    toggleBtn.classList.add(savedTheme === "light" ? "sun" : "moon");

    /* Alternância Light/Dark */
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
   PARTÍCULAS DE FUNDO
============================ */

const canvas = document.getElementById("particlesCanvas");
if (canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = [
        "rgba(0, 255, 255, 0.6)",   // ciano neon
        "rgba(255, 0, 255, 0.6)",   // magenta neon
        "rgba(0, 255, 100, 0.6)",   // verde neon
        "rgba(255, 255, 0, 0.6)"    // amarelo neon
    ];

    const particles = [];

    for (let i = 0; i < 40; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: (Math.random() - 0.5) * 0.7,
            speedY: (Math.random() - 0.5) * 0.7
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 15;
            ctx.fill();

            p.x += p.speedX;
            p.y += p.speedY;

            // rebote nas bordas
            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        });

        requestAnimationFrame(animate);
    }

    animate();

    // redimensiona com a janela
    window.addEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

/* ============================
   LOADER ENTRE PÁGINAS
============================ */

const loader = document.getElementById("pageLoader");

// Remove o loader após carregar
window.addEventListener("load", () => {
    setTimeout(() => loader.classList.add("hidden"), 300);
});

// Função para transição ao trocar de páginas
function navigateWithLoader(url) {
    loader.classList.remove("hidden");
    setTimeout(() => {
        window.location.href = url;
    }, 500); // tempo da animação de saída
}

// Intercepta botões "Voltar", "Home", "Velha"
document.addEventListener("click", (e) => {
    const target = e.target;

    // Qualquer elemento com atributo data-nav
    if (target.matches("[data-nav]")) {
        e.preventDefault();
        const url = target.getAttribute("data-nav");
        navigateWithLoader(url);
    }
});
