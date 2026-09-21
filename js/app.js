/**
 * Controlador Principal de la Aplicación
 * Manejo de estado, eventos DOM, gestos touch e interactividad.
 */
window.appState = {
    opened: false,
    isBouquet: false,
    growthProgress: 0.0,
    isBlooming: false,
    musicPlaying: false,
    sparkles: [],
};

function launchYellowConfetti(count = 60) {
    if (typeof confetti === "function") {
        confetti({
            particleCount: count,
            spread: 70,
            origin: { y: 0.65 },
            colors: ["#facc15", "#eab308", "#ca8a04", "#fef08a", "#ffffff"],
            shapes: ["circle", "square"],
            scalar: 1.1,
        });
    }
}

function spawnFloatingHeart(x, y) {
    const el = document.createElement("div");
    el.className = "tap-sparkle text-2xl select-none";
    const symbols = ["💛", "✨", "🌻", "⭐"];
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.setProperty("--dx", `${(Math.random() - 0.5) * 80}px`);
    el.style.setProperty("--rot", `${(Math.random() - 0.5) * 60}deg`);

    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1400);
}

function toggleCard(cardElement) {
    cardElement.classList.toggle("is-flipped");
    playMusicBoxNote(880, 0.4);
}

function handleFlowerTouch(e) {
    const flowerCanvas = document.getElementById("flower-canvas");
    if (!flowerCanvas) return;
    const rect = flowerCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const scaleX = flowerCanvas.width / rect.width;
    const scaleY = flowerCanvas.height / rect.height;

    const clickX = (clientX - rect.left) * scaleX;
    const clickY = (clientY - rect.top) * scaleY;

    addCanvasSparkle(clickX, clickY);
    spawnFloatingHeart(clientX, clientY);
    renderCanvas();
}

// Inicialización de Eventos del DOM
document.addEventListener("DOMContentLoaded", () => {
    // Configurar Canvas Ambiental
    window.addEventListener("resize", resizeAmbientCanvas);
    resizeAmbientCanvas();
    initAmbientParticles();
    requestAnimationFrame(animateAmbientLoop);

    // Botón de Melodía
    const btnAudioToggle = document.getElementById("btn-audio-toggle");
    if (btnAudioToggle) {
        btnAudioToggle.addEventListener("click", toggleMusic);
    }

    // Apertura del sobre
    const envelopeSection = document.getElementById("screen-envelope");
    const contentSection = document.getElementById("screen-content");
    const envelopeClickable = document.getElementById("envelope-clickable");
    const audioToggleContainer = document.getElementById("audio-toggle-container");

    const openEnvelopeHandler = () => {
        if (window.appState.opened) return;
        window.appState.opened = true;

        initAudio();
        startBackgroundMusic();
        launchYellowConfetti(80);

        envelopeSection.style.transform = "scale(0.9) translateY(-20px)";
        envelopeSection.style.opacity = "0";

        setTimeout(() => {
            envelopeSection.classList.add("hidden");
            contentSection.classList.remove("hidden");
            audioToggleContainer.classList.remove("hidden");

            requestAnimationFrame(() => {
                contentSection.style.opacity = "1";
            });

            triggerFlowerBloom();
        }, 650);
    };

    if (envelopeClickable) {
        envelopeClickable.addEventListener("click", openEnvelopeHandler);
        envelopeClickable.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openEnvelopeHandler();
            }
        });
    }

    // Toque sobre la Flor
    const flowerCanvas = document.getElementById("flower-canvas");
    if (flowerCanvas) {
        flowerCanvas.addEventListener("click", handleFlowerTouch);
        flowerCanvas.addEventListener("touchstart", handleFlowerTouch, { passive: true });
    }

    // Botón Volver a Florecer
    const btnReBloom = document.getElementById("btn-re-bloom");
    if (btnReBloom) {
        btnReBloom.addEventListener("click", () => {
            triggerFlowerBloom();
            launchYellowConfetti(35);
        });
    }

    // Alternar Ramillete / Flor individual
    const bouquetBtn = document.getElementById("btn-toggle-bouquet");
    const bouquetLabel = document.getElementById("label-bouquet-btn");
    if (bouquetBtn) {
        bouquetBtn.addEventListener("click", () => {
            window.appState.isBouquet = !window.appState.isBouquet;
            if (bouquetLabel) {
                bouquetLabel.textContent = window.appState.isBouquet
                    ? "Ver Flor Individual"
                    : "Ver en Ramillete";
            }
            triggerFlowerBloom();
            launchYellowConfetti(40);
        });
    }

    // Tarjetas Flip interactivas (Accesibilidad con Teclado y Click)
    const cards = document.querySelectorAll(".flip-card");
    cards.forEach((card) => {
        card.addEventListener("click", () => toggleCard(card));
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleCard(card);
            }
        });
    });

    // Lluvia de Flores y Confeti
    const btnRain = document.getElementById("btn-rain-flowers");
    if (btnRain) {
        btnRain.addEventListener("click", () => {
            launchYellowConfetti(100);
            playMusicBoxNote(739.99, 0.6);
            playMusicBoxNote(880, 0.8);
        });
    }

    // Compartir por WhatsApp
    const btnHug = document.getElementById("btn-send-hug");
    if (btnHug) {
        btnHug.addEventListener("click", () => {
            const waText =
                "💛 ¡Me encantó mi detalle de flores amarillas! Muchísimas gracias por estar siempre en mi vida, te mando el abrazo más grande del mundo. ¡Feliz 21 de septiembre! ✨🌻";
            const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;
            window.open(url, "_blank");
        });
    }

    // Renderizado de iconos Lucide
    if (window.lucide) {
        window.lucide.createIcons();
    }
});