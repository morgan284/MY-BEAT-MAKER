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
    "perc"
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

            patterns[track][i] =
                !patterns[track][i];

            button.classList.toggle("active");
        });

        container.appendChild(button);
    }
});


let audioContext = null;
let masterGain = null;
let recordingDestination = null;

let recorder = null;
let recordedChunks = [];

let playing = false;
let currentStep = 0;
let timer = null;

let selectedInstrument = "piano";


/* AUDIO SETUP */

function setupAudio() {

    if (audioContext) return;

    audioContext =
        new (window.AudioContext ||
        window.webkitAudioContext)();

    masterGain =
        audioContext.createGain();

    masterGain.gain.value = 0.7;

    masterGain.connect(
        audioContext.destination
    );

    recordingDestination =
        audioContext.createMediaStreamDestination();

    masterGain.connect(
        recordingDestination
    );
}


/* INSTRUMENT SELECTION */

document.querySelectorAll(".instrument")
    .forEach(button => {

        button.addEventListener("click", () => {

            document
                .querySelectorAll(".instrument")
                .forEach(b =>
                    b.classList.remove("active")
                );

            button.classList.add("active");

            selectedInstrument =
                button.dataset.instrument;
        });
    });


/* NOTE FREQUENCIES */

const notes = {

    "C4": 261.63,
    "C#4": 277.18,
    "D4": 293.66,
    "D#4": 311.13,
    "E4": 329.63,
    "F4": 349.23,
    "F#4": 369.99,
    "G4": 392.00,
    "G#4": 415.30,
    "A4": 440.00,
    "A#4": 466.16,
    "B4": 493.88,
    "C5": 523.25
};


/* PLAY PIANO */

document.querySelectorAll(".key")
    .forEach(key => {

        key.addEventListener("click", () => {

            setupAudio();

            playInstrument(
                notes[key.dataset.note],
                selectedInstrument
            );

            key.classList.add("active");

            setTimeout(() => {
                key.classList.remove("active");
            }, 150);
        });
    });


/* PLAY INSTRUMENT */

function playInstrument(frequency, instrument) {

    setupAudio();

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    const oscillator =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(masterGain);

    let duration = 0.5;

    if (instrument === "piano") {
        oscillator.type = "triangle";
        duration = 0.6;
    }

    if (instrument === "organ") {
        oscillator.type = "sine";
        duration = 0.8;
    }

    if (instrument === "guitar") {
        oscillator.type = "triangle";
        duration = 0.7;
    }

    if (instrument === "strings") {
        oscillator.type = "sawtooth";
        duration = 1;
    }

    if (instrument === "synth") {
        oscillator.type = "square";
        duration = 0.5;
    }

    if (instrument === "flute") {
        oscillator.type = "sine";
        duration = 0.8;
    }

    const now = audioContext.currentTime;

    oscillator.frequency.setValueAtTime(
        frequency,
        now
    );

    gain.gain.setValueAtTime(
        0.001,
        now
    );

    gain.gain.exponentialRampToValueAtTime(
        0.3,
        now + 0.02
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + duration
    );

    oscillator.start(now);

    oscillator.stop(
        now + duration
    );
}


/* DRUM SOUNDS */

function drumSound(type) {

    setupAudio();

    const osc =
        audioContext.createOscillator();

    const gain =
        audioContext.createGain();

    osc.connect(gain);
    gain.connect(masterGain);

    const now =
        audioContext.currentTime;

    let frequency = 200;
    let duration = 0.15;

    if (type === "kick") {
        frequency = 90;
        duration = 0.2;
    }

    if (type === "snare") {
        frequency = 180;
    }

    if (type === "clap") {
        frequency = 300;
    }

    if (type === "hihat") {
        frequency = 7000;
        duration = 0.05;
        osc.type = "square";
    }

    if (type === "openhat") {
        frequency = 5000;
        duration = 0.25;
        osc.type = "square";
    }

    if (type === "lowtom") {
        frequency = 120;
    }

    if (type === "hightom") {
        frequency = 250;
    }

    if (type === "crash") {
        frequency = 3000;
        duration = 0.4;
        osc.type = "square";
    }

    if (type === "ride") {
        frequency = 4500;
        duration = 0.3;
        osc.type = "square";
    }

    if (type === "perc") {
        frequency = 600;
    }

    if (!osc.type) {
        osc.type = "sine";
    }

    osc.frequency.setValueAtTime(
        frequency,
        now
    );

    gain.gain.setValueAtTime(
        0.3,
        now
    );

    gain.gain.exponentialRampToValueAtTime(
        0.001,
        now + duration
    );

    osc.start(now);

    osc.stop(
        now + duration
    );
}


/* BPM */

const bpm =
    document.getElementById("bpm");

const bpmValue =
    document.getElementById("bpmValue");

bpm.addEventListener("input", () => {

    bpmValue.textContent =
        bpm.value;
});


/* SEQUENCER */

function playStep() {

    document
        .querySelectorAll(".step")
        .forEach(button => {
            button.classList.remove("playing");
        });

    tracks.forEach(track => {

        const buttons =
            document
                .getElementById(track)
                .querySelectorAll(".step");

        buttons[currentStep]
            .classList.add("playing");

        if (patterns[track][currentStep]) {
            drumSound(track);
        }
    });

    currentStep++;

    if (currentStep >= 16) {
        currentStep = 0;
    }
}


/* PLAY */

document
    .getElementById("playBtn")
    .addEventListener("click", () => {

        setupAudio();

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        if (playing) return;

        playing = true;

        const interval =
            (60 / Number(bpm.value)) * 250;

        playStep();

        timer =
            setInterval(
                playStep,
                interval
            );
    });


/* STOP */

document
    .getElementById("stopBtn")
    .addEventListener("click", () => {

        playing = false;

        clearInterval(timer);

        currentStep = 0;

        document
            .querySelectorAll(".step")
            .forEach(button => {
                button.classList.remove("playing");
            });
    });


/* RECORD */

const recordBtn =
    document.getElementById("recordBtn");

const recordingStatus =
    document.getElementById("recordingStatus");

recordBtn.addEventListener("click", () => {

    setupAudio();

    if (!recorder ||
        recorder.state === "inactive") {

        recordedChunks = [];

        recorder =
            new MediaRecorder(
                recordingDestination.stream
            );

        recorder.ondataavailable = event => {

            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        recorder.onstop = saveRecording;

        recorder.start();

        recordBtn.textContent =
            "⏹ STOP RECORDING";

        recordBtn.classList.add(
            "recording"
        );

        recordingStatus.textContent =
            "🔴 Recording...";
    }

    else {

        recorder.stop();

        recordBtn.textContent =
            "⏺ RECORD";

        recordBtn.classList.remove(
            "recording"
        );

        recordingStatus.textContent =
            "Preparing your recording...";
    }
});


/* SAVE RECORDING */

function saveRecording() {

    const blob =
        new Blob(
            recordedChunks,
            {
                type: "audio/webm"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;

    link.download =
        "my-beat.webm";

    link.textContent =
        "⬇️ Download your recording";

    link.style.display =
        "block";

    link.style.marginTop =
        "10px";

    recordingStatus.innerHTML = "";

    recordingStatus.appendChild(link);
}
