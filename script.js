const tracks = ["kick", "clap", "snare", "hihat"];

let currentStep = 0;
let isPlaying = false;
let timer = null;
let audioContext = null;

const patterns = {
    kick: new Array(16).fill(false),
    clap: new Array(16).fill(false),
    snare: new Array(16).fill(false),
    hihat: new Array(16).fill(false)
};

// CREATE THE 16 BUTTONS
tracks.forEach(track => {
    const container = document.getElementById(track);

    for (let i = 0; i < 16; i++) {
        const button = document.createElement("button");

        button.className = "step";
        button.type = "button";

        button.addEventListener("click", () => {
            patterns[track][i] = !patterns[track][i];
            button.classList.toggle("active");
        });

        container.appendChild(button);
    }
});

// BPM
const bpm = document.getElementById("bpm");
const bpmValue = document.getElementById("bpmValue");

bpm.addEventListener("input", () => {
    bpmValue.textContent = bpm.value;
});

// PLAY
document.getElementById("playBtn").addEventListener("click", () => {

    if (isPlaying) return;

    isPlaying = true;

    const speed = (60 / Number(bpm.value)) * 250;

    playStep();

    timer = setInterval(playStep, speed);
});

// STOP
document.getElementById("stopBtn").addEventListener("click", () => {

    isPlaying = false;

    clearInterval(timer);

    currentStep = 0;

    document.querySelectorAll(".step").forEach(button => {
        button.classList.remove("playing");
    });
});

// PLAY EACH STEP
function playStep() {

    document.querySelectorAll(".step").forEach(button => {
        button.classList.remove("playing");
    });

    tracks.forEach(track => {

        const buttons = document
            .getElementById(track)
            .querySelectorAll(".step");

        buttons[currentStep].classList.add("playing");

        if (patterns[track][currentStep]) {
            makeSound(track);
        }
    });

    currentStep++;

    if (currentStep >= 16) {
        currentStep = 0;
    }
}

// SIMPLE SOUNDS
function makeSound(type) {

    if (!audioContext) {
        audioContext = new AudioContext();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    if (type === "kick") {
        oscillator.frequency.value = 100;
    }

    if (type === "snare") {
        oscillator.frequency.value = 180;
    }

    if (type === "clap") {
        oscillator.frequency.value = 350;
    }

    if (type === "hihat") {
        oscillator.frequency.value = 800;
    }

    gain.gain.value = 0.15;

    oscillator.start();

    oscillator.stop(audioContext.currentTime + 0.08);
}
