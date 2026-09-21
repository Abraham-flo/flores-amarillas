/**
 * Módulo de síntesis de audio procedural (Web Audio API)
 * Crea el sonido relajante de una caja de música con ondas senoidales.
 */
let audioCtx = null;
let musicInterval = null;
let noteStep = 0;

const melodyNotes = [
    { f: 587.33, d: 0.9 }, // D5
    { f: 659.25, d: 0.7 }, // E5
    { f: 739.99, d: 1.2 }, // F#5
    { f: 880.0,  d: 1.4 }, // A5
    { f: 739.99, d: 0.8 }, // F#5
    { f: 659.25, d: 0.9 }, // E5
    { f: 587.33, d: 1.6 }, // D5
    { f: 440.0,  d: 1.0 }, // A4
    { f: 493.88, d: 0.8 }, // B4
    { f: 587.33, d: 1.2 }, // D5
    { f: 659.25, d: 1.0 }, // E5
    { f: 880.0,  d: 1.8 }, // A5
    { f: 987.77, d: 1.2 }, // B5
    { f: 880.0,  d: 1.5 }, // A5
    { f: 739.99, d: 1.4 }, // F#5
    { f: 587.33, d: 2.2 }, // D5 resolución
];

function initAudio() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
    }
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
}

function playMusicBoxNote(freq, duration) {
    if (!audioCtx || !window.appState?.musicPlaying) return;

    try {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        const now = audioCtx.currentTime;
        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.8);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start(now);
        osc.stop(now + duration + 1.0);
    } catch (err) {
        console.warn("Audio playback handled:", err);
    }
}

function startBackgroundMusic() {
    if (!window.appState) return;
    window.appState.musicPlaying = true;
    updateAudioIconUI();

    if (musicInterval) clearInterval(musicInterval);

    musicInterval = setInterval(() => {
        if (!window.appState.musicPlaying) return;
        const currentNote = melodyNotes[noteStep % melodyNotes.length];
        playMusicBoxNote(currentNote.f, currentNote.d);
        noteStep++;
    }, 780);
}

function toggleMusic() {
    initAudio();
    if (!window.appState) return;
    window.appState.musicPlaying = !window.appState.musicPlaying;
    updateAudioIconUI();

    if (window.appState.musicPlaying) {
        startBackgroundMusic();
    } else {
        if (musicInterval) clearInterval(musicInterval);
    }
}

function updateAudioIconUI() {
    const ping = document.getElementById("audio-ping");
    const dot = document.getElementById("audio-dot");
    const icon = document.getElementById("audio-icon");

    if (window.appState?.musicPlaying) {
        ping?.classList.remove("hidden");
        if (dot) dot.className = "relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500";
        icon?.setAttribute("data-lucide", "volume-2");
    } else {
        ping?.classList.add("hidden");
        if (dot) dot.className = "relative inline-flex rounded-full h-2.5 w-2.5 bg-stone-400";
        icon?.setAttribute("data-lucide", "volume-x");
    }
    if (window.lucide) window.lucide.createIcons();
}