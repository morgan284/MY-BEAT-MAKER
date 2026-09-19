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
        document.getElementById("playBtn").addEventListener(...)
...
    {);        
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

;
console.log("MY BEAT MAKER loaded successfully!");  

// =====================================
// 🎼 CHORD MAKER
// =====================================

const myChords = {
    C: [261.63, 329.63, 392.00],
    Am: [220.00, 261.63, 329.63],
    F: [174.61, 220.00, 261.63],
    G: [196.00, 246.94, 392.00],
    Dm: [146.83, 220.00, 293.66],
    Em: [164.81, 246.94, 329.63]
};

function playMyTone(frequency, type = "triangle", duration = 0.8) {

    startAudio();

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    gain.gain.setValueAtTime(
        0.25,
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


// CHORD BUTTONS

document.querySelectorAll(".chord").forEach(function(button) {

    button.addEventListener("click", function() {

        const chord =
            myChords[button.dataset.chord];

        chord.forEach(function(note, index) {

            setTimeout(function() {

                playMyTone(
                    note,
                    "triangle",
                    1
                );

            }, index * 30);

        });

    });

});


// =====================================
// 🔊 BASS / 808
// =====================================

const myBassNotes = {
    C2: 65.41,
    D2: 73.42,
    E2: 82.41,
    F2: 87.31,
    G2: 98.00,
    A2: 110.00,
    B2: 123.47
};

document.querySelectorAll(".bass-note").forEach(function(button) {

    button.addEventListener("click", function() {

        const frequency =
            myBassNotes[button.dataset.note];

        playMyTone(
            frequency,
            "sawtooth",
            0.9
        );

    });

});


// =====================================
// 🎹 PIANO ROLL
// =====================================

const myRollNotes = [
    261.63,
    293.66,
    329.63,
    349.23,
    392.00,
    440.00,
    493.88,
    523.25
];

const myPianoRoll =
    document.getElementById("pianoRoll");

const myPattern = [];

if (myPianoRoll) {

    for (let row = 0; row < 8; row++) {

        myPattern[row] =
            new Array(16).fill(false);

        for (let step = 0; step < 16; step++) {

            const noteButton =
                document.createElement("button");

            noteButton.className = "roll-note";

            noteButton.dataset.row = row;
            noteButton.dataset.step = step;

            noteButton.addEventListener(
                "click",
                function() {

                    myPattern[row][step] =
                        !myPattern[row][step];

                    noteButton.classList.toggle(
                        "active",
                        myPattern[row][step]
                    );

                    // Play the note when clicked

                    if (myPattern[row][step]) {

                        playMyTone(
                            myRollNotes[row],
                            "triangle",
                            0.5
                        );

                    }

                }
            );

            myPianoRoll.appendChild(noteButton);
        }
    }
}


// =====================================
// 🎵 PLAY PIANO ROLL
// =====================================

let rollPlaying = false;
let rollStep = 0;
let rollTimer = null;

function playMyPianoRoll() {

    if (rollPlaying) return;

    rollPlaying = true;

    rollStep = 0;

    const bpmValue =
        document.getElementById("bpm");

    const bpmNumber =
        bpmValue ? Number(bpmValue.value) : 120;

    const speed =
        (60 / bpmNumber) * 250;

    rollTimer = setInterval(function() {

        for (let row = 0; row < 8; row++) {

            if (myPattern[row][rollStep]) {

                playMyTone(
                    myRollNotes[row],
                    "triangle",
                    0.4
                );
            }
        }

        document
            .querySelectorAll(".roll-note")
            .forEach(function(button) {

                button.classList.remove(
                    "playing"
                );

            });

        document
            .querySelectorAll(
                `[data-step="${rollStep}"]`
            )
            .forEach(function(button) {

                button.classList.add(
                    "playing"
                );

            });

        rollStep++;

        if (rollStep >= 16) {
            rollStep = 0;
        }

    }, speed);
}


// =====================================
// 🛑 STOP PIANO ROLL
// =====================================

function stopMyPianoRoll() {

    rollPlaying = false;

    clearInterval(rollTimer);

    document
        .querySelectorAll(".roll-note")
        .forEach(function(button) {

            button.classList.remove(
                "playing"
            );

        });
}

console.log("🎵 Chords, Bass and Piano Roll ready!");$

});


     
