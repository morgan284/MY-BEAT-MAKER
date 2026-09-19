document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // DRUM TRACKS
    // =========================

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

    tracks.forEach(function (track) {

        patterns[track] = new Array(16).fill(false);

        const container = document.getElementById(track);

        if (!container) {
            console.log("Missing drum container:", track);
            return;
        }

        for (let i = 0; i < 16; i++) {

            const button = document.createElement("button");

            button.type = "button";
            button.className = "step";
            button.textContent = "";

            button.onclick = function () {

                patterns[track][i] =
                    !patterns[track][i];

                button.classList.toggle(
                    "active",
                    patterns[track][i]
                );
            };

            container.appendChild(button);
        }
    });


    // =========================
    // BPM
    // =========================

    const bpm = document.getElementById("bpm");
    const bpmValue = document.getElementById("bpmValue");

    if (bpm && bpmValue) {

        bpm.oninput = function () {
            bpmValue.textContent = bpm.value;
        };
    }


    // =========================
    // AUDIO
    // =========================

    let audioContext = null;

    function startAudio() {

        if (!audioContext) {

            audioContext =
                new (window.AudioContext ||
                window.webkitAudioContext)();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }
    }


    // =========================
    // DRUM SOUND
    // =========================

    function playDrum(type) {

        startAudio();

        const oscillator =
            audioContext.createOscillator();

        const gain =
            audioContext.createGain();

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        let frequency = 200;
        let duration = 0.15;

        if (type === "kick") {
            frequency = 80;
            duration = 0.25;
        }

        if (type === "snare") {
            frequency = 180;
        }

        if (type === "clap") {
            frequency = 350;
        }

        if (type === "hihat") {
            frequency = 6000;
            duration = 0.05;
        }

        if (type === "openhat") {
            frequency = 4500;
            duration = 0.2;
        }

        if (type === "lowtom") {
            frequency = 120;
        }

        if (type === "hightom") {
            frequency = 250;
        }

        if (type === "crash") {
            frequency = 3000;
            duration = 0.3;
        }

        if (type === "ride") {
            frequency = 4000;
            duration = 0.2;
        }

        if (type === "perc") {
            frequency = 500;
        }

        oscillator.frequency.value = frequency;

        gain.gain.setValueAtTime(
            0.3,
            audioContext.currentTime
        );

        gain.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + duration
        );

        oscillator.start();

        oscillator.stop(
            audioContext.currentTime + duration
        );
    }


    // =========================
    // PLAY / STOP
    // =========================

    let playing = false;
    let currentStep = 0;
    let timer = null;

    const playButton =
        document.getElementById("playBtn");

    const stopButton =
        document.getElementById("stopBtn");


    function playStep() {

        document
            .querySelectorAll(".step")
            .forEach(function (button) {
                button.classList.remove("playing");
            });


        tracks.forEach(function (track) {

            const buttons =
                document
                    .getElementById(track)
                    .querySelectorAll(".step");

            if (patterns[track][currentStep]) {
                playDrum(track);
            }

            if (buttons[currentStep]) {
                buttons[currentStep]
                    .classList.add("playing");
            }
        });


        currentStep++;

        if (currentStep >= 16) {
            currentStep = 0;
        }
    }


    playButton.onclick = function () {

        if (playing) return;

        startAudio();

        playing = true;

        const speed =
            (60 / Number(bpm.value)) * 250;

        playStep();

        timer =
            setInterval(playStep, speed);
    };


    stopButton.onclick = function () {

        playing = false;

        clearInterval(timer);

        currentStep = 0;

        document
            .querySelectorAll(".step")
            .forEach(function (button) {
                button.classList.remove("playing");
            });
    };


    // =========================
    // PIANO
    // =========================

    const noteFrequencies = {

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


    document
        .querySelectorAll(".key")
        .forEach(function (key) {

            key.onclick = function () {

                startAudio();

                const frequency =
                    noteFrequencies[
                        key.dataset.note
                    ];

                if (!frequency) return;

                const oscillator =
                    audioContext.createOscillator();

                const gain =
                    audioContext.createGain();

                oscillator.type = "triangle";

                oscillator.frequency.value =
                    frequency;

                oscillator.connect(gain);
                gain.connect(
                    audioContext.destination
                );

                gain.gain.value = 0.3;

                oscillator.start();

                gain.gain.exponentialRampToValueAtTime(
                    0.01,
                    audioContext.currentTime + 0.6
                );

                oscillator.stop(
                    audioContext.currentTime + 0.6
                );

                key.classList.add("active");

                setTimeout(function () {
                    key.classList.remove("active");
                }, 150);
            };
        });


    console.log("MY BEAT MAKER loaded successfully!");

});
