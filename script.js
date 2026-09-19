document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // AUDIO SETUP
    // =========================

    let audioContext = null;
    let playing = false;
    let currentStep = 0;
    let timer = null;
    let selectedInstrument = "piano";

    function startAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }
    }

    // =========================
    // INSTRUMENT SOUNDS
    // =========================

    const notes = {
        C: 261.63,
        D: 293.66,
        E: 329.63,
        F: 349.23,
        G: 392.00,
        A: 440.00,
        B: 493.88
    };

    function playNote(frequency) {
        startAudio();

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.frequency.value = frequency;

        if (selectedInstrument === "organ") {
            oscillator.type = "sine";
        } else if (selectedInstrument === "guitar") {
            oscillator.type = "triangle";
        } else if (selectedInstrument === "strings") {
            oscillator.type = "sawtooth";
        } else if (selectedInstrument === "synth") {
            oscillator.type = "square";
        } else {
            oscillator.type = "triangle";
        }

        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(
            0.01,
            audioContext.currentTime + 0.7
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.7);
    }

    // =========================
    // INSTRUMENT BUTTONS
    // =========================

    document.querySelectorAll(".instrument").forEach(function (button) {

        button.addEventListener("click", function () {

            document.querySelectorAll(".instrument").forEach(function (btn) {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            selectedInstrument = button.dataset.instrument;

            // Test sound
            playNote(notes.C);
        });

    });

    // =========================
    // PIANO KEYS
    // =========================

    document.querySelectorAll(".key").forEach(function (key) {

        key.addEventListener("click", function () {

            const note = key.dataset.note;

            if (notes[note]) {
                playNote(notes[note]);
            }

        });

    });

    // =========================
    // DRUMS
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
    });

    document.querySelectorAll(".step").forEach(function (button) {

        button.addEventListener("click", function () {

            const track = button.dataset.track;
            const step = Number(button.dataset.step);

            if (!track || isNaN(step)) return;

            patterns[track][step] = !patterns[track][step];

            button.classList.toggle(
                "active",
                patterns[track][step]
            );

            if (patterns[track][step]) {
                playDrum(track);
            }

        });

    });

    function playDrum(type) {

        startAudio();

        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

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

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start();

        oscillator.stop(
            audioContext.currentTime + duration
        );
    }

    // =========================
    // PLAY SEQUENCE
    // =========================

    function playStep() {

        document.querySelectorAll(".step").forEach(function (button) {
            button.classList.remove("playing");
        });

        tracks.forEach(function (track) {

            if (patterns[track][currentStep]) {
                playDrum(track);
            }

            const trackElement = document.getElementById(track);

            if (!trackElement) return;

            const buttons = trackElement.querySelectorAll(".step");

            if (buttons[currentStep]) {
                buttons[currentStep].classList.add("playing");
            }

        });

        currentStep++;

        if (currentStep >= 16) {
            currentStep = 0;
        }
    }

    // =========================
    // PLAY BUTTON
    // =========================

    const playBtn = document.getElementById("playBtn");

    if (playBtn) {

        playBtn.addEventListener("click", function () {

            if (playing) return;

            startAudio();

            playing = true;
            currentStep = 0;

            const bpmElement = document.getElementById("bpm");

            let bpm = 120;

            if (bpmElement) {
                bpm = Number(bpmElement.value);
            }

            const interval = (60 / bpm) * 250;

            playStep();

            timer = setInterval(playStep, interval);

        });

    }

    // =========================
    // STOP BUTTON
    // =========================

    const stopBtn = document.getElementById("stopBtn");

    if (stopBtn) {

        stopBtn.addEventListener("click", function () {

            playing = false;

            clearInterval(timer);

            timer = null;

            currentStep = 0;

            document.querySelectorAll(".step").forEach(function (button) {
                button.classList.remove("playing");
            });

        });

    }

    // =========================
    // BPM
    // =========================

    const bpm = document.getElementById("bpm");
    const bpmValue = document.getElementById("bpmValue");

    if (bpm && bpmValue) {

        bpm.addEventListener("input", function () {
            bpmValue.textContent = bpm.value;
        });

    }

    // =========================
    // CHORD MAKER
    // =========================

    const chords = {
        C: [261.63, 329.63, 392.00],
        Am: [220.00, 261.63, 329.63],
        F: [174.61, 220.00, 261.63],
        G: [196.00, 246.94, 392.00],
        Dm: [146.83, 220.00, 293.66],
        Em: [164.81, 246.94, 329.63]
    };

    document.querySelectorAll(".chord").forEach(function (button) {

        button.addEventListener("click", function () {

            const chordName = button.dataset.chord;
            const chord = chords[chordName];

            if (!chord) return;

            chord.forEach(function (frequency, index) {

                setTimeout(function () {
                    playNote(frequency);
                }, index * 80);

            });

        });

    });

    // =========================
    // BASS / 808
    // =========================

    const bassNotes = {
        C2: 65.41,
        D2: 73.42,
        E2: 82.41,
        F2: 87.31,
        G2: 98.00,
        A2: 110.00,
        B2: 123.47
    };

    document.querySelectorAll(".bass-note").forEach(function (button) {

        button.addEventListener("click", function () {

            const note = button.dataset.note;

            if (!bassNotes[note]) return;

            startAudio();

            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();

            oscillator.type = "sine";
            oscillator.frequency.value = bassNotes[note];

            gain.gain.setValueAtTime(
                0.5,
                audioContext.currentTime
            );

            gain.gain.exponentialRampToValueAtTime(
                0.01,
                audioContext.currentTime + 1
            );

            oscillator.connect(gain);
            gain.connect(audioContext.destination);

            oscillator.start();

            oscillator.stop(
                audioContext.currentTime + 1
            );

        });

    });

    // =========================
    // PIANO ROLL
    // =========================

    const pianoRoll = document.getElementById("pianoRoll");

    if (pianoRoll) {

        for (let i = 0; i < 16; i++) {

            const note = document.createElement("button");

            note.className = "roll-note";

            note.dataset.step = i;

            note.addEventListener("click", function () {

                note.classList.toggle("active");

                playNote(notes.C);

            });

            pianoRoll.appendChild(note);
        }

    }

    console.log("MY BEAT MAKER loaded successfully!");

});
