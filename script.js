// Extracted JavaScript from hbd.html
// ===== WISHES (UI) =====
const wishes = [
  "Terimakasih sudah bertumbuh jadi sosok yang luar biasa. Proud of you! Semoga terus berkembang jadi versi terbaik dirimu ❤️",
]

// ===== AUDIO CONTEXT & NOTES =====
let audioCtx = null;

function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume AudioContext jika suspended (untuk Chrome & iOS)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

const notes = [
  { f: 262, d: .5, t: "Hap", p: document.getElementById("p1") },
  { f: 262, d: .5, t: "py&nbsp", p: document.getElementById("p1") },
  { f: 294, d: 1, t: "Birth", p: document.getElementById("p1") },
  { f: 262, d: 1, t: "day&nbsp", p: document.getElementById("p1") },
  { f: 349, d: 1, t: "To&nbsp", p: document.getElementById("p1") },
  { f: 330, d: 2, t: "You", p: document.getElementById("p1") },

  { f: 262, d: .5, t: "Hap", p: document.getElementById("p2") },
  { f: 262, d: .5, t: "py&nbsp", p: document.getElementById("p2") },
  { f: 294, d: 1, t: "Birth", p: document.getElementById("p2") },
  { f: 262, d: 1, t: "day&nbsp", p: document.getElementById("p2") },
  { f: 392, d: 1, t: "To&nbsp;", p: document.getElementById("p2") },
  { f: 349, d: 2, t: "You", p: document.getElementById("p2") },

  { f: 262, d: .5, t: "Hap", p: document.getElementById("p3") },
  { f: 262, d: .5, t: "py&nbsp;", p: document.getElementById("p3") },
  { f: 523, d: 1, t: "Birth", p: document.getElementById("p3") },
  { f: 440, d: 1, t: "day&nbsp;", p: document.getElementById("p3") },
  { f: 349, d: 1, t: "Dear&nbsp;", p: document.getElementById("p3") },
  { f: 330, d: 1, t: "Frie", p: document.getElementById("p3") },
  { f: 294, d: 3, t: "nd", p: document.getElementById("p3") },

  { f: 466, d: .5, t: "Hap", p: document.getElementById("p4") },
  { f: 466, d: .5, t: "py&nbsp;", p: document.getElementById("p4") },
  { f: 440, d: 1, t: "Birth", p: document.getElementById("p4") },
  { f: 349, d: 1, t: "day&nbsp;", p: document.getElementById("p4") },
  { f: 392, d: 1, t: "To&nbsp;", p: document.getElementById("p4") },
  { f: 349, d: 2, t: "You", p: document.getElementById("p4") },
];

// ===== CREATE SPAN ELEMENTS =====
notes.forEach(note => {
  const span = document.createElement("span");
  span.innerHTML = note.t;
  note.p.appendChild(span);
  note.sp = span;
});

// ===== SOUND CLASS =====
let speed = 0.5;
let flag = false;
let sounds = [];

class Sound {
  constructor(freq, dur, i) {
    this.frequency = freq;
    this.waveform = "triangle";
    this.dur = dur;
    this.speed = this.dur * speed;
    this.initialGain = 0.15;
    this.index = i;
    this.sp = notes[i].sp;
  }

  cease() {
    this.sp.classList.remove("jump");
    if (this.index < sounds.length - 1) {
      sounds[this.index + 1].play();
    } else {
      flag = false;
      // Auto loop setelah 1 detik
      setTimeout(() => {
        sounds[0].play();
        flag = true;
      }, 1000);
    }
  }

  play() {
    const ctx = initAudioContext();
    this.oscillator = ctx.createOscillator();
    this.gain = ctx.createGain();

    this.gain.gain.value = this.initialGain;
    this.oscillator.type = this.waveform;
    this.oscillator.frequency.value = this.frequency;
    this.gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + this.speed);

    this.oscillator.connect(this.gain);
    this.gain.connect(ctx.destination);
    this.oscillator.start(ctx.currentTime);

    this.sp.classList.add("jump");
    this.oscillator.stop(ctx.currentTime + this.speed);
    this.oscillator.onended = () => this.cease();
  }
}

// ===== INITIALIZE SOUNDS =====
notes.forEach((note, i) => {
  sounds.push(new Sound(note.f, note.d, i));
});

// ===== AUDIO EVENTS =====
let hasStarted = false;

function startOnInteraction(){
  if(!hasStarted){
    initAudioContext();
    sounds[0].play();
    flag = true;
    hasStarted = true;
  }
}

// Multiple event listeners untuk compatibility Chrome, iOS, dan browser lain
document.addEventListener('click', startOnInteraction, {once:true});
document.addEventListener('touchstart', startOnInteraction, {once:true});
document.addEventListener('pointerdown', startOnInteraction, {once:true});
window.addEventListener('load', () => {
  // Pre-initialize AudioContext setelah halaman fully loaded (untuk iOS)
  initAudioContext();
});

// ===== CANVAS PARTICLE ANIMATION =====
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let cw = canvas.width = window.innerWidth;
let ch = canvas.height = window.innerHeight;

let requestId = null;
const colors = ["#93DFB8", "#FFC8BA", "#E3AAD6", "#B5D8EB", "#FFBDD8"];

class Particle {
  constructor() {
    this.x = Math.random() * cw;
    this.y = Math.random() * ch;
    this.r = 15 + ~~(Math.random() * 20);
    this.l = 3 + ~~(Math.random() * 2);
    this.a = (2 * Math.PI) / this.l;
    this.rot = Math.random() * Math.PI;
    this.speed = 0.05 + Math.random() / 2;
    this.rotSpeed = 0.005 + Math.random() * 0.005;
    this.color = colors[~~(Math.random() * colors.length)];
  }

  update() {
    if (this.y < -this.r) {
      this.y = ch + this.r;
      this.x = Math.random() * cw;
    }
    this.y -= this.speed;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.beginPath();

    for (let i = 0; i < this.l; i++) {
      const x = this.r * Math.cos(this.a * i);
      const y = this.r * Math.sin(this.a * i);
      ctx.lineTo(x, y);
    }

    ctx.closePath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = this.color;
    ctx.stroke();
    ctx.restore();
  }
}

// ===== INITIALIZE PARTICLES =====
const particles = [];
for (let i = 0; i < 20; i++) {
  particles.push(new Particle());
}

// ===== ANIMATION LOOP =====
function draw() {
  requestId = window.requestAnimationFrame(draw);
  ctx.clearRect(0, 0, cw, ch);

  particles.forEach(particle => {
    particle.rot += particle.rotSpeed;
    particle.update();
    particle.draw();
  });
}

function init() {
  if (requestId) {
    window.cancelAnimationFrame(requestId);
    requestId = null;
  }

  cw = canvas.width = window.innerWidth;
  ch = canvas.height = window.innerHeight;
  draw();
}

// ===== START ANIMATION =====
setTimeout(() => { init(); window.addEventListener('resize', init); }, 15);
