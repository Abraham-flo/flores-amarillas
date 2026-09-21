/**
 * Módulo de Renderizado Canvas:
 * 1. Flor Amarilla y Ramillete con Espiral áurea (Fibonacci)
 * 2. Destellos y destellos procedurales
 * 3. Partículas ambientales y pétalos de fondo
 */

const canvas = document.getElementById("flower-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

const ambientCanvas = document.getElementById("ambient-canvas");
const aCtx = ambientCanvas ? ambientCanvas.getContext("2d") : null;
const particles = [];
const PARTICLE_COUNT = 40;

function drawDetailedYellowFlower(c, x, y, scaleVal, growth, isCenterQueen = false) {
    c.save();
    c.translate(x, y);
    c.scale(scaleVal * growth, scaleVal * growth);

    // Tallo orgánico
    const stemHeight = 220;
    c.save();
    c.beginPath();
    c.moveTo(0, 0);
    c.bezierCurveTo(20, stemHeight * 0.4, -15, stemHeight * 0.75, 10, stemHeight);
    c.lineWidth = 8;
    c.lineCap = "round";

    const stemGrad = c.createLinearGradient(0, 0, 10, stemHeight);
    stemGrad.addColorStop(0, "#65a30d");
    stemGrad.addColorStop(0.5, "#4d7c0f");
    stemGrad.addColorStop(1, "#3f6212");
    c.strokeStyle = stemGrad;
    c.stroke();

    // Hojas laterales
    const drawLeaf = (lx, ly, angle, side) => {
        c.save();
        c.translate(lx, ly);
        c.rotate(angle);
        c.beginPath();
        c.moveTo(0, 0);
        c.bezierCurveTo(side * 35, -20, side * 70, -10, side * 85, 15);
        c.bezierCurveTo(side * 60, 35, side * 25, 20, 0, 0);
        const lGrad = c.createLinearGradient(0, 0, side * 80, 20);
        lGrad.addColorStop(0, "#84cc16");
        lGrad.addColorStop(1, "#4d7c0f");
        c.fillStyle = lGrad;
        c.fill();
        c.restore();
    };

    drawLeaf(5, 75, 0.45, 1);
    drawLeaf(-5, 135, -0.45, -1);
    c.restore();

    // Capas de pétalos
    const layers = [
        { count: 28, length: 115, width: 22, color1: "#eab308", color2: "#ca8a04" },
        { count: 24, length: 100, width: 20, color1: "#facc15", color2: "#d97706" },
        { count: 20, length: 82, width: 17, color1: "#fef08a", color2: "#eab308" },
    ];

    layers.forEach((layer, layerIdx) => {
        const step = (Math.PI * 2) / layer.count;
        const layerAngleOffset = layerIdx * 0.15;

        for (let i = 0; i < layer.count; i++) {
            const angle = i * step + layerAngleOffset;
            c.save();
            c.rotate(angle);

            const curLen = layer.length * growth;
            const curWid = layer.width;

            c.beginPath();
            c.moveTo(0, 0);
            c.bezierCurveTo(-curWid * 0.75, curLen * 0.4, -curWid * 0.9, curLen * 0.8, 0, curLen);
            c.bezierCurveTo(curWid * 0.9, curLen * 0.8, curWid * 0.75, curLen * 0.4, 0, 0);

            const petalGrad = c.createLinearGradient(0, 0, 0, curLen);
            petalGrad.addColorStop(0, layer.color2);
            petalGrad.addColorStop(0.65, layer.color1);
            petalGrad.addColorStop(1, "#fffbeb");

            c.fillStyle = petalGrad;
            c.shadowColor = "rgba(180, 120, 20, 0.2)";
            c.shadowBlur = 6;
            c.fill();
            c.restore();
        }
    });

    // Disco central
    const coreR = 40 * growth;
    const coreGrad = c.createRadialGradient(0, 0, 2, 0, 0, coreR);
    coreGrad.addColorStop(0, "#451a03");
    coreGrad.addColorStop(0.6, "#78350f");
    coreGrad.addColorStop(0.9, "#92400e");
    coreGrad.addColorStop(1, "#b45309");

    c.beginPath();
    c.arc(0, 0, coreR, 0, Math.PI * 2);
    c.fillStyle = coreGrad;
    c.fill();

    // Semillas con filotaxis de Fibonacci
    const seedTotal = 95;
    const phi = 1.6180339887;
    for (let s = 1; s < seedTotal; s++) {
        const theta = s * phi * (Math.PI * 2);
        const rad = Math.sqrt(s / seedTotal) * (coreR - 3);
        const sx = Math.cos(theta) * rad;
        const sy = Math.sin(theta) * rad;

        c.beginPath();
        c.arc(sx, sy, 1.3, 0, Math.PI * 2);
        c.fillStyle = s % 4 === 0 ? "#fbbf24" : "#291404";
        c.fill();
    }

    c.restore();
}

function renderCanvas() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const radial = ctx.createRadialGradient(
        canvas.width / 2,
        190,
        20,
        canvas.width / 2,
        230,
        230
    );
    radial.addColorStop(0, "rgba(254, 240, 138, 0.35)");
    radial.addColorStop(0.7, "rgba(254, 240, 138, 0.08)");
    radial.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const growth = window.appState.growthProgress;

    if (!window.appState.isBouquet) {
        drawDetailedYellowFlower(ctx, canvas.width / 2, 190, 1.25, growth, true);
    } else {
        const flowers = [
            { x: canvas.width / 2 - 75, y: 195, scale: 0.9 },
            { x: canvas.width / 2 + 75, y: 200, scale: 0.9 },
            { x: canvas.width / 2 - 40, y: 155, scale: 1.05 },
            { x: canvas.width / 2 + 40, y: 150, scale: 1.05 },
            { x: canvas.width / 2,      y: 140, scale: 1.22 },
        ];

        flowers.forEach((f) => {
            drawDetailedYellowFlower(ctx, f.x, f.y, f.scale, growth);
        });

        // Lazo dorado
        const ribY = 380;
        const ribX = canvas.width / 2;
        ctx.save();
        ctx.translate(ribX, ribY);

        ctx.fillStyle = "#d97706";
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-50, -35, -55, 25, 0, 8);
        ctx.bezierCurveTo(55, 25, 50, -35, 0, 0);

        ctx.beginPath();
        ctx.moveTo(-4, 5);
        ctx.bezierCurveTo(-20, 45, -15, 70, -30, 90);
        ctx.bezierCurveTo(-15, 65, -5, 40, 0, 10);
        ctx.fillStyle = "#b45309";
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(4, 5);
        ctx.bezierCurveTo(20, 45, 15, 70, 30, 90);
        ctx.bezierCurveTo(15, 65, 5, 40, 0, 10);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(0, 3, 11, 9, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#f59e0b";
        ctx.fill();
        ctx.restore();
    }

    drawCanvasSparkles();
}

function triggerFlowerBloom() {
    if (window.appState.isBlooming) return;
    window.appState.isBlooming = true;
    window.appState.growthProgress = 0.05;

    let start = null;
    const duration = 1200;

    function step(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const p = Math.min(1.0, elapsed / duration);

        window.appState.growthProgress = 1 - Math.pow(1 - p, 3);
        renderCanvas();

        if (p < 1.0) {
            requestAnimationFrame(step);
        } else {
            window.appState.growthProgress = 1.0;
            window.appState.isBlooming = false;
            renderCanvas();
        }
    }
    requestAnimationFrame(step);
}

function addCanvasSparkle(x, y) {
    for (let i = 0; i < 12; i++) {
        window.appState.sparkles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5 - 1.5,
            size: Math.random() * 4 + 2,
            alpha: 1.0,
            color: Math.random() > 0.4 ? "#facc15" : "#ffffff",
        });
    }
}

function drawCanvasSparkles() {
    for (let i = window.appState.sparkles.length - 1; i >= 0; i--) {
        const s = window.appState.sparkles[i];
        s.x += s.vx;
        s.y += s.vy;
        s.alpha -= 0.025;
        s.size *= 0.96;

        if (s.alpha <= 0) {
            window.appState.sparkles.splice(i, 1);
            continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, s.alpha);
        ctx.fillStyle = s.color;
        ctx.beginPath();

        ctx.moveTo(s.x, s.y - s.size);
        ctx.lineTo(s.x + s.size * 0.3, s.y - s.size * 0.3);
        ctx.lineTo(s.x + s.size, s.y);
        ctx.lineTo(s.x + s.size * 0.3, s.y + s.size * 0.3);
        ctx.lineTo(s.x, s.y + s.size);
        ctx.lineTo(s.x - s.size * 0.3, s.y + s.size * 0.3);
        ctx.lineTo(s.x - s.size, s.y);
        ctx.lineTo(s.x - s.size * 0.3, s.y - s.size * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

// Inicialización de partículas de fondo
function resizeAmbientCanvas() {
    if (!ambientCanvas) return;
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = window.innerHeight;
}

function initAmbientParticles() {
    particles.length = 0;
    if (!ambientCanvas) return;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
            x: Math.random() * ambientCanvas.width,
            y: Math.random() * ambientCanvas.height,
            radius: Math.random() * 3.5 + 1.2,
            speedY: Math.random() * 0.7 + 0.35,
            speedX: (Math.random() - 0.5) * 0.5,
            angle: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 0.02,
            opacity: Math.random() * 0.55 + 0.25,
            isPetal: Math.random() > 0.55,
        });
    }
}

function animateAmbientLoop() {
    if (!aCtx || !ambientCanvas) return;
    aCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);

    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.008) * 0.7 + p.speedX;
        p.angle += p.rotSpeed;

        if (p.y > ambientCanvas.height + 20) {
            p.y = -20;
            p.x = Math.random() * ambientCanvas.width;
        }
        if (p.x > ambientCanvas.width + 20) p.x = -20;
        if (p.x < -20) p.x = ambientCanvas.width + 20;

        aCtx.save();
        aCtx.translate(p.x, p.y);
        aCtx.rotate(p.angle);
        aCtx.globalAlpha = p.opacity;

        if (p.isPetal) {
            aCtx.beginPath();
            aCtx.ellipse(0, 0, p.radius * 2.8, p.radius * 1.3, 0, 0, Math.PI * 2);
            aCtx.fillStyle = "#fde047";
            aCtx.shadowColor = "#eab308";
            aCtx.shadowBlur = 4;
            aCtx.fill();
        } else {
            aCtx.beginPath();
            aCtx.arc(0, 0, p.radius, 0, Math.PI * 2);
            aCtx.fillStyle = "#f59e0b";
            aCtx.shadowColor = "#fde047";
            aCtx.shadowBlur = 6;
            aCtx.fill();
        }
        aCtx.restore();
    }

    if (window.appState && window.appState.sparkles.length > 0) {
        renderCanvas();
    }

    requestAnimationFrame(animateAmbientLoop);
}