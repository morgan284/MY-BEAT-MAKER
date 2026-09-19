```javascript
const tracks = ["kick", "clap", "snare", "hihat"];

const beatPattern = {
    kick: [],
    clap: [],
    snare: [],
    hihat: []
};

let audioContext;
let isPlaying = false;
let currentStep = 0;
let timer;

const bpmSlider = document.getElementById("bpm");
const bpmValue = document.getElementById("bpmValue");

bpmSlider.addEventListener("input", () => {
    bpmValue.textContent = bpmSlider.value;
});

tracks.forEach(track => {

    const container = document.getElementById(track);

    for (let i = 0; i < 16; i++) {

        const step = document.createElement("div");

        step.classList.add("step");

        step.addEventListener("click", () => {

            step.classList.toggle("active");

            beatPattern[track][i] =
                step.classList.contains("active");

        });

        container.appendChild(step);
    }
});


function createSound(type) {

    if (!audioContext) {
        audioContext = new AudioContext();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    const now = audioContext.currentTime;

    if (type === "kick") {

        oscillator.frequency.setValueAtTime(150, now);
        oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.15);

        gain.gain.setValueAtTime(1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        oscillator.start(now);
        oscillator.stop(now + 0.2);

    }

    else if (type === "snare") {

        oscillator.type = "triangle";

        oscillator.frequency.setValueAtTime(180, now);

        gain.gain.setValueAtTime(0.5, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        oscillator.start(now);
        oscillator.stop(now + 0.15);

    }

    else if (type === "clap") {

        oscillator.type = "square";

        oscillator.frequency.setValueAtTime(300, now);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        oscillator.start(now);
        oscillator.stop(now + 0.1);

    }

    else if (type === "hihat") {

        oscillator.type = "square";

        oscillator.frequency.setValueAtTime(8000, now);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

        oscillator.start(now);
        oscillator.stop(now + 0.05);
    }
}


function playStep() {

    document.querySelectorAll(".step").forEach(step => {
        step.classList.remove("playing");
    });

    tracks.forEach(track => {

        const steps = document
            .getElementById(track)
            .querySelectorAll(".step");

        if (beatPattern[track][currentStep]) {
            createSound(track);
        }

        steps[currentStep].classList.add("playing");
    });

    currentStep++;

    if (currentStep >= 16) {
        currentStep = 0;
    }
}


function startBeat() {

    if (isPlaying) return;

    isPlaying = true;

    const interval =
        (60 / Number(bpmSlider.value)) * 1000 / 4;

    playStep();

    timer = setInterval(playStep, interval);
}


function stopBeat() {

    isPlaying = false;

    clearInterval(timer);

    currentStep = 0;

    document.querySelectorAll(".step").forEach(step => {
        step.classList.remove("playing");
    });
}


document.getElementById("playBtn")
    .addEventListener("click", startBeat);

document.getElementById("stopBtn")
    .addEventListener("click", stopBeat);
```
