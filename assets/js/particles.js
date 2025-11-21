/* ===================================
   assets/js/particles.js - Partículas da Home
=================================== */

const canvas = document.getElementById("particlesCanvas");

if (canvas) {
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();

    const colors = [
        "rgba(0, 255, 255, 0.6)",
        "rgba(255, 0, 255, 0.6)",
        "rgba(0, 255, 100, 0.6)",
        "rgba(255, 255, 0, 0.6)"
    ];

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
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 15;
            ctx.fill();

            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        });

        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("resize", resizeCanvas);
}