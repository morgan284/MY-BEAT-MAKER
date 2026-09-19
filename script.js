const tracks = [
    "kick",
    "snare",
    "clap",
    "hihat",
    "openhat",
    "lowtom",
    "hightom",
    "crash",
    "ride",
    "perc",
    "bass",
    "piano",
    "synth",
    "lead"
];

const patterns = {};

tracks.forEach(track => {
    patterns[track] = new Array(16).fill(false);

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

let audioContext;
let playing = false;
let currentStep = 0;
let timer;

const bpm = document.getElementById("bpm");
const bpmValue = document.getElementById("bpmValue");

bpm.addEventListener("input", () => {
    bpmValue.textContent = bpm.value;
});

function sound(type) {

    if (!audioContext) {
        audioContext = new AudioContext();
    }

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.connect(gain);
    gain.connect(audioContext.destination);

    const now = audioContext.currentTime;

    let frequency = 200;
    let duration = 0.15;

    if (type === "kick") frequency = 100;
    if (type === "snare") frequency = 180;
    if (type === "clap") frequency = 350;

    if (type === "hihat") {
        frequency = 7000;
        duration = 0.05;
    }

    if (type === "openhat") {
        frequency = 5000;
        duration = 0.2;
    }

    if (type === "lowtom") frequency = 120;
    if (type === "hightom") frequency = 250;
    if (type === "crash") frequency = 3000;
    if (type === "ride") frequency = 4500;
    if (type === "perc") frequency = 600;

    if (type === "bass") frequency = 70;
    if (type === "piano") frequency = 440;
    if (type === "synth") frequency = 330;
    if (type === "lead") frequency = 520;

    if (
        type === "hihat" ||
        type === "openhat" ||
        type === "crash" ||
        type === "ride"
    ) {
        osc.type = "square";
    } else if (type === "bass") {
        osc.type = "sawtooth";
    } else if (type === "synth") {
        osc.type = "sawtooth";
    } else if (type === "lead") {
        osc.type = "triangle";
    } else {
        osc.type = "sine";
    }

    osc.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(
        0.01,
        now + duration
    );

    osc.start(now);
    osc.stop(now + duration);
}

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
            sound(track);
        }
    });

    currentStep++;

    if (currentStep >= 16) {
        currentStep = 0;
    }
}

document.getElementById("playBtn").addEventListener("click", () => {

    if (playing) return;

    playing = true;

    const interval =
        (60 / Number(bpm.value)) * 250;

    playStep();

    timer = setInterval(playStep, interval);
});

document.getElementById("stopBtn").addEventListener("click", () => {

    playing = false;

    clearInterval(timer);

    currentStep = 0;

    document.querySelectorAll(".step").forEach(button => {
        button.classList.remove("playing");
    });
});
