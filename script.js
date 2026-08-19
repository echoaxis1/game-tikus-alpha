class SoundController {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.bgm = new Audio('bgm.mp3');
    this.bgm.loop = true;
    this.bgm.volume = 0.35;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playBGM() {
    if (!this.enabled) return;
    this.bgm.currentTime = 0;
    this.bgm.play().catch(() => {
      // Browser autoplay policy catch
    });
  }

  stopBGM() {
    this.bgm.pause();
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.bgm.pause();
    } else {
      this.bgm.play().catch(() => {});
    }
    return this.enabled;
  }

  // Cute Whack / Boing Sound for Mouse Hit
  playHitMouse() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.18);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  // Hammer Whoosh (Miss)
  playWhoosh() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Deep Bomb Explosion Sound
  playExplosion() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;

    // White noise for explosion crunch
    const bufferSize = this.ctx.sampleRate * 0.4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter for low thud
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(100, now + 0.4);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    // Deep sub bass
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sawtooth';
    subOsc.frequency.setValueAtTime(120, now);
    subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

    subGain.gain.setValueAtTime(0.5, now);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);

    noise.start(now);
    subOsc.start(now);
    noise.stop(now + 0.4);
    subOsc.stop(now + 0.35);
  }

  // Game Start Jingle
  playStart() {
    if (!this.enabled) return;
    this.init();
    const notes = [330, 392, 523, 659]; // E4, G4, C5, E5
    notes.forEach((freq, i) => {
      const now = this.ctx.currentTime + i * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    });
  }

  // Game Over Jingle
  playGameOver() {
    if (!this.enabled) return;
    this.init();
    const notes = [440, 415, 392, 330, 261]; // A4, Ab4, G4, E4, C4
    notes.forEach((freq, i) => {
      const now = this.ctx.currentTime + i * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    });
  }

  // Epic Power-Up Activation Fanfare
  playPowerUp() {
    if (!this.enabled) return;
    this.init();
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C, E, G, C, E, G, C (Major arpeggio)
    notes.forEach((freq, i) => {
      const now = this.ctx.currentTime + i * 0.05;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    });
  }

  // Sci-Fi Laser Blaster Sound
  playLaser() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.15);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Rocket Launch & Explosion
  playRocket() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;

    // Rising whistle
    const whistle = this.ctx.createOscillator();
    const whistleGain = this.ctx.createGain();
    whistle.type = 'sine';
    whistle.frequency.setValueAtTime(250, now);
    whistle.frequency.exponentialRampToValueAtTime(1100, now + 0.2);

    whistleGain.gain.setValueAtTime(0.25, now);
    whistleGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    whistle.connect(whistleGain);
    whistleGain.connect(this.ctx.destination);

    whistle.start(now);
    whistle.stop(now + 0.2);

    setTimeout(() => {
      this.playExplosion();
    }, 180);
  }

  // Super Hammer Thunder Strike
  playSuperHit() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  // Triumphant Victory Fanfare
  playVictory() {
    if (!this.enabled) return;
    this.init();
    // Triumphant chord progression: C4, E4, G4, C5, E5, G5, C6
    const notes = [
      { f: 523.25, d: 0.15, delay: 0 },
      { f: 523.25, d: 0.15, delay: 0.15 },
      { f: 523.25, d: 0.15, delay: 0.30 },
      { f: 659.25, d: 0.20, delay: 0.45 },
      { f: 783.99, d: 0.20, delay: 0.65 },
      { f: 1046.50, d: 0.50, delay: 0.85 }
    ];

    notes.forEach((n) => {
      const now = this.ctx.currentTime + n.delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, now);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + n.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + n.d);
    });
  }

  // Sparkling Coin Collect Sound (Chime)
  playCoin() {
    if (!this.enabled) return;
    this.init();
    const notes = [987.77, 1318.51]; // B5 -> E6 chime
    notes.forEach((freq, i) => {
      const now = this.ctx.currentTime + i * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.005, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    });
  }

  // Power-up Purchase Sound
  playBuyPower() {
    if (!this.enabled) return;
    this.init();
    const notes = [440, 554.37, 659.25, 880]; // A major fan-out
    notes.forEach((freq, i) => {
      const now = this.ctx.currentTime + i * 0.06;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    });
  }

  // Sharp Knife Stab / Slash Sound
  playKnifeStab() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  // Sword Basic Attack Slash Sound
  playSwordSlash() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(1050, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.13);

    gain.gain.setValueAtTime(0.38, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.13);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  // Mega Skill Slash (3 Petak)
  playMegaSlash() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;

    // Fast high metallic swoosh
    const swoosh = this.ctx.createOscillator();
    const swooshGain = this.ctx.createGain();
    swoosh.type = 'sawtooth';
    swoosh.frequency.setValueAtTime(1800, now);
    swoosh.frequency.exponentialRampToValueAtTime(90, now + 0.26);
    swooshGain.gain.setValueAtTime(0.5, now);
    swooshGain.gain.exponentialRampToValueAtTime(0.01, now + 0.26);

    swoosh.connect(swooshGain);
    swooshGain.connect(this.ctx.destination);
    swoosh.start(now);
    swoosh.stop(now + 0.26);

    // Energy boom impact
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(360, now + 0.04);
    subOsc.frequency.exponentialRampToValueAtTime(45, now + 0.32);
    subGain.gain.setValueAtTime(0.55, now + 0.04);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now + 0.04);
    subOsc.stop(now + 0.32);
  }

  // Heavy Mace Smash Hit Sound
  playMaceHit() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.16);

    gain.gain.setValueAtTime(0.38, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.16);
  }

  // Iron Punch 9-Hole Mega Magnetic Explosion Sound
  playIronPunch() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;

    // Heavy metallic clang
    const clang = this.ctx.createOscillator();
    const clangGain = this.ctx.createGain();
    clang.type = 'sawtooth';
    clang.frequency.setValueAtTime(1200, now);
    clang.frequency.exponentialRampToValueAtTime(200, now + 0.35);
    clangGain.gain.setValueAtTime(0.5, now);
    clangGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    clang.connect(clangGain);
    clangGain.connect(this.ctx.destination);
    clang.start(now);
    clang.stop(now + 0.35);

    // Deep magnetic earthquake boom
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(280, now + 0.04);
    subOsc.frequency.exponentialRampToValueAtTime(25, now + 0.55);
    subGain.gain.setValueAtTime(0.65, now + 0.04);
    subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now + 0.04);
    subOsc.stop(now + 0.55);

    setTimeout(() => {
      this.playExplosion();
    }, 120);
  }

  // Electric Hammer Zap Hit Sound
  playElectricZap() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.linearRampToValueAtTime(160, now + 0.16);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  // Electric Shield Barrier Deflection Sound
  playShieldBlock() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(1100, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.25);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  // Hyper Teaser Zap Attack Sound
  playHyperTeaserHit(points = 5, isImmune = false) {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const baseFreq = isImmune ? 1250 : 700 + Math.min(550, points * 18);

    osc.type = isImmune ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.14);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);

    // If immune (stack >= 25), add crystal electric harmonic resonance
    if (isImmune) {
      const harmOsc = this.ctx.createOscillator();
      const harmGain = this.ctx.createGain();
      harmOsc.type = 'sine';
      harmOsc.frequency.setValueAtTime(1600, now);
      harmOsc.frequency.exponentialRampToValueAtTime(850, now + 0.22);
      harmGain.gain.setValueAtTime(0.25, now);
      harmGain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      harmOsc.connect(harmGain);
      harmGain.connect(this.ctx.destination);
      harmOsc.start(now);
      harmOsc.stop(now + 0.22);
    }
  }

  // Hyper Teaser Forcefield Block Sound (Kebal Bom)
  playHyperTeaserBlock() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.exponentialRampToValueAtTime(1650, now + 0.09);
    osc.frequency.exponentialRampToValueAtTime(240, now + 0.28);

    gain.gain.setValueAtTime(0.48, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  // Poison Mouse Hit / Toxic Damage Sound
  playPoisonHit() {
    if (!this.enabled) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.32);

    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.32);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.32);
  }
}

// Particle System for Hits, Explosions, and Confetti
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createHitSparks(x, y, count = 12, colors = ['#f6e05e', '#ecc94b', '#ffffff']) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5);
      const speed = Math.random() * 5 + 3;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 1,
        decay: Math.random() * 0.05 + 0.04
      });
    }
  }

  createExplosion(x, y) {
    this.createHitSparks(x, y, 32, ['#ff4444', '#ff8800', '#ffd700', '#ffffff', '#22c55e']);
  }

  createConfetti(x, y) {
    const colors = ['#f56565', '#ed8936', '#ecc94b', '#48bb78', '#4299e1', '#9f7aea', '#ed64a6'];
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 4;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        size: Math.random() * 6 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 1,
        decay: Math.random() * 0.02 + 0.015,
        isConfetti: true,
        gravity: 0.15
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.gravity) p.vy += p.gravity;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.animate());
  }
}

// SVG Templates
const MOUSE_SVG = `
  <svg viewBox="0 0 100 100">
    <!-- Mouse Ears -->
    <circle cx="28" cy="30" r="16" fill="#8d99ae" stroke="#2b2d42" stroke-width="3" />
    <circle cx="28" cy="30" r="9" fill="#ffb4a2" />
    <circle cx="72" cy="30" r="16" fill="#8d99ae" stroke="#2b2d42" stroke-width="3" />
    <circle cx="72" cy="30" r="9" fill="#ffb4a2" />

    <!-- Mouse Body/Head -->
    <ellipse cx="50" cy="55" rx="34" ry="32" fill="#8d99ae" stroke="#2b2d42" stroke-width="3" />
    
    <!-- Cheeks -->
    <ellipse cx="32" cy="62" rx="6" ry="4" fill="#ffb4a2" opacity="0.6" />
    <ellipse cx="68" cy="62" rx="6" ry="4" fill="#ffb4a2" opacity="0.6" />

    <!-- Big Eyes -->
    <circle cx="38" cy="48" r="7" fill="#ffffff" stroke="#2b2d42" stroke-width="1.5" />
    <circle cx="39" cy="48" r="4" fill="#1a202c" />
    <circle cx="41" cy="46" r="1.5" fill="#ffffff" />

    <circle cx="62" cy="48" r="7" fill="#ffffff" stroke="#2b2d42" stroke-width="1.5" />
    <circle cx="61" cy="48" r="4" fill="#1a202c" />
    <circle cx="63" cy="46" r="1.5" fill="#ffffff" />

    <!-- Nose -->
    <polygon points="50,56 44,52 56,52" fill="#e53e3e" />

    <!-- Whiskers -->
    <line x1="26" y1="53" x2="10" y2="50" stroke="#2b2d42" stroke-width="2" stroke-linecap="round" />
    <line x1="26" y1="58" x2="8" y2="60" stroke="#2b2d42" stroke-width="2" stroke-linecap="round" />
    <line x1="74" y1="53" x2="90" y2="50" stroke="#2b2d42" stroke-width="2" stroke-linecap="round" />
    <line x1="74" y1="58" x2="92" y2="60" stroke="#2b2d42" stroke-width="2" stroke-linecap="round" />

    <!-- Front Paws -->
    <ellipse cx="36" cy="80" rx="7" ry="5" fill="#8d99ae" stroke="#2b2d42" stroke-width="2" />
    <ellipse cx="64" cy="80" rx="7" ry="5" fill="#8d99ae" stroke="#2b2d42" stroke-width="2" />
    <!-- Buck Teeth -->
    <rect x="47" y="58" width="6" height="6" fill="#ffffff" stroke="#2b2d42" stroke-width="1" rx="1" />
  </svg>
`;

const POISON_MOUSE_SVG = `
  <svg viewBox="0 0 100 100">
    <defs>
      <radialGradient id="poison-aura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#4ade80" stop-opacity="0.6" />
        <stop offset="70%" stop-color="#16a34a" stop-opacity="0.3" />
        <stop offset="100%" stop-color="#15803d" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="poison-body" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#4ade80" />
        <stop offset="60%" stop-color="#22c55e" />
        <stop offset="100%" stop-color="#15803d" />
      </linearGradient>
    </defs>
    <!-- Toxic Glow Aura -->
    <ellipse cx="50" cy="55" rx="42" ry="38" fill="url(#poison-aura)" />

    <!-- Mouse Ears -->
    <circle cx="28" cy="30" r="16" fill="#15803d" stroke="#052e16" stroke-width="3" />
    <circle cx="28" cy="30" r="9" fill="#86efac" />
    <circle cx="72" cy="30" r="16" fill="#15803d" stroke="#052e16" stroke-width="3" />
    <circle cx="72" cy="30" r="9" fill="#86efac" />

    <!-- Mouse Body/Head -->
    <ellipse cx="50" cy="55" rx="34" ry="32" fill="url(#poison-body)" stroke="#052e16" stroke-width="3" />
    
    <!-- Toxic Bubbles / Spots -->
    <circle cx="36" cy="40" r="3.5" fill="#a855f7" opacity="0.8" />
    <circle cx="64" cy="40" r="2.5" fill="#a855f7" opacity="0.8" />
    <circle cx="50" cy="32" r="2" fill="#a855f7" opacity="0.9" />

    <!-- Cheeks (Purple Toxic) -->
    <ellipse cx="32" cy="62" rx="6" ry="4" fill="#c084fc" opacity="0.7" />
    <ellipse cx="68" cy="62" rx="6" ry="4" fill="#c084fc" opacity="0.7" />

    <!-- Glowing Yellow Toxic Eyes -->
    <circle cx="38" cy="48" r="7" fill="#fef08a" stroke="#052e16" stroke-width="1.5" />
    <circle cx="39" cy="48" r="4" fill="#713f12" />
    <circle cx="41" cy="46" r="1.5" fill="#ffffff" />

    <circle cx="62" cy="48" r="7" fill="#fef08a" stroke="#052e16" stroke-width="1.5" />
    <circle cx="61" cy="48" r="4" fill="#713f12" />
    <circle cx="63" cy="46" r="1.5" fill="#ffffff" />

    <!-- Nose (Purple Toxic) -->
    <polygon points="50,56 44,52 56,52" fill="#9333ea" />

    <!-- Whiskers -->
    <line x1="26" y1="53" x2="10" y2="50" stroke="#052e16" stroke-width="2" stroke-linecap="round" />
    <line x1="26" y1="58" x2="8" y2="60" stroke="#052e16" stroke-width="2" stroke-linecap="round" />
    <line x1="74" y1="53" x2="90" y2="50" stroke="#052e16" stroke-width="2" stroke-linecap="round" />
    <line x1="74" y1="58" x2="92" y2="60" stroke="#052e16" stroke-width="2" stroke-linecap="round" />

    <!-- Toxic Skull Symbol on Forehead -->
    <circle cx="50" cy="42" r="3" fill="#ffffff" opacity="0.9" />
    <rect x="48.5" y="44" width="3" height="2" fill="#ffffff" opacity="0.9" />
    <circle cx="49" cy="41.5" r="0.7" fill="#052e16" />
    <circle cx="51" cy="41.5" r="0.7" fill="#052e16" />

    <!-- Front Paws -->
    <ellipse cx="36" cy="80" rx="7" ry="5" fill="#15803d" stroke="#052e16" stroke-width="2" />
    <ellipse cx="64" cy="80" rx="7" ry="5" fill="#15803d" stroke="#052e16" stroke-width="2" />
    <!-- Buck Teeth with Green Toxic Drip -->
    <rect x="47" y="58" width="6" height="6" fill="#fef08a" stroke="#052e16" stroke-width="1" rx="1" />
    <circle cx="50" cy="65" r="1.5" fill="#a855f7" />
  </svg>
`;

const BOMB_SVG = `
  <svg viewBox="0 0 100 100">
    <!-- Fuse -->
    <path d="M50,30 Q58,16 68,14" fill="none" stroke="#d69e2e" stroke-width="4" stroke-linecap="round" />
    <!-- Spark on Fuse -->
    <circle cx="70" cy="13" r="5" fill="#e53e3e" />
    <circle cx="70" cy="13" r="2.5" fill="#f6e05e" />

    <!-- Bomb Cap -->
    <rect x="42" y="24" width="16" height="8" rx="2" fill="#4a5568" stroke="#1a202c" stroke-width="2" />

    <!-- Bomb Body -->
    <circle cx="50" cy="58" r="32" fill="#1a202c" stroke="#000000" stroke-width="3.5" />
    <!-- Bomb Highlight -->
    <ellipse cx="38" cy="46" rx="8" ry="5" fill="#718096" transform="rotate(-30 38 46)" />

    <!-- Skull or Danger Symbol -->
    <circle cx="43" cy="58" r="3.5" fill="#e53e3e" />
    <circle cx="57" cy="58" r="3.5" fill="#e53e3e" />
    <path d="M44,68 Q50,64 56,68" fill="none" stroke="#e53e3e" stroke-width="3" stroke-linecap="round" />
  </svg>
`;

const HAMMER_CURSOR_SVG = `
  <svg viewBox="0 0 100 100" class="hammer-svg weapon-svg">
    <!-- Wood Handle -->
    <rect x="42" y="35" width="16" height="60" rx="6" fill="#8B4513" stroke="#4A2508" stroke-width="3" />
    <rect x="44" y="55" width="12" height="6" rx="2" fill="#A0522D" />
    <rect x="44" y="70" width="12" height="6" rx="2" fill="#A0522D" />
    <!-- Metal Head -->
    <rect x="15" y="10" width="70" height="30" rx="6" fill="#718096" stroke="#2D3748" stroke-width="3.5" />
    <rect x="18" y="13" width="64" height="6" rx="3" fill="#A0AEC0" />
    <!-- Metallic Face Caps -->
    <rect x="10" y="7" width="10" height="36" rx="3" fill="#4A5568" stroke="#2D3748" stroke-width="2" />
    <rect x="80" y="7" width="10" height="36" rx="3" fill="#4A5568" stroke="#2D3748" stroke-width="2" />
  </svg>
`;

const KNIFE_CURSOR_SVG = `
  <svg viewBox="0 0 100 100" class="knife-svg weapon-svg">
    <defs>
      <linearGradient id="knife-blade-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="50%" stop-color="#cbd5e0" />
        <stop offset="100%" stop-color="#718096" />
      </linearGradient>
      <linearGradient id="knife-edge-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="100%" stop-color="#a0aec0" />
      </linearGradient>
    </defs>
    <!-- Blade -->
    <path d="M45,8 C54,8 60,25 60,54 L44,54 C42,32 40,16 45,8 Z" fill="url(#knife-blade-grad)" stroke="#2d3748" stroke-width="2.5" />
    <path d="M52,10 L54,52 L46,52 L47,15 Z" fill="url(#knife-edge-grad)" opacity="0.8" />
    <line x1="53" y1="12" x2="53" y2="52" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" />
    <!-- Guard -->
    <rect x="34" y="54" width="28" height="7" rx="3" fill="#d69e2e" stroke="#744210" stroke-width="1.8" />
    <circle cx="48" cy="57.5" r="1.8" fill="#fff" />
    <!-- Handle -->
    <rect x="43" y="61" width="10" height="28" rx="4" fill="#2d3748" stroke="#1a202c" stroke-width="2" />
    <rect x="44" y="66" width="8" height="3.5" rx="1" fill="#718096" />
    <rect x="44" y="73" width="8" height="3.5" rx="1" fill="#718096" />
    <rect x="44" y="80" width="8" height="3.5" rx="1" fill="#718096" />
    <!-- Pommel -->
    <circle cx="48" cy="92" r="5.5" fill="#d69e2e" stroke="#744210" stroke-width="1.8" />
    <circle cx="48" cy="92" r="2" fill="#fff" />
  </svg>
`;

const SWORD_CURSOR_SVG = `
  <svg viewBox="0 0 100 100" class="sword-svg weapon-svg">
    <defs>
      <linearGradient id="sword-blade-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="45%" stop-color="#e2e8f0" />
        <stop offset="50%" stop-color="#90cdf4" />
        <stop offset="55%" stop-color="#cbd5e0" />
        <stop offset="100%" stop-color="#718096" />
      </linearGradient>
      <linearGradient id="sword-edge-glow" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="60%" stop-color="#63b3ed" />
        <stop offset="100%" stop-color="#3182ce" />
      </linearGradient>
      <linearGradient id="sword-guard-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ecc94b" />
        <stop offset="50%" stop-color="#d69e2e" />
        <stop offset="100%" stop-color="#744210" />
      </linearGradient>
    </defs>
    <!-- Blade Aura / Energy -->
    <path d="M49,3 L53,3 L56,58 L46,58 Z" fill="none" stroke="#63b3ed" stroke-width="6" opacity="0.35" filter="blur(2px)" />
    <!-- Sharp Blade -->
    <path d="M49,2 C50,2 52,5 55,58 L45,58 C48,5 50,2 49,2 Z" fill="url(#sword-blade-grad)" stroke="#2d3748" stroke-width="2.2" />
    <!-- Central Ridge / Fuller -->
    <line x1="50" y1="5" x2="50" y2="56" stroke="url(#sword-edge-glow)" stroke-width="1.8" stroke-linecap="round" />
    <line x1="48.5" y1="7" x2="48.5" y2="52" stroke="#ffffff" stroke-width="1" stroke-linecap="round" opacity="0.9" />
    <!-- Crossguard Wings -->
    <path d="M30,58 C38,56 44,58 50,60 C56,58 62,56 70,58 C72,61 68,64 50,64 C32,64 28,61 30,58 Z" fill="url(#sword-guard-grad)" stroke="#744210" stroke-width="1.8" />
    <!-- Guard Gem (Sapphire) -->
    <circle cx="50" cy="61" r="3.2" fill="#3182ce" stroke="#ebf8ff" stroke-width="1" />
    <circle cx="49" cy="60" r="1.2" fill="#ffffff" />
    <!-- Hilt Grip -->
    <rect x="46.5" y="64" width="7" height="24" rx="2.5" fill="#1a202c" stroke="#2d3748" stroke-width="1.5" />
    <!-- Gold Wire Wrapping on Grip -->
    <line x1="46.5" y1="68" x2="53.5" y2="70" stroke="#d69e2e" stroke-width="1.2" />
    <line x1="46.5" y1="74" x2="53.5" y2="76" stroke="#d69e2e" stroke-width="1.2" />
    <line x1="46.5" y1="80" x2="53.5" y2="82" stroke="#d69e2e" stroke-width="1.2" />
    <!-- Pommel -->
    <circle cx="50" cy="91" r="5.5" fill="url(#sword-guard-grad)" stroke="#744210" stroke-width="1.8" />
    <circle cx="50" cy="91" r="2.2" fill="#3182ce" />
  </svg>
`;

const ELECTRIC_HAMMER_CURSOR_SVG = `
  <svg viewBox="0 0 100 100" class="electric-hammer-svg weapon-svg">
    <defs>
      <radialGradient id="elec-glow-cur" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#00f5d4" stop-opacity="0.85" />
        <stop offset="60%" stop-color="#00b4d8" stop-opacity="0.4" />
        <stop offset="100%" stop-color="#0077b6" stop-opacity="0" />
      </radialGradient>
      <linearGradient id="elec-head-grad-cur" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#03045e" />
        <stop offset="50%" stop-color="#0077b6" />
        <stop offset="100%" stop-color="#00f5d4" />
      </linearGradient>
    </defs>
    <!-- Aura -->
    <circle cx="50" cy="26" r="32" fill="url(#elec-glow-cur)" />
    <!-- Handle -->
    <rect x="42" y="36" width="16" height="58" rx="6" fill="#1a202c" stroke="#00b4d8" stroke-width="2.5" />
    <rect x="44" y="50" width="12" height="5" rx="2" fill="#00f5d4" />
    <rect x="44" y="63" width="12" height="5" rx="2" fill="#00f5d4" />
    <rect x="44" y="76" width="12" height="5" rx="2" fill="#00f5d4" />
    <!-- Head -->
    <rect x="14" y="10" width="72" height="32" rx="7" fill="url(#elec-head-grad-cur)" stroke="#00f5d4" stroke-width="3" />
    <rect x="18" y="13" width="64" height="6" rx="3" fill="#e0fbfc" opacity="0.9" />
    <!-- Caps -->
    <rect x="9" y="8" width="10" height="36" rx="4" fill="#00b4d8" stroke="#0077b6" stroke-width="2" />
    <rect x="81" y="8" width="10" height="36" rx="4" fill="#00b4d8" stroke="#0077b6" stroke-width="2" />
    <!-- Bolt Symbol -->
    <polygon points="53,13 41,26 48,26 43,39 59,24 51,24" fill="#ffe600" stroke="#ffb703" stroke-width="1.2" />
  </svg>
`;

const MAGNET_MACE_CURSOR_SVG = `
  <svg viewBox="0 0 100 100" class="mace-svg weapon-svg">
    <defs>
      <radialGradient id="mace-core-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="35%" stop-color="#9f7aea" />
        <stop offset="70%" stop-color="#805ad5" />
        <stop offset="100%" stop-color="#44337a" />
      </radialGradient>
      <linearGradient id="mace-iron-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#cbd5e0" />
        <stop offset="50%" stop-color="#4a5568" />
        <stop offset="100%" stop-color="#1a202c" />
      </linearGradient>
      <linearGradient id="mace-mag-red" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#fc8181" />
        <stop offset="100%" stop-color="#e53e3e" />
      </linearGradient>
      <linearGradient id="mace-mag-blue" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#63b3ed" />
        <stop offset="100%" stop-color="#3182ce" />
      </linearGradient>
    </defs>
    <!-- Magnetic Force Field Rings -->
    <ellipse cx="50" cy="30" rx="36" ry="16" fill="none" stroke="#9f7aea" stroke-width="2.5" stroke-dasharray="4,3" opacity="0.8" transform="rotate(-15 50 30)" />
    <!-- Handle Rod -->
    <rect x="44" y="38" width="12" height="56" rx="5" fill="url(#mace-iron-grad)" stroke="#1a202c" stroke-width="2" />
    <rect x="45" y="55" width="10" height="5" rx="1.5" fill="#e53e3e" />
    <rect x="45" y="65" width="10" height="5" rx="1.5" fill="#3182ce" />
    <rect x="45" y="75" width="10" height="5" rx="1.5" fill="#9f7aea" />
    <!-- Mace Head Core -->
    <circle cx="50" cy="28" r="22" fill="url(#mace-core-glow)" stroke="#1a202c" stroke-width="2.5" />
    <!-- Magnetic Pole Arcs (Horseshoe Magnet Claws) -->
    <!-- North Red Pole -->
    <path d="M26,14 C32,6 46,6 48,16 L40,22 C38,16 32,16 28,20 Z" fill="url(#mace-mag-red)" stroke="#742a2a" stroke-width="1.5" />
    <text x="31" y="16" font-size="7" font-weight="bold" fill="#fff">N</text>
    <!-- South Blue Pole -->
    <path d="M74,14 C68,6 54,6 52,16 L60,22 C62,16 68,16 72,20 Z" fill="url(#mace-mag-blue)" stroke="#2a4365" stroke-width="1.5" />
    <text x="64" y="16" font-size="7" font-weight="bold" fill="#fff">S</text>
    <!-- Iron Spikes / Studs -->
    <polygon points="50,4 45,10 55,10" fill="#e2e8f0" stroke="#1a202c" stroke-width="1.5" />
    <polygon points="22,30 28,25 28,35" fill="#e2e8f0" stroke="#1a202c" stroke-width="1.5" />
    <polygon points="78,30 72,25 72,35" fill="#e2e8f0" stroke="#1a202c" stroke-width="1.5" />
    <!-- Center Core Spark -->
    <circle cx="50" cy="28" r="6" fill="#ffffff" filter="drop-shadow(0 0 4px #9f7aea)" />
    <!-- Bottom Mace Pommel -->
    <circle cx="50" cy="92" r="6.5" fill="#e53e3e" stroke="#1a202c" stroke-width="2" />
    <circle cx="50" cy="92" r="3" fill="#ffffff" />
  </svg>
`;

const HYPER_TEASER_CURSOR_SVG = `
  <svg viewBox="0 0 100 100" class="teaser-svg weapon-svg">
    <defs>
      <linearGradient id="teaser-body-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b" />
        <stop offset="50%" stop-color="#0f172a" />
        <stop offset="100%" stop-color="#020617" />
      </linearGradient>
      <linearGradient id="teaser-metal-grad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#f8fafc" />
        <stop offset="50%" stop-color="#94a3b8" />
        <stop offset="100%" stop-color="#475569" />
      </linearGradient>
      <linearGradient id="teaser-neon-grad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="50%" stop-color="#06b6d4" />
        <stop offset="100%" stop-color="#facc15" />
      </linearGradient>
      <radialGradient id="teaser-core-plasma" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="35%" stop-color="#38bdf8" />
        <stop offset="75%" stop-color="#0284c7" />
        <stop offset="100%" stop-color="#082f49" stop-opacity="0" />
      </radialGradient>
    </defs>
    <!-- Background Electric Plasma Aura -->
    <circle cx="50" cy="30" r="28" fill="url(#teaser-core-plasma)" opacity="0.65" />
    <!-- Upper Dual Stun Prongs (High-Voltage Electrodes) -->
    <rect x="36" y="4" width="5" height="24" rx="2" fill="url(#teaser-metal-grad)" stroke="#0284c7" stroke-width="1.2" />
    <rect x="59" y="4" width="5" height="24" rx="2" fill="url(#teaser-metal-grad)" stroke="#0284c7" stroke-width="1.2" />
    <polygon points="36,4 38.5,1 41,4" fill="#facc15" />
    <polygon points="59,4 61.5,1 64,4" fill="#facc15" />
    <!-- Electric Arc Spark Between Electrodes -->
    <path d="M39,8 Q50,2 61,8 Q50,14 39,8 Z" fill="#facc15" opacity="0.85" />
    <path d="M40,16 L48,11 L47,19 L60,14" stroke="#38bdf8" stroke-width="2.2" fill="none" stroke-linecap="round" />
    <path d="M39,22 L46,18 L48,24 L60,20" stroke="#facc15" stroke-width="1.8" fill="none" stroke-linecap="round" />
    <!-- Main Taser Emitter Head / Barrel Housing -->
    <rect x="28" y="24" width="44" height="26" rx="6" fill="url(#teaser-body-grad)" stroke="#38bdf8" stroke-width="2.2" />
    <rect x="32" y="28" width="36" height="4" rx="2" fill="url(#teaser-neon-grad)" />
    <!-- Central Glowing Plasma Capacitor Core -->
    <circle cx="50" cy="38" r="8.5" fill="url(#teaser-core-plasma)" stroke="#38bdf8" stroke-width="1.5" />
    <circle cx="50" cy="38" r="3.5" fill="#ffffff" />
    <!-- High Voltage Indicator Traces -->
    <line x1="32" y1="42" x2="41" y2="42" stroke="#facc15" stroke-width="1.5" stroke-linecap="round" />
    <line x1="59" y1="42" x2="68" y2="42" stroke="#facc15" stroke-width="1.5" stroke-linecap="round" />
    <!-- Ergonomic Pistol Grip Handle -->
    <path d="M43,50 L57,50 L54,88 C54,92 46,92 46,88 Z" fill="url(#teaser-body-grad)" stroke="#0284c7" stroke-width="2" />
    <rect x="44" y="56" width="12" height="4" rx="1.5" fill="#0284c7" />
    <rect x="44" y="65" width="12" height="4" rx="1.5" fill="#0284c7" />
    <rect x="45" y="74" width="10" height="4" rx="1.5" fill="#0284c7" />
    <!-- Power Base / Bottom Gold Ring -->
    <ellipse cx="50" cy="88" rx="6" ry="3" fill="#facc15" stroke="#ca8a04" stroke-width="1.2" />
  </svg>
`;

const WEAPONS_CONFIG = {
  hammer: {
    id: 'hammer',
    name: 'Palu Kayu',
    shortName: 'Palu Kayu',
    icon: '🔨',
    price: 0,
    desc: 'Senjata klasik andalan. Memberikan +10 Poin per tikus dan mendukung Combo Multiplier hingga 4x lipat!',
    perks: ['+10 Poin Tikus', 'Combo Multiplier s/d 4x', 'Gratis (Default)'],
    badge: 'Standard'
  },
  hyper_teaser: {
    id: 'hyper_teaser',
    name: 'Hyper Teaser',
    shortName: 'Hyper Teaser',
    icon: '⚡🎯',
    price: 500,
    desc: 'Senjata canggih bertenaga listrik berantai! Tiap memukul tikus mendapat 5 poin basis + 5 poin per combo tanpa batas (+5, +10, +15, +20, +25, +30...). Saat mencapai stack 25 poin (+25 poin / combo 5+), senjata ini AKTIF KEBAL TERHADAP APAPUN (menangkis dan defuse bom)! Jika stack hanya 5, 10, 15, atau 20 (combo 1-4), tidak kebal.',
    perks: [
      '+5 Poin Basis / Tikus',
      '⚡ Combo Tanpa Batas (+5 Poin Tiap Hit Berturut)',
      '🛡️ KEBAL TOTAL saat Stack ≥ 25 Poin (Combo 5+)',
      '⚠️ Tidak Kebal saat Stack 5, 10, 15, 20 (Combo 1-4)',
      'Harga: 🪙 500 Koin'
    ],
    badge: 'Hyper Tech'
  },
  magnet_mace: {
    id: 'magnet_mace',
    name: 'Magnet Mace',
    shortName: 'Magnet Mace',
    icon: '🧲🔨',
    price: 600,
    desc: 'Gada magnetik raksasa! Serangan biasa memberikan +13 Poin (tanpa combo). Memiliki Skill Aktif [IRON PUNCH] (Cooldown 15 Detik) yang menghancurkan 9 petak sekaligus, serta instan terisi penuh saat menyerap bom! KEKUATAN PASIF RAHASIA: Saat mati, memicu LEDAKAN RAKSASA, bangkit kembali dengan 1 nyawa, dan KEBAL APAPUN SELAMA 8 DETIK (1x/game)!',
    perks: ['+13 Poin Instan / Tikus', 'Tanpa Sistem Combo', '🧲 Skill Aktif: Iron Punch (9 Lobang, CD 15s)', '⚡ Serap Bom: Cooldown Instan Reset', '👑 Undying: Meledak + Bangkit & Kebal 8s (1x/Game)', 'Harga: 🪙 600 Koin'],
    badge: 'Iron Power'
  },
  knife: {
    id: 'knife',
    name: 'Pisau Belati',
    shortName: 'Pisau Belati',
    icon: '🗡️',
    price: 300,
    desc: 'Menusuk tikus dengan cepat! Memberikan +13 Poin instan setiap tusukan berhasil (tanpa sistem combo).',
    perks: ['+13 Poin Instan / Tikus', 'Tanpa Sistem Combo', 'Harga: 🪙 300 Koin'],
    badge: 'Kecepatan'
  },
  sword: {
    id: 'sword',
    name: 'Pedang Kesatria',
    shortName: 'Pedang',
    icon: '⚔️',
    price: 400,
    desc: 'Pedang tajam andalan! Serangan biasa menambah +11 Poin basis dengan fitur Combo Multiplier, serta memiliki Skill Aktif [SLASH] (Cooldown 15 Detik) yang menebas 3 petak sekaligus!',
    perks: ['+11 Poin Basis / Tikus', 'Mendukung Combo Multiplier s/d 4x', '⚔️ Skill Aktif: Slash 3 Petak (CD 15s)', 'Harga: 🪙 400 Koin'],
    badge: 'Skill Aktif'
  },
  electric_hammer: {
    id: 'electric_hammer',
    name: 'Palu Listrik',
    shortName: 'Palu Listrik',
    icon: '⚡🔨',
    price: 500,
    desc: 'Palu petir bertenaga tinggi! Memberikan +13 Poin instan per tikus (tanpa sistem combo) dan kebal terhadap 1x ledakan bom per permainan!',
    perks: ['+13 Poin Instan / Tikus', 'Tanpa Sistem Combo', '🛡️ Kebal 1x Bom per Game', 'Harga: 🪙 500 Koin'],
    badge: 'Epic'
  }
};

const DIFFICULTY_CONFIG = {
  easy: {
    name: 'Mudah',
    badge: '🌱 Mudah',
    spawnMin: 1500,
    spawnMax: 2100,
    upTimeMin: 1300,
    upTimeMax: 1700,
    bombRate: 0.20, // Peluang bom 20%
    doubleSpawnRate: 0.30, // Peluang 2 lobang sekaligus 30%
    speedScale: 2
  },
  medium: {
    name: 'Sedang',
    badge: '⚡ Sedang',
    spawnMin: 950,
    spawnMax: 1350,
    upTimeMin: 850,
    upTimeMax: 1150,
    bombRate: 0.35, // Peluang bom 35%
    doubleSpawnRate: 0.40, // Peluang 2 lobang sekaligus 40%
    speedScale: 4
  },
  hard: {
    name: 'Sulit',
    badge: '🔥 Sulit',
    spawnMin: 800,
    spawnMax: 1150,
    upTimeMin: 750,
    upTimeMax: 1000,
    bombRate: 0.50, // Peluang bom 50%
    doubleSpawnRate: 0.50, // Peluang 2 lobang sekaligus 50%
    speedScale: 3
  },
  extreme: {
    name: 'Extreme',
    badge: '☠️ Extreme',
    spawnMin: 500,
    spawnMax: 750,
    upTimeMin: 450,
    upTimeMax: 650,
    bombRate: 0.50, // Peluang bom 50%
    doubleSpawnRate: 0.60, // Peluang 2 lobang sekaligus 60%
    speedScale: 4
  },
  bomb_crazy: {
    name: 'Bom Gila',
    badge: '💣 Bom Gila (80% Bom)',
    spawnMin: 800,
    spawnMax: 1150,
    upTimeMin: 700,
    upTimeMax: 950,
    bombRate: 0.80, // Peluang bom 80%
    doubleSpawnRate: 0.65, // Peluang bom muncul di 2 petak sekaligus 65%
    speedScale: 3
  },
  crazy_weapons: {
    name: 'Senjata Gila',
    badge: '⚔️ Senjata Gila',
    spawnMin: 1000, // Kecepatan dikurangi setengahnya (2x lebih santai)
    spawnMax: 1500,
    upTimeMin: 900,
    upTimeMax: 1300,
    bombRate: 0.45,
    doubleSpawnRate: 0.65,
    speedScale: 2
  },
  poison_mouse: {
    name: 'Tikus Beracun',
    badge: '🧪 Tikus Beracun',
    spawnMin: 1500,
    spawnMax: 2100,
    upTimeMin: 1300,
    upTimeMax: 1700,
    bombRate: 0.15,
    poisonRate: 0.40, // Peluang 40% tikus hijau beracun
    doubleSpawnRate: 0.30,
    speedScale: 2,
    victoryCoins: 250 // Hadiah 250 koin saat tamat!
  }
};

// 10 Piagam Penghargaan Configuration
const ACHIEVEMENTS_CONFIG = [
  {
    id: 'too_easy',
    title: 'Too Easy',
    icon: '🌱',
    desc: 'Capai skor 250 di level Mudah',
    reward: 25
  },
  {
    id: 'all_is_boom_wall',
    title: 'All is Boom Wall',
    icon: '💥',
    desc: 'Capai skor 1000 di mode apapun (kecuali mode event)',
    reward: 100
  },
  {
    id: 'complete_the_easy',
    title: 'Complete the Easy',
    icon: '🏆',
    desc: 'Tamatkan level Mudah (Skor 1500)',
    reward: 100
  },
  {
    id: 'complete_the_medium',
    title: 'Complete the Medium',
    icon: '⚡',
    desc: 'Tamatkan level Sedang (Skor 1500)',
    reward: 110
  },
  {
    id: 'complete_hard',
    title: 'Complete Hard',
    icon: '🔥',
    desc: 'Tamatkan level Sulit (Skor 1500)',
    reward: 125
  },
  {
    id: 'impossible',
    title: 'Impossible',
    icon: '☠️',
    desc: 'Buka level Extreme lalu mainkan',
    reward: 100
  },
  {
    id: 'collector',
    title: 'Collector',
    icon: '🎒',
    desc: 'Beli semua jenis senjata (Palu, Roket, Laser, Hati)',
    reward: 100
  },
  {
    id: 'crazy',
    title: 'Crazy',
    icon: '⚡',
    desc: 'Capai skor 500 di mode Extreme',
    reward: 125
  },
  {
    id: 'boom_and_swing',
    title: 'Boom and Swing',
    icon: '🎉',
    desc: 'Tamatkan semua level di mode event (Bom Gila & Senjata Gila)',
    reward: 150
  },
  {
    id: 'all_in',
    title: 'All In',
    icon: '👑',
    desc: 'Dapatkan seluruh 9 piagam penghargaan lainnya',
    reward: 300
  }
];

// Main Game Controller
class Game {
  constructor() {
    this.score = 0;
    this.lives = 3;
    this.miceHit = 0;
    this.combo = 0;
    this.mode = 'easy'; // default to easy / santai
    this.coins = parseInt(localStorage.getItem('whack_mouse_coins') || '0', 10);
    this.lastCoinMilestone = 0;
    this.lastFreeWeaponMilestone = 0;
    this.highScores = {
      easy: parseInt(localStorage.getItem('whack_mouse_hs_easy') || '1000', 10),
      medium: parseInt(localStorage.getItem('whack_mouse_hs_medium') || '750', 10),
      hard: parseInt(localStorage.getItem('whack_mouse_hs_hard') || '500', 10),
      extreme: parseInt(localStorage.getItem('whack_mouse_hs_extreme') || '0', 10),
      bomb_crazy: parseInt(localStorage.getItem('whack_mouse_hs_bomb_crazy') || '0', 10),
      crazy_weapons: parseInt(localStorage.getItem('whack_mouse_hs_crazy_weapons') || '0', 10),
      poison_mouse: parseInt(localStorage.getItem('whack_mouse_hs_poison_mouse') || '0', 10)
    };
    this.isPlaying = false;
    this.spawnTimer = null;
    this.activeSlots = new Map(); // index -> { timeout, type, gen, isHit }
    this.holeGenerations = new Array(9).fill(0);
    this.holeCleanTimeouts = new Array(9).fill(null);

    // Achievements state
    this.achievements = JSON.parse(localStorage.getItem('whack_mouse_achievements') || '{}');
    this.purchasedItems = new Set(JSON.parse(localStorage.getItem('whack_mouse_purchased_items') || '[]'));
    this.clearedModes = new Set(JSON.parse(localStorage.getItem('whack_mouse_cleared_modes') || '[]'));
    this.hasPlayedExtreme = localStorage.getItem('whack_mouse_played_extreme') === 'true';

    // Power costs
    this.powerCosts = {
      super_hammer: 150,
      rocket: 125,
      laser: 100,
      heart: 200
    };
    this.maxLives = 3;

    // DOM Elements
    this.scoreDisplay = document.getElementById('score-display');
    this.highScoreDisplay = document.getElementById('high-score-display');
    this.coinDisplay = document.getElementById('coin-display');
    this.menuCoinDisplay = document.getElementById('menu-coin-display');
    this.currentModeBadge = document.getElementById('current-mode-badge');
    this.comboBadge = document.getElementById('combo-badge');
    this.comboCount = document.getElementById('combo-count');
    this.heartsList = document.getElementById('hearts-list');
    this.gameContainer = document.getElementById('game-container');
    this.holes = document.querySelectorAll('.hole');
    this.startOverlay = document.getElementById('start-overlay');
    this.gameOverOverlay = document.getElementById('gameover-overlay');
    this.victoryOverlay = document.getElementById('victory-overlay');
    this.achievementsOverlay = document.getElementById('achievements-overlay');
    this.achievementsList = document.getElementById('achievements-list');
    this.achieveCounterBadge = document.getElementById('achieve-counter-badge');
    this.achieveTotalProgress = document.getElementById('achieve-total-progress');
    this.btnStart = document.getElementById('btn-start');
    this.btnRestart = document.getElementById('btn-restart');
    this.btnMenuHud = document.getElementById('menu-btn-hud');
    this.btnMenuGameover = document.getElementById('btn-menu-gameover');
    this.btnAchievementsHud = document.getElementById('achievements-btn-hud');
    this.btnAchievementsMenu = document.getElementById('btn-achievements-menu');
    this.btnCloseAchievements = document.getElementById('btn-close-achievements');
    this.btnVictoryReplay = document.getElementById('btn-victory-replay');
    this.btnVictoryMenu = document.getElementById('btn-victory-menu');
    this.victoryScore = document.getElementById('victory-score');
    this.victoryMiceHit = document.getElementById('victory-mice-hit');
    this.victoryCoins = document.getElementById('victory-coins');
    this.victoryLevelName = document.getElementById('victory-level-name');
    this.soundBtn = document.getElementById('sound-btn');
    this.finalScore = document.getElementById('final-score');
    this.finalMiceHit = document.getElementById('final-mice-hit');
    this.finalCoins = document.getElementById('final-coins');
    this.finalHighScore = document.getElementById('final-high-score');
    this.finalModeLabel = document.getElementById('final-mode-label');
    this.customCursor = document.getElementById('custom-cursor');
    this.gameMainTitle = document.getElementById('game-main-title');

    // Help Action Buttons
    this.btnPowerHammer = document.getElementById('btn-power-hammer');
    this.btnPowerRocket = document.getElementById('btn-power-rocket');
    this.btnPowerLaser = document.getElementById('btn-power-laser');
    this.btnPowerHeart = document.getElementById('btn-power-heart');

    // Menu High Score Elements
    this.menuHsEasy = document.getElementById('menu-hs-easy');
    this.menuHsMedium = document.getElementById('menu-hs-medium');
    this.menuHsHard = document.getElementById('menu-hs-hard');
    this.menuHsExtreme = document.getElementById('menu-hs-extreme');
    this.menuHsBombCrazy = document.getElementById('menu-hs-bomb-crazy');
    this.menuHsCrazyWeapons = document.getElementById('menu-hs-crazy-weapons');
    this.menuHsPoisonMouse = document.getElementById('menu-hs-poison-mouse');

    // Mode Tabs Elements
    this.tabBtnRegular = document.getElementById('tab-btn-regular');
    this.tabBtnEvents = document.getElementById('tab-btn-events');
    this.tabContentRegular = document.getElementById('tab-content-regular');
    this.tabContentEvents = document.getElementById('tab-content-events');

    // Extreme Mode Elements
    this.btnModeExtreme = document.getElementById('btn-mode-extreme');
    this.miniBtnModeExtreme = document.getElementById('mini-btn-mode-extreme');
    this.iconModeExtreme = document.getElementById('icon-mode-extreme');
    this.descModeExtreme = document.getElementById('desc-mode-extreme');

    // Super Power State
    this.activePower = null; // 'super_hammer' | 'rocket' | 'laser'
    this.rocketAmmo = 0; // 7 charges for rocket
    this.nextPowerScore = 250;
    this.powerTimer = null;
    this.powerInterval = null;
    this.powerupBar = document.getElementById('powerup-bar');
    this.powerupIcon = document.getElementById('powerup-icon');
    this.powerupName = document.getElementById('powerup-name');
    this.powerupTimer = document.getElementById('powerup-timer');
    this.powerupFill = document.getElementById('powerup-fill');

    // Weapons State & Shop Elements
    this.ownedWeapons = new Set(JSON.parse(localStorage.getItem('whack_mouse_owned_weapons') || '["hammer"]'));
    this.ownedWeapons.delete('electric_sword');
    this.ownedWeapons.delete('heavenly_wand');
    this.ownedWeapons.add('hammer'); // Palu selalu gratis & dimiliki
    this.equippedWeapon = localStorage.getItem('whack_mouse_equipped_weapon') || 'hammer';
    if (!this.ownedWeapons.has(this.equippedWeapon) || !WEAPONS_CONFIG[this.equippedWeapon]) {
      this.equippedWeapon = 'hammer';
      localStorage.setItem('whack_mouse_equipped_weapon', 'hammer');
    }
    this.electricShieldAvailable = false;
    this.ironPunchCharges = 0;
    this.maceRevived = false;
    this.isMaceInvincible = false;
    this.maceInvincibleTimer = null;
    this.maceInvincibleInterval = null;

    this.shopOverlay = document.getElementById('shop-overlay');
    this.shopWeaponsGrid = document.getElementById('shop-weapons-grid');
    this.shopCoinDisplay = document.getElementById('shop-coin-display');
    this.btnShopMenu = document.getElementById('btn-shop-menu');
    this.btnCloseShop = document.getElementById('btn-close-shop');
    this.equippedWeaponBadge = document.getElementById('equipped-weapon-badge');

    // Weapon Active Skill State & DOM Elements (Pedang & Magnet Mace)
    this.swordSkillCd = 15000; // 15 Detik Cooldown
    this.lastSlashTime = 0;
    this.isSlashModeActive = false;
    this.slashCdInterval = null;

    // Magnet Mace: Iron Punch Skill
    this.maceSkillCd = 15000; // 15 Detik Cooldown
    this.lastMaceSkillTime = 0;
    this.maceSkillCdInterval = null;

    this.weaponSkillBar = document.getElementById('weapon-skill-bar');
    this.btnSkillSlash = document.getElementById('btn-skill-slash');
    this.skillBtnLabel = document.getElementById('skill-btn-label');
    this.skillBtnIcon = document.getElementById('skill-btn-icon');
    this.skillCdProgress = document.getElementById('skill-cd-progress');
    this.skillTitleIcon = document.getElementById('skill-title-icon');
    this.skillTitleName = document.getElementById('skill-title-name');
    this.skillTitleDesc = document.getElementById('skill-title-desc');

    // Speed Progression (Increases every 50 score)
    this.speedLevel = 1;

    // Systems
    this.sound = new SoundController();
    this.particles = new ParticleSystem(document.getElementById('particle-canvas'));

    this.initEvents();
    this.checkExtremeUnlock(false);
    this.setMode('easy');
    this.checkAchievements(false);
    this.updateCursorWeapon();
    this.updateHUD();
  }

  initEvents() {
    // Shop Modal Actions
    if (this.btnShopMenu) {
      this.btnShopMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openShopModal();
      });
    }

    if (this.btnCloseShop) {
      this.btnCloseShop.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeShopModal();
      });
    }

    // Achievements Modal Actions
    if (this.btnAchievementsHud) {
      this.btnAchievementsHud.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openAchievementsModal();
      });
    }

    if (this.btnAchievementsMenu) {
      this.btnAchievementsMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openAchievementsModal();
      });
    }

    if (this.btnCloseAchievements) {
      this.btnCloseAchievements.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeAchievementsModal();
      });
    }

    // Mode tabs switching
    if (this.tabBtnRegular && this.tabBtnEvents) {
      this.tabBtnRegular.addEventListener('click', (e) => {
        e.stopPropagation();
        this.switchModeTab('regular');
      });
      this.tabBtnEvents.addEventListener('click', (e) => {
        e.stopPropagation();
        this.switchModeTab('events');
      });
    }

    // Custom Cursor tracking
    window.addEventListener('mousemove', (e) => {
      this.customCursor.style.display = 'block';
      this.customCursor.style.left = `${e.clientX}px`;
      this.customCursor.style.top = `${e.clientY}px`;
    });

    window.addEventListener('mousedown', (e) => {
      this.triggerHammerSwing();
    });

    // Touch support
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        this.customCursor.style.display = 'block';
        this.customCursor.style.left = `${t.clientX}px`;
        this.customCursor.style.top = `${t.clientY}px`;
      }
    });

    // Difficulty and Event mode buttons click
    document.querySelectorAll('.diff-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const mode = btn.dataset.mode;
        if (mode === 'extreme' && !this.isExtremeUnlocked()) {
          this.sound.playWhoosh();
          this.showSpeedUpPopup('🔒 Kunci! Capai skor 1000 di Mudah, Sedang, & Sulit');
          return;
        }
        if (mode && DIFFICULTY_CONFIG[mode]) {
          this.setMode(mode);
        }
      });
    });

    // Button actions
    this.btnStart.addEventListener('click', () => this.startGame());
    this.btnRestart.addEventListener('click', () => this.startGame());

    if (this.btnVictoryReplay) {
      this.btnVictoryReplay.addEventListener('click', () => this.startGame());
    }

    if (this.btnVictoryMenu) {
      this.btnVictoryMenu.addEventListener('click', () => this.returnToMenu());
    }

    if (this.btnMenuHud) {
      this.btnMenuHud.addEventListener('click', (e) => {
        e.stopPropagation();
        this.returnToMenu();
      });
    }

    if (this.btnMenuGameover) {
      this.btnMenuGameover.addEventListener('click', (e) => {
        e.stopPropagation();
        this.returnToMenu();
      });
    }

    this.soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const on = this.sound.toggle();
      this.soundBtn.textContent = on ? '🔊 Aktif' : '🔇 Mati';
      this.soundBtn.style.background = on ? '#319795' : '#718096';
    });

    // Hole clicking / tapping - attached to entire hole for 100% reliable hit detection
    this.holes.forEach((hole, idx) => {
      const onHoleHit = (e) => {
        if (e.cancelable) e.preventDefault();
        e.stopPropagation();
        const touch = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]);
        this.handleHit(idx, touch || e);
      };

      hole.addEventListener('mousedown', onHoleHit);
      hole.addEventListener('touchstart', onHoleHit, { passive: false });
    });

    // Help Power-up Action Buttons
    if (this.btnPowerHammer) {
      this.btnPowerHammer.addEventListener('click', (e) => {
        e.stopPropagation();
        this.buyPower('super_hammer');
      });
    }
    if (this.btnPowerRocket) {
      this.btnPowerRocket.addEventListener('click', (e) => {
        e.stopPropagation();
        this.buyPower('rocket');
      });
    }
    if (this.btnPowerLaser) {
      this.btnPowerLaser.addEventListener('click', (e) => {
        e.stopPropagation();
        this.buyPower('laser');
      });
    }
    if (this.btnPowerHeart) {
      this.btnPowerHeart.addEventListener('click', (e) => {
        e.stopPropagation();
        this.buyPower('heart');
      });
    }

    // Weapon Skill Button Click (Slash / Iron Punch)
    if (this.btnSkillSlash) {
      this.btnSkillSlash.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.equippedWeapon === 'sword') {
          this.activateSlashSkill();
        } else if (this.equippedWeapon === 'magnet_mace') {
          this.activateIronPunch();
        }
      });
    }

    // Keyboard shortcuts (1: Palu Kebal Bom, 2: Roket, 3: Laser, 4: Tambah Darah, Q/Spasi: Skill Senjata)
    window.addEventListener('keydown', (e) => {
      if (!this.isPlaying) return;
      if (e.key === '1') {
        this.buyPower('super_hammer');
      } else if (e.key === '2') {
        this.buyPower('rocket');
      } else if (e.key === '3') {
        this.buyPower('laser');
      } else if (e.key === '4') {
        this.buyPower('heart');
      } else if (e.key.toLowerCase() === 'q' || e.code === 'Space' || e.key === ' ') {
        if (this.equippedWeapon === 'sword') {
          e.preventDefault();
          this.activateSlashSkill();
        } else if (this.equippedWeapon === 'magnet_mace') {
          e.preventDefault();
          this.activateIronPunch();
        }
      }
    });

    // Background click (Miss or Rocket barrage trigger)
    this.gameContainer.addEventListener('mousedown', (e) => {
      if (!this.isPlaying) return;
      if (this.activePower === 'rocket') {
        this.fireRocketCharge(e.clientX, e.clientY);
      } else if (!e.target.closest('.hole')) {
        if (this.activePower === 'laser') {
          this.fireLaserBeam(e.clientX, e.clientY);
        } else {
          this.sound.playWhoosh();
          this.resetCombo();
        }
      }
    });
  }

  isExtremeUnlocked() {
    return (
      (this.highScores.easy || 0) >= 1000 &&
      (this.highScores.medium || 0) >= 1000 &&
      (this.highScores.hard || 0) >= 1000
    );
  }

  checkExtremeUnlock(notify = false) {
    const unlocked = this.isExtremeUnlocked();

    if (unlocked) {
      if (this.btnModeExtreme) {
        this.btnModeExtreme.classList.remove('locked');
      }
      if (this.miniBtnModeExtreme) {
        this.miniBtnModeExtreme.classList.remove('locked');
        this.miniBtnModeExtreme.textContent = '☠️ Extreme';
      }
      if (this.iconModeExtreme) {
        this.iconModeExtreme.textContent = '☠️';
      }
      if (this.descModeExtreme) {
        this.descModeExtreme.textContent = 'Super Cepat & 50% Bom';
      }

      // If unlocked just now and notified
      const alreadyCelebrated = localStorage.getItem('whack_mouse_extreme_unlocked');
      if (!alreadyCelebrated && notify) {
        localStorage.setItem('whack_mouse_extreme_unlocked', 'true');
        this.sound.playPowerUp();
        this.showSuperAnnouncement('👑 MODE EXTREME TERBUKA (☠️)!\nSEMUA LEVEL MENCAPAI 1000 SKOR!');
      }
    } else {
      if (this.btnModeExtreme) {
        this.btnModeExtreme.classList.add('locked');
      }
      if (this.miniBtnModeExtreme) {
        this.miniBtnModeExtreme.classList.add('locked');
        this.miniBtnModeExtreme.textContent = '🔒 Extreme';
      }
      if (this.iconModeExtreme) {
        this.iconModeExtreme.textContent = '🔒';
      }
      if (this.descModeExtreme) {
        this.descModeExtreme.textContent = 'Kunci: Semua Skor 1000';
      }
    }
  }

  switchModeTab(tabName) {
    if (tabName === 'events') {
      if (this.tabBtnEvents) this.tabBtnEvents.classList.add('active');
      if (this.tabBtnRegular) this.tabBtnRegular.classList.remove('active');
      if (this.tabContentEvents) this.tabContentEvents.classList.add('active');
      if (this.tabContentRegular) this.tabContentRegular.classList.remove('active');
    } else {
      if (this.tabBtnRegular) this.tabBtnRegular.classList.add('active');
      if (this.tabBtnEvents) this.tabBtnEvents.classList.remove('active');
      if (this.tabContentRegular) this.tabContentRegular.classList.add('active');
      if (this.tabContentEvents) this.tabContentEvents.classList.remove('active');
    }
  }

  setMode(mode) {
    this.mode = mode;
    document.querySelectorAll('.diff-btn').forEach((btn) => {
      if (btn.dataset.mode === mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (mode === 'bomb_crazy' || mode === 'crazy_weapons' || mode === 'poison_mouse') {
      this.switchModeTab('events');
    } else {
      this.switchModeTab('regular');
    }

    const cfg = DIFFICULTY_CONFIG[mode];
    if (this.currentModeBadge) {
      this.currentModeBadge.textContent = cfg.badge;
    }
    if (this.finalModeLabel) {
      this.finalModeLabel.textContent = cfg.name;
    }

    // Dynamic Title: PUKUL TIKUS, GOOD LUCK?!, BOM GILA!, SENJATA GILA!, TIKUS BERACUN!
    if (this.gameMainTitle) {
      if (mode === 'extreme') {
        this.gameMainTitle.innerHTML = '☠️ GOOD LUCK?!';
        this.gameMainTitle.className = 'game-title extreme-title';
      } else if (mode === 'bomb_crazy') {
        this.gameMainTitle.innerHTML = '💣 BOM GILA!';
        this.gameMainTitle.className = 'game-title bomb-crazy-title';
      } else if (mode === 'crazy_weapons') {
        this.gameMainTitle.innerHTML = '⚔️ SENJATA GILA!';
        this.gameMainTitle.className = 'game-title crazy-weapons-title';
      } else if (mode === 'poison_mouse') {
        this.gameMainTitle.innerHTML = '🧪 TIKUS BERACUN!';
        this.gameMainTitle.className = 'game-title poison-mouse-title';
      } else {
        this.gameMainTitle.innerHTML = '🔨 PUKUL TIKUS';
        this.gameMainTitle.className = 'game-title';
      }
    }

    this.updateHUD();
  }

  returnToMenu() {
    this.isPlaying = false;
    clearTimeout(this.spawnTimer);
    this.clearSuperPower();
    this.maceRevived = false;
    this.isMaceInvincible = false;
    clearTimeout(this.maceInvincibleTimer);
    clearInterval(this.maceInvincibleInterval);
    if (this.gameContainer) this.gameContainer.classList.remove('mace-invincible-mode');
    this.updateCursorWeapon();
    this.sound.stopBGM();

    // Clear all holes
    this.activeSlots.forEach((val) => clearTimeout(val.timeout));
    this.activeSlots.clear();

    this.holes.forEach((hole) => {
      const slot = hole.querySelector('.character-slot');
      slot.innerHTML = '';
      slot.classList.remove('up');
    });

    // Reset scores & HUD
    this.score = 0;
    this.lives = (this.mode === 'bomb_crazy') ? 4 : 3;
    this.maxLives = this.lives;
    this.combo = 0;
    this.resetSlashCooldown();
    this.updateHUD();

    // Show start overlay & hide gameover, victory, achievements & shop
    if (this.gameOverOverlay) this.gameOverOverlay.classList.remove('active');
    if (this.victoryOverlay) this.victoryOverlay.classList.remove('active');
    if (this.achievementsOverlay) this.achievementsOverlay.classList.remove('active');
    if (this.shopOverlay) this.shopOverlay.classList.remove('active');
    if (this.startOverlay) this.startOverlay.classList.add('active');
  }

  // Weapon Shop Methods
  openShopModal() {
    if (this.shopCoinDisplay) {
      this.shopCoinDisplay.textContent = this.coins;
    }
    this.renderShop();
    if (this.shopOverlay) {
      this.shopOverlay.classList.add('active');
    }
    this.sound.playWhoosh();
  }

  closeShopModal() {
    if (this.shopOverlay) {
      this.shopOverlay.classList.remove('active');
    }
  }

  buyWeapon(weaponId) {
    const cfg = WEAPONS_CONFIG[weaponId];
    if (!cfg) return;

    if (this.ownedWeapons.has(weaponId)) {
      this.equipWeapon(weaponId);
      return;
    }

    if (this.coins < cfg.price) {
      this.sound.playWhoosh();
      this.showSpeedUpPopup(`🪙 Koin kurang! Butuh ${cfg.price} koin (Punya: ${this.coins})`);
      return;
    }

    this.coins -= cfg.price;
    localStorage.setItem('whack_mouse_coins', this.coins);
    this.ownedWeapons.add(weaponId);
    localStorage.setItem('whack_mouse_owned_weapons', JSON.stringify([...this.ownedWeapons]));

    this.equippedWeapon = weaponId;
    localStorage.setItem('whack_mouse_equipped_weapon', weaponId);

    this.sound.playBuyPower();
    this.particles.createExplosion(window.innerWidth / 2, window.innerHeight / 2);
    this.showSpeedUpPopup(`🎉 Berhasil membeli ${cfg.name}! Senjata kini digunakan.`);

    this.updateHUD();
    this.updateCursorWeapon();
    this.renderShop();
  }

  equipWeapon(weaponId) {
    if (!this.ownedWeapons.has(weaponId)) return;
    const cfg = WEAPONS_CONFIG[weaponId];
    if (!cfg) return;

    this.equippedWeapon = weaponId;
    localStorage.setItem('whack_mouse_equipped_weapon', weaponId);

    this.sound.playPowerUp();
    this.showSpeedUpPopup(`⚔️ Senjata aktif: ${cfg.name}!`);

    this.updateHUD();
    this.updateCursorWeapon();
    this.renderShop();
  }

  renderShop() {
    if (!this.shopWeaponsGrid) return;
    if (this.shopCoinDisplay) this.shopCoinDisplay.textContent = this.coins;

    this.shopWeaponsGrid.innerHTML = '';

    Object.values(WEAPONS_CONFIG).forEach((weapon) => {
      const isOwned = this.ownedWeapons.has(weapon.id);
      const isEquipped = (this.equippedWeapon === weapon.id);
      const canAfford = (this.coins >= weapon.price);

      const card = document.createElement('div');
      card.className = `shop-weapon-card ${isEquipped ? 'equipped' : (isOwned ? 'owned' : '')}`;

      const perksHtml = weapon.perks.map(p => `<span class="weapon-perk-pill">${p}</span>`).join('');

      let actionBtnHtml = '';
      if (isEquipped) {
        actionBtnHtml = `<button class="btn-weapon-action btn-equipped" disabled>✅ Sedang Digunakan</button>`;
      } else if (isOwned) {
        actionBtnHtml = `<button class="btn-weapon-action btn-equip" data-equip="${weapon.id}">⚔️ Gunakan Senjata</button>`;
      } else {
        if (canAfford) {
          actionBtnHtml = `<button class="btn-weapon-action btn-buy" data-buy="${weapon.id}">🛒 Beli (🪙 ${weapon.price})</button>`;
        } else {
          actionBtnHtml = `<button class="btn-weapon-action btn-buy" data-buy="${weapon.id}" disabled>🔒 Butuh 🪙 ${weapon.price} Koin</button>`;
        }
      }

      card.innerHTML = `
        <div class="shop-weapon-top">
          <div class="shop-weapon-info-left">
            <div class="shop-weapon-icon-box">${weapon.icon}</div>
            <div class="shop-weapon-title-group">
              <h3>${weapon.name}</h3>
              <span class="shop-weapon-badge-tag">${weapon.badge}</span>
            </div>
          </div>
          <div class="shop-weapon-price-tag">
            ${weapon.price === 0 ? 'GRATIS' : `🪙 ${weapon.price} Koin`}
          </div>
        </div>
        <p class="shop-weapon-desc">${weapon.desc}</p>
        <div class="shop-weapon-perks">${perksHtml}</div>
        <div class="shop-weapon-bottom">${actionBtnHtml}</div>
      `;

      const buyBtn = card.querySelector('[data-buy]');
      if (buyBtn && canAfford) {
        buyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.buyWeapon(weapon.id);
        });
      }

      const equipBtn = card.querySelector('[data-equip]');
      if (equipBtn) {
        equipBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.equipWeapon(weapon.id);
        });
      }

      this.shopWeaponsGrid.appendChild(card);
    });
  }

  // Sword Active Skill: Slash (15s cooldown, strikes 3 petak simultaneously)
  isSlashSkillReady() {
    if (this.equippedWeapon !== 'sword') return false;
    const now = Date.now();
    return (now - this.lastSlashTime) >= this.swordSkillCd;
  }

  activateSlashSkill() {
    if (!this.isPlaying) {
      this.sound.playWhoosh();
      this.showSpeedUpPopup('🎮 Mulai permainan terlebih dahulu!');
      return;
    }

    if (this.equippedWeapon !== 'sword') return;

    const now = Date.now();
    const elapsed = now - this.lastSlashTime;

    if (elapsed < this.swordSkillCd) {
      const remainingSec = ((this.swordSkillCd - elapsed) / 1000).toFixed(1);
      this.sound.playWhoosh();
      this.showSpeedUpPopup(`⏳ Cooldown Slash: ${remainingSec}s lagi!`);
      return;
    }

    // Toggle slash targeting mode
    this.isSlashModeActive = !this.isSlashModeActive;
    if (this.isSlashModeActive) {
      this.sound.playPowerUp();
      this.showSpeedUpPopup('⚔️ SLASH SIAP! Klik petak untuk tebasan 3 petak!');
    } else {
      this.sound.playWhoosh();
    }
    this.updateCursorWeapon();
    this.updateSlashSkillUI();
  }

  executeSlashAttack(targetIndex, hitX, hitY) {
    this.isSlashModeActive = false;
    this.lastSlashTime = Date.now();
    this.startSlashCooldownTimer();

    // Identify the 3 holes in the same horizontal row (0,1,2 / 3,4,5 / 6,7,8)
    const row = Math.floor(targetIndex / 3);
    const targetHoleIndices = [row * 3, row * 3 + 1, row * 3 + 2];

    // Sound and screen shake
    this.sound.playMegaSlash();
    this.triggerScreenShake();

    // Show massive animated slash wave arc covering the 3 holes
    this.createSlashWaveOverlay(row);

    let hitsCount = 0;
    targetHoleIndices.forEach((hIdx) => {
      const targetHole = this.holes[hIdx];
      const targetSlot = targetHole.querySelector('.character-slot');
      const charEl = targetSlot.querySelector('.character');
      const rect = targetHole.getBoundingClientRect();
      const hX = rect.left + rect.width / 2;
      const hY = rect.top + rect.height / 2;

      // Sharp blade spark particles on each hole
      this.particles.createHitSparks(hX, hY, 18, ['#ffffff', '#90cdf4', '#63b3ed', '#ffd700']);

      if (this.activeSlots.has(hIdx)) {
        const info = this.activeSlots.get(hIdx);
        clearTimeout(info.timeout);
        this.activeSlots.delete(hIdx);

        if (info.type === 'mouse') {
          hitsCount++;
          this.miceHit++;
          this.combo++;
          const multiplier = Math.min(4, 1 + Math.floor(this.combo / 4));
          const points = 11 * multiplier;
          this.score += points;
          if (charEl) charEl.classList.add('hit-mouse');
          this.showFloatingPopup(targetHole, `⚔️ SLASH! +${points}`, 'score');
        } else if (info.type === 'poison_mouse') {
          // Slash dispatches poison mouse safely without taking damage!
          this.score += 15;
          if (charEl) charEl.classList.add('hit-poison');
          this.showFloatingPopup(targetHole, `⚔️ DISINFECTED! +15`, 'score');
        } else if (info.type === 'bomb') {
          // Slash slices and defuses bombs safely without taking damage!
          this.score += 15;
          if (charEl) charEl.classList.add('hit-mouse');
          this.showFloatingPopup(targetHole, `⚔️ DEFUSED! +15`, 'score');
        }

        this.clearHoleAfterHit(hIdx, 250);
      }
    });

    if (hitsCount > 1) {
      this.showSuperAnnouncement(`💥 MULTI-SLASH (${hitsCount} TIKUS)!\n+${hitsCount} COMBO!`);
    }

    this.updateHUD();
    this.updateCursorWeapon();
    this.updateSlashSkillUI();
  }

  createSlashWaveOverlay(row) {
    const rowHoles = [this.holes[row * 3], this.holes[row * 3 + 1], this.holes[row * 3 + 2]];
    const gridEl = document.getElementById('grid');
    if (!gridEl) return;

    const overlay = document.createElement('div');
    overlay.className = 'slash-wave-overlay';
    const topOffset = (row * 33.33) + 5;
    overlay.style.top = `${topOffset}%`;
    overlay.style.left = `2%`;
    overlay.style.width = `96%`;
    overlay.style.height = `30%`;

    overlay.innerHTML = `
      <svg viewBox="0 0 500 120" class="slash-svg-wave">
        <defs>
          <linearGradient id="slash-blade-glow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0" />
            <stop offset="25%" stop-color="#63b3ed" stop-opacity="0.9" />
            <stop offset="50%" stop-color="#ffffff" stop-opacity="1" />
            <stop offset="75%" stop-color="#ffd700" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path d="M10,95 Q250,-15 490,95 Q250,25 10,95 Z" fill="url(#slash-blade-glow)" filter="drop-shadow(0 0 12px #63b3ed)" />
        <path d="M40,90 Q250,5 460,90" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round" />
        <path d="M80,85 Q250,15 420,85" stroke="#ffd700" stroke-width="2.5" fill="none" stroke-linecap="round" opacity="0.9" />
      </svg>
    `;

    gridEl.appendChild(overlay);
    setTimeout(() => overlay.remove(), 450);
  }

  startSlashCooldownTimer() {
    clearInterval(this.slashCdInterval);
    this.updateSlashSkillUI();

    this.slashCdInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - this.lastSlashTime;

      if (elapsed >= this.swordSkillCd) {
        clearInterval(this.slashCdInterval);
        this.updateSlashSkillUI();
        this.updateWeaponBadge();
        if (this.isPlaying && this.equippedWeapon === 'sword') {
          this.sound.playCoin();
          this.showSpeedUpPopup('⚔️ Skill Slash Pedang SIAP Digunakan!');
        }
      } else {
        this.updateSlashSkillUI();
      }
    }, 100);
  }

  // Magnet Mace Active Skill: Iron Punch (Hancurkan 9 Petak, CD 15s / Instan saat serap bom)
  activateIronPunch() {
    if (!this.isPlaying) {
      this.sound.playWhoosh();
      this.showSpeedUpPopup('🎮 Mulai permainan terlebih dahulu!');
      return;
    }

    if (this.equippedWeapon !== 'magnet_mace') return;

    const now = Date.now();
    const elapsed = now - (this.lastMaceSkillTime || 0);
    const cd = this.maceSkillCd || 15000;

    if (elapsed < cd) {
      const remainingSec = ((cd - elapsed) / 1000).toFixed(1);
      this.sound.playWhoosh();
      this.showSpeedUpPopup(`⏳ Cooldown Iron Punch: ${remainingSec}s lagi!`);
      return;
    }

    this.triggerIronPunchSkill();
  }

  triggerIronPunchSkill() {
    if (!this.isPlaying) return;
    if (this.equippedWeapon !== 'magnet_mace') return;

    this.lastMaceSkillTime = Date.now();
    this.startMaceSkillCooldownTimer();

    // Heavy iron magnetic boom and strong shake
    this.sound.playIronPunch();
    this.triggerScreenShake();

    // Show massive animated magnetic shockwave across the entire 9-hole arena
    this.createIronPunchOverlay();

    let hitMiceCount = 0;
    let hitBombsCount = 0;
    this.holes.forEach((hole, idx) => {
      const slot = hole.querySelector('.character-slot');
      const charEl = slot.querySelector('.character');
      const rect = hole.getBoundingClientRect();
      const hX = rect.left + rect.width / 2;
      const hY = rect.top + rect.height / 2;

      this.particles.createHitSparks(hX, hY, 20, ['#e53e3e', '#9f7aea', '#805ad5', '#ffd700', '#ffffff']);

      if (this.activeSlots.has(idx)) {
        const info = this.activeSlots.get(idx);
        if (info.isHit) return;

        if (info.type === 'mouse') {
          hitMiceCount++;
          this.miceHit++;
          const points = 20; // Tikus yang terkena Iron Punch mendapat 20 poin
          this.score += points;
          if (charEl) charEl.classList.add('hit-mouse');
          this.showFloatingPopup(hole, `🧲 PUNCH! +${points}`, 'score');
        } else if (info.type === 'poison_mouse') {
          const points = 20;
          this.score += points;
          if (charEl) charEl.classList.add('hit-poison');
          this.showFloatingPopup(hole, `🧲 CRUSHED! +${points}`, 'score');
        } else if (info.type === 'bomb') {
          hitBombsCount++;
          const points = 25; // Bom yang terkena Iron Punch menjadi 25 poin
          this.score += points;
          if (charEl) charEl.classList.add('hit-mouse');
          this.showFloatingPopup(hole, `🧲 BLAST! +${points}`, 'score');
        }

        this.clearHoleAfterHit(idx, 250);
      }
    });

    this.showSuperAnnouncement(`🧲 IRON PUNCH MELEDAK!\n9 LOBANG BERHASIL DIHANCURKAN!`);
    this.updateHUD();
    this.updateWeaponBadge();
    this.updateSlashSkillUI();
  }

  startMaceSkillCooldownTimer() {
    clearInterval(this.maceSkillCdInterval);
    this.updateSlashSkillUI();

    this.maceSkillCdInterval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - (this.lastMaceSkillTime || 0);
      const cd = this.maceSkillCd || 15000;

      if (elapsed >= cd) {
        clearInterval(this.maceSkillCdInterval);
        this.updateSlashSkillUI();
        this.updateWeaponBadge();
        if (this.isPlaying && this.equippedWeapon === 'magnet_mace') {
          this.sound.playCoin();
          this.showSpeedUpPopup('🧲 Skill Iron Punch SIAP Digunakan!');
        }
      } else {
        this.updateSlashSkillUI();
      }
    }, 100);
  }

  createIronPunchOverlay() {
    const gridEl = document.getElementById('grid');
    if (!gridEl) return;
    const gridRect = gridEl.getBoundingClientRect();
    const centerX = gridRect.left + gridRect.width / 2;
    const centerY = gridRect.top + gridRect.height / 2;
    const size = Math.min(gridRect.width, gridRect.height) * 0.95;

    const overlay = document.createElement('div');
    overlay.className = 'iron-punch-overlay';
    overlay.style.left = `${centerX}px`;
    overlay.style.top = `${centerY}px`;
    overlay.style.width = `${size}px`;
    overlay.style.height = `${size}px`;

    overlay.innerHTML = `
      <svg viewBox="0 0 400 400" class="iron-punch-svg">
        <defs>
          <radialGradient id="punch-blast-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
            <stop offset="25%" stop-color="#e53e3e" stop-opacity="0.95" />
            <stop offset="55%" stop-color="#9f7aea" stop-opacity="0.85" />
            <stop offset="85%" stop-color="#3182ce" stop-opacity="0.4" />
            <stop offset="100%" stop-color="#1a202c" stop-opacity="0" />
          </radialGradient>
        </defs>
        <!-- Shockwave Circles -->
        <circle cx="200" cy="200" r="185" fill="url(#punch-blast-glow)" />
        <circle cx="200" cy="200" r="145" fill="none" stroke="#ffd700" stroke-width="8" opacity="0.9" />
        <circle cx="200" cy="200" r="85" fill="none" stroke="#ffffff" stroke-width="12" />
        <!-- Force Beams -->
        <line x1="20" y1="200" x2="380" y2="200" stroke="#ffffff" stroke-width="6" stroke-linecap="round" />
        <line x1="200" y1="20" x2="200" y2="380" stroke="#ffffff" stroke-width="6" stroke-linecap="round" />
        <!-- Central Fist Icon -->
        <text x="200" y="220" font-size="70" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" filter="drop-shadow(0 0 10px #ffd700)">🧲</text>
      </svg>
    `;

    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 450);
  }

  updateSlashSkillUI() {
    if (!this.weaponSkillBar || !this.btnSkillSlash) return;

    if ((this.equippedWeapon !== 'sword' && this.equippedWeapon !== 'magnet_mace') || !this.isPlaying) {
      this.weaponSkillBar.classList.add('hidden');
      return;
    }

    this.weaponSkillBar.classList.remove('hidden');

    if (this.equippedWeapon === 'magnet_mace') {
      if (this.skillTitleIcon) this.skillTitleIcon.textContent = '🧲';
      if (this.skillTitleName) this.skillTitleName.textContent = 'SKILL: IRON PUNCH (9 PETAK)';
      if (this.skillTitleDesc) this.skillTitleDesc.textContent = 'Hancurkan 9 petak sekaligus! (Tekan [Q] atau [Spasi])';

      const now = Date.now();
      const elapsed = now - (this.lastMaceSkillTime || 0);
      const cd = this.maceSkillCd || 15000;
      const isReady = elapsed >= cd;

      if (isReady) {
        this.btnSkillSlash.className = 'btn-skill-slash ready mace-ready';
        if (this.skillBtnIcon) this.skillBtnIcon.textContent = '🧲💥';
        if (this.skillBtnLabel) this.skillBtnLabel.textContent = 'IRON PUNCH [SIAP]';
        if (this.skillCdProgress) this.skillCdProgress.style.width = '100%';
      } else {
        const remainingSec = Math.max(0, (cd - elapsed) / 1000).toFixed(1);
        const percentage = Math.min(100, (elapsed / cd) * 100);
        this.btnSkillSlash.className = 'btn-skill-slash cooldown';
        if (this.skillBtnIcon) this.skillBtnIcon.textContent = '⏳';
        if (this.skillBtnLabel) this.skillBtnLabel.textContent = `⏳ ${remainingSec}s`;
        if (this.skillCdProgress) this.skillCdProgress.style.width = `${percentage}%`;
      }
      return;
    }

    // Sword handling
    if (this.skillTitleIcon) this.skillTitleIcon.textContent = '⚔️';
    if (this.skillTitleName) this.skillTitleName.textContent = 'SKILL: SLASH TEBASAN 3 PETAK';
    if (this.skillTitleDesc) this.skillTitleDesc.textContent = 'Tebas 3 petak sekaligus! (Tekan [Q] atau [Spasi])';
    if (this.skillBtnIcon) this.skillBtnIcon.textContent = '🗡️⚡';

    const now = Date.now();
    const elapsed = now - this.lastSlashTime;
    const isReady = elapsed >= this.swordSkillCd;

    if (isReady) {
      if (this.isSlashModeActive) {
        this.btnSkillSlash.className = 'btn-skill-slash active-targeting';
        if (this.skillBtnLabel) this.skillBtnLabel.textContent = '🎯 KLIK PETAK!';
      } else {
        this.btnSkillSlash.className = 'btn-skill-slash ready';
        if (this.skillBtnLabel) this.skillBtnLabel.textContent = 'SLASH [SIAP]';
      }
      if (this.skillCdProgress) this.skillCdProgress.style.width = '100%';
    } else {
      const remainingSec = Math.max(0, (this.swordSkillCd - elapsed) / 1000).toFixed(1);
      const percentage = Math.min(100, (elapsed / this.swordSkillCd) * 100);
      this.btnSkillSlash.className = 'btn-skill-slash cooldown';
      if (this.skillBtnLabel) this.skillBtnLabel.textContent = `⏳ ${remainingSec}s`;
      if (this.skillCdProgress) this.skillCdProgress.style.width = `${percentage}%`;
    }
  }

  resetSlashCooldown() {
    this.lastSlashTime = 0;
    this.isSlashModeActive = false;
    this.lastMaceSkillTime = 0;
    clearInterval(this.maceSkillCdInterval);
    this.ironPunchCharges = 0;
    this.maceRevived = false;
    this.isMaceInvincible = false;
    clearTimeout(this.maceInvincibleTimer);
    clearInterval(this.maceInvincibleInterval);
    if (this.gameContainer) this.gameContainer.classList.remove('mace-invincible-mode');

    clearInterval(this.slashCdInterval);
    this.updateSlashSkillUI();
  }

  // Magnet Mace On-Death Undying Skill: Massive Supernova Blast + Revives with 1 ❤️ + 8s God-Mode Invincibility
  triggerMaceRevival() {
    this.maceRevived = true;
    this.lives = 1;
    this.isMaceInvincible = true;

    // Heavy sound combination: Iron Punch + Explosion
    this.sound.playIronPunch();
    this.sound.playExplosion();
    this.triggerScreenShake();

    // Show massive Supernova Revival Blast Overlay
    this.createSupernovaRevivalOverlay();

    // Obliterate all 9 holes with explosive sparks & grant bonus points (Tikus +20, Bom +25)
    this.holes.forEach((hole, idx) => {
      const slot = hole.querySelector('.character-slot');
      const charEl = slot.querySelector('.character');
      const rect = hole.getBoundingClientRect();
      const hX = rect.left + rect.width / 2;
      const hY = rect.top + rect.height / 2;

      this.particles.createExplosion(hX, hY);
      this.particles.createHitSparks(hX, hY, 22, ['#ffd700', '#9f7aea', '#ffffff', '#e53e3e']);

      if (this.activeSlots.has(idx)) {
        const info = this.activeSlots.get(idx);
        clearTimeout(info.timeout);
        this.activeSlots.delete(idx);

        if (info.type === 'mouse') {
          this.miceHit++;
          this.score += 20;
          this.showFloatingPopup(hole, '🧲 PUNCH! +20', 'score');
        } else {
          this.score += 25;
          this.showFloatingPopup(hole, '🧲 BLAST! +25', 'score');
        }

        if (charEl) charEl.classList.add('hit-mouse');
        setTimeout(() => {
          slot.classList.remove('up');
          setTimeout(() => { slot.innerHTML = ''; }, 200);
        }, 250);
      }
    });

    this.showSuperAnnouncement('👑 MAGNET MACE REVIVAL!\n💥 LEDAKAN RAKSASA & KEBAL 8 DETIK!');
    this.showSpeedUpPopup('🛡️ BANGKIT KEMBALI! KEBAL APAPUN 8 DETIK!');
    this.startMaceInvincibility(8000);
    this.updateHUD();
  }

  createSupernovaRevivalOverlay() {
    const gridEl = document.getElementById('grid');
    if (!gridEl) return;
    const gridRect = gridEl.getBoundingClientRect();
    const centerX = gridRect.left + gridRect.width / 2;
    const centerY = gridRect.top + gridRect.height / 2;
    const size = Math.min(gridRect.width, gridRect.height) * 1.15;

    const overlay = document.createElement('div');
    overlay.className = 'supernova-revival-overlay';
    overlay.style.left = `${centerX}px`;
    overlay.style.top = `${centerY}px`;
    overlay.style.width = `${size}px`;
    overlay.style.height = `${size}px`;

    overlay.innerHTML = `
      <svg viewBox="0 0 400 400" class="supernova-svg">
        <defs>
          <radialGradient id="supernova-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
            <stop offset="20%" stop-color="#ffd700" stop-opacity="0.95" />
            <stop offset="50%" stop-color="#e53e3e" stop-opacity="0.85" />
            <stop offset="75%" stop-color="#9f7aea" stop-opacity="0.6" />
            <stop offset="100%" stop-color="#1a202c" stop-opacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="190" fill="url(#supernova-glow)" />
        <circle cx="200" cy="200" r="150" fill="none" stroke="#ffffff" stroke-width="14" opacity="0.9" />
        <circle cx="200" cy="200" r="100" fill="none" stroke="#ffd700" stroke-width="16" />
        <line x1="0" y1="200" x2="400" y2="200" stroke="#ffffff" stroke-width="8" stroke-linecap="round" />
        <line x1="200" y1="0" x2="200" y2="400" stroke="#ffffff" stroke-width="8" stroke-linecap="round" />
        <line x1="60" y1="60" x2="340" y2="340" stroke="#ffd700" stroke-width="6" stroke-linecap="round" />
        <line x1="340" y1="60" x2="60" y2="340" stroke="#ffd700" stroke-width="6" stroke-linecap="round" />
        <text x="200" y="225" font-size="75" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" filter="drop-shadow(0 0 16px #ffd700)">👑</text>
      </svg>
    `;

    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 600);
  }

  startMaceInvincibility(durationMs = 8000) {
    this.isMaceInvincible = true;
    if (this.gameContainer) this.gameContainer.classList.add('mace-invincible-mode');

    clearTimeout(this.maceInvincibleTimer);
    clearInterval(this.maceInvincibleInterval);

    const startTime = Date.now();
    const endTime = startTime + durationMs;

    if (this.powerupBar) {
      this.powerupBar.classList.remove('hidden');
      if (this.powerupIcon) this.powerupIcon.textContent = '👑🛡️';
      if (this.powerupName) this.powerupName.textContent = 'KEBAL TOTAL (MAGNET MACE)';
      if (this.powerupTimer) this.powerupTimer.textContent = '8.0s';
      if (this.powerupFill) this.powerupFill.style.width = '100%';
    }

    this.maceInvincibleInterval = setInterval(() => {
      if (!this.isPlaying) {
        clearInterval(this.maceInvincibleInterval);
        return;
      }
      const remaining = Math.max(0, endTime - Date.now());
      const sec = (remaining / 1000).toFixed(1);
      if (this.powerupTimer) this.powerupTimer.textContent = `${sec}s`;
      if (this.powerupFill) this.powerupFill.style.width = `${(remaining / durationMs) * 100}%`;

      if (remaining <= 0) {
        clearInterval(this.maceInvincibleInterval);
        this.isMaceInvincible = false;
        if (this.gameContainer) this.gameContainer.classList.remove('mace-invincible-mode');
        if (this.powerupBar && !this.activePower) {
          this.powerupBar.classList.add('hidden');
        }
        this.sound.playWhoosh();
        this.showSpeedUpPopup('⚠️ Perlindungan Kebal 8 Detik Telah Berakhir!');
      }
    }, 100);
  }

  updateCursorWeapon() {
    if (!this.customCursor) return;
    const inner = document.getElementById('cursor-weapon-inner') || this.customCursor.querySelector('.hammer-inner');

    if (this.activePower === 'super_hammer') {
      this.customCursor.className = 'custom-cursor super-hammer';
      if (inner) inner.innerHTML = HAMMER_CURSOR_SVG;
    } else if (this.equippedWeapon === 'knife') {
      this.customCursor.className = 'custom-cursor knife-cursor';
      if (inner) inner.innerHTML = KNIFE_CURSOR_SVG;
    } else if (this.equippedWeapon === 'sword') {
      this.customCursor.className = `custom-cursor sword-cursor ${this.isSlashModeActive ? 'slash-mode-ready' : ''}`;
      if (inner) inner.innerHTML = SWORD_CURSOR_SVG;
    } else if (this.equippedWeapon === 'magnet_mace') {
      this.customCursor.className = 'custom-cursor mace-cursor';
      if (inner) inner.innerHTML = MAGNET_MACE_CURSOR_SVG;
    } else if (this.equippedWeapon === 'electric_hammer') {
      this.customCursor.className = 'custom-cursor electric-cursor';
      if (inner) inner.innerHTML = ELECTRIC_HAMMER_CURSOR_SVG;
    } else if (this.equippedWeapon === 'hyper_teaser') {
      const isImmune = (this.combo * 5 >= 25);
      this.customCursor.className = `custom-cursor teaser-cursor ${isImmune ? 'immune-active' : ''}`;
      if (inner) inner.innerHTML = HYPER_TEASER_CURSOR_SVG;
    } else {
      this.customCursor.className = 'custom-cursor hammer-cursor';
      if (inner) inner.innerHTML = HAMMER_CURSOR_SVG;
    }
  }

  updateWeaponBadge() {
    if (!this.equippedWeaponBadge) return;
    const cfg = WEAPONS_CONFIG[this.equippedWeapon] || WEAPONS_CONFIG.hammer;

    if (this.equippedWeapon === 'hyper_teaser') {
      const stackPts = this.combo > 0 ? (this.combo * 5) : 5;
      const isImmune = (this.combo * 5 >= 25);
      if (isImmune) {
        this.equippedWeaponBadge.className = 'weapon-badge teaser immune';
        this.equippedWeaponBadge.innerHTML = `${cfg.icon} ${cfg.shortName} <span class="shield-tag ready">🛡️ KEBAL TOTAL (+${this.combo * 5} Pts)</span>`;
      } else {
        const chargingTag = this.combo > 0 ? `<span class="shield-tag teaser-charging">⚡ +${stackPts} Poin (Stack: ${stackPts}/25)</span>` : `<span class="shield-tag teaser-idle">⚡ +5 Poin (+5/Combo)</span>`;
        this.equippedWeaponBadge.className = 'weapon-badge teaser';
        this.equippedWeaponBadge.innerHTML = `${cfg.icon} ${cfg.shortName} ${chargingTag}`;
      }
    } else if (this.equippedWeapon === 'electric_hammer') {
      const shieldText = this.electricShieldAvailable ? '<span class="shield-tag ready">🛡️ 1x Kebal Bom [SIAP]</span>' : '<span class="shield-tag used">🛡️ 1x Kebal Bom [TERPAKAI]</span>';
      this.equippedWeaponBadge.className = 'weapon-badge electric';
      this.equippedWeaponBadge.innerHTML = `${cfg.icon} ${cfg.shortName} <span class="shield-tag ready">+13 Poin (No Combo)</span> ${shieldText}`;
    } else if (this.equippedWeapon === 'knife') {
      this.equippedWeaponBadge.className = 'weapon-badge knife';
      this.equippedWeaponBadge.innerHTML = `${cfg.icon} ${cfg.shortName} <span class="shield-tag ready">+13 Poin (No Combo)</span>`;
    } else if (this.equippedWeapon === 'sword') {
      const isReady = (Date.now() - this.lastSlashTime) >= this.swordSkillCd;
      const slashTag = isReady ? '<span class="shield-tag ready">⚔️ Slash [SIAP]</span>' : '<span class="shield-tag used">⏳ Slash [CD]</span>';
      this.equippedWeaponBadge.className = 'weapon-badge sword';
      this.equippedWeaponBadge.innerHTML = `${cfg.icon} ${cfg.shortName} <span class="shield-tag ready">+11 Poin (Combo Multiplier)</span> ${slashTag}`;
    } else if (this.equippedWeapon === 'magnet_mace') {
      const cd = this.maceSkillCd || 15000;
      const isReady = (Date.now() - (this.lastMaceSkillTime || 0)) >= cd;
      const punchTag = isReady ? '<span class="shield-tag ready">🧲 Iron Punch [SIAP]</span>' : '<span class="shield-tag used">⏳ Iron Punch [CD]</span>';
      this.equippedWeaponBadge.className = 'weapon-badge mace';
      this.equippedWeaponBadge.innerHTML = `${cfg.icon} ${cfg.shortName} <span class="shield-tag ready">+13 Poin (No Combo)</span> ${punchTag}`;
    } else {
      this.equippedWeaponBadge.className = 'weapon-badge';
      this.equippedWeaponBadge.innerHTML = `${cfg.icon} ${cfg.shortName}`;
    }
  }

  triggerHammerSwing() {
    this.customCursor.classList.remove('swing');
    void this.customCursor.offsetWidth; // trigger reflow
    this.customCursor.classList.add('swing');
  }

  startGame() {
    this.score = 0;
    this.lives = (this.mode === 'bomb_crazy') ? 4 : 3;
    this.maxLives = this.lives;
    this.miceHit = 0;
    this.combo = 0;
    this.speedLevel = 1;
    this.lastCoinMilestone = 0;
    this.lastFreeWeaponMilestone = 0;
    this.milestone1000Done = false;
    this.powerIntervalStep = (this.mode === 'extreme' || this.mode === 'crazy_weapons') ? 150 : 250;
    this.nextPowerScore = this.powerIntervalStep;
    this.electricShieldAvailable = (this.equippedWeapon === 'electric_hammer');
    this.ironPunchCharges = 0; // Mulai dengan 0, terima ledakan bom untuk isi +2x
    this.maceRevived = false;
    this.isMaceInvincible = false;
    clearTimeout(this.maceInvincibleTimer);
    clearInterval(this.maceInvincibleInterval);
    if (this.gameContainer) this.gameContainer.classList.remove('mace-invincible-mode');
    this.clearSuperPower();
    this.resetSlashCooldown();
    this.updateCursorWeapon();
    this.isPlaying = true;
    this.activeSlots.clear();
    this.holeCleanTimeouts.forEach((t) => clearTimeout(t));
    this.holeCleanTimeouts.fill(null);
    this.holeGenerations = this.holeGenerations.map(g => g + 1);

    if (this.mode === 'extreme') {
      this.hasPlayedExtreme = true;
      localStorage.setItem('whack_mouse_played_extreme', 'true');
    }

    // Clear any slot DOM
    this.holes.forEach((hole) => {
      const slot = hole.querySelector('.character-slot');
      slot.innerHTML = '';
      slot.classList.remove('up');
    });

    if (this.startOverlay) this.startOverlay.classList.remove('active');
    if (this.gameOverOverlay) this.gameOverOverlay.classList.remove('active');
    if (this.victoryOverlay) this.victoryOverlay.classList.remove('active');
    if (this.achievementsOverlay) this.achievementsOverlay.classList.remove('active');
    if (this.shopOverlay) this.shopOverlay.classList.remove('active');

    this.checkAchievements(true);
    this.updateHUD();
    this.sound.playStart();
    this.sound.playBGM();
    this.scheduleNextSpawn();
  }

  // Buy and activate help power-up using coins
  buyPower(powerKey) {
    if (!this.isPlaying) {
      this.sound.playWhoosh();
      this.showSpeedUpPopup('🎮 Mulai permainan terlebih dahulu!');
      return;
    }

    const cost = this.powerCosts[powerKey] || 20;
    if (this.coins < cost) {
      this.sound.playWhoosh();
      this.showSpeedUpPopup(`🪙 Koin kurang! Butuh ${cost} koin (Punya: ${this.coins})`);
      return;
    }

    // Deduct coins & persist
    this.coins -= cost;
    localStorage.setItem('whack_mouse_coins', this.coins);

    // Track for Collector Achievement
    this.purchasedItems.add(powerKey);
    localStorage.setItem('whack_mouse_purchased_items', JSON.stringify([...this.purchasedItems]));
    this.checkAchievements(true);

    if (powerKey === 'heart') {
      this.lives += 1;
      if (this.lives > (this.maxLives || 3)) {
        this.maxLives = this.lives;
      }
      this.sound.playPowerUp();
      this.showSuperAnnouncement(`❤️ +1 DARAH BERTAMBAH!\n(TOTAL DARAH: ${this.lives} ❤️)`);
      this.updateHUD();
      return;
    }

    this.sound.playBuyPower();
    this.triggerSuperPower(powerKey);
    this.updateHUD();
  }

  // Activate Super Power (From store purchase, score milestone, or random bonus)
  triggerSuperPower(specificPower = null, customDurationOrAmmo = null, customTitle = null) {
    if (!this.isPlaying) return;

    const powers = ['super_hammer', 'rocket', 'laser'];
    const chosenPower = specificPower || powers[Math.floor(Math.random() * powers.length)];
    this.activePower = chosenPower;

    const defaultRocketAmmo = (typeof customDurationOrAmmo === 'number' && chosenPower === 'rocket') ? customDurationOrAmmo : 7;

    const powerDetails = {
      super_hammer: {
        icon: '⚡',
        name: customTitle || 'PALU SUPER (KEBAL BOM 10 DETIK)!',
        announcement: customTitle ? customTitle : '⚡ PALU SUPER AKTIF!\n(KEBAL BOM 10 DETIK)',
        duration: customDurationOrAmmo || 10000,
        isChargeBased: false
      },
      rocket: {
        icon: '🚀',
        name: `SERANGAN ROKET (SISA: ${defaultRocketAmmo}x TEMBAKAN)!`,
        announcement: customTitle ? customTitle : `🚀 SENJATA ROKET AKTIF!\n(${defaultRocketAmmo}x TEMBAKAN BEBAS TANPA BATAS WAKTU)`,
        duration: null,
        isChargeBased: true
      },
      laser: {
        icon: '🔫',
        name: 'SENJATA LASER (KEBAL BOM 8 DETIK)!',
        announcement: '🔫 SENJATA LASER AKTIF!\n(KEBAL BOM 8 DETIK)',
        duration: customDurationOrAmmo || 8000, // 8 seconds for laser gun
        isChargeBased: false
      }
    };

    const details = powerDetails[chosenPower];

    // Sound & Announcement
    this.sound.playPowerUp();
    this.showSuperAnnouncement(details.announcement);

    // Update Banner UI
    if (this.powerupBar) {
      this.powerupBar.className = `powerup-bar active mode-${chosenPower}`;
      this.powerupIcon.textContent = details.icon;
      this.powerupName.textContent = details.name;
    }

    // Cursor Styling
    if (chosenPower === 'super_hammer') {
      this.customCursor.className = 'custom-cursor super-hammer';
      const inner = document.getElementById('cursor-weapon-inner') || this.customCursor.querySelector('.hammer-inner');
      if (inner) inner.innerHTML = HAMMER_CURSOR_SVG;
    } else {
      this.updateCursorWeapon();
    }

    clearInterval(this.powerInterval);
    clearTimeout(this.powerTimer);

    // If ROCKET: charges without time limit
    if (details.isChargeBased) {
      this.rocketMaxAmmo = defaultRocketAmmo;
      this.rocketAmmo = defaultRocketAmmo;
      if (this.powerupTimer) this.powerupTimer.textContent = `${this.rocketAmmo} / ${this.rocketMaxAmmo}`;
      if (this.powerupFill) this.powerupFill.style.width = '100%';
      return;
    }

    // Time-based power countdown (Super Hammer 10s or Laser 8s)
    this.rocketAmmo = 0;
    const totalDuration = details.duration;
    const startTime = Date.now();

    this.powerInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, totalDuration - elapsed);
      const secondsLeft = (remaining / 1000).toFixed(1);
      const percentage = (remaining / totalDuration) * 100;

      if (this.powerupTimer) this.powerupTimer.textContent = `${secondsLeft}s`;
      if (this.powerupFill) this.powerupFill.style.width = `${percentage}%`;

      if (remaining <= 0) {
        this.clearSuperPower();
      }
    }, 100);

    this.powerTimer = setTimeout(() => {
      this.clearSuperPower();
    }, totalDuration);
  }

  // Fire 1 of the rocket charges
  fireRocketCharge(targetX, targetY) {
    if (this.rocketAmmo <= 0) {
      this.clearSuperPower();
      return;
    }

    this.fireRocketBarrage(targetX, targetY);
    this.rocketAmmo--;

    const maxAmmo = this.rocketMaxAmmo || 7;
    if (this.powerupTimer) this.powerupTimer.textContent = `${this.rocketAmmo} / ${maxAmmo}`;
    if (this.powerupName) this.powerupName.textContent = `SERANGAN ROKET (SISA: ${this.rocketAmmo}x TEMBAKAN)!`;
    if (this.powerupFill) this.powerupFill.style.width = `${(this.rocketAmmo / maxAmmo) * 100}%`;

    if (this.rocketAmmo <= 0) {
      setTimeout(() => {
        this.clearSuperPower();
      }, 350);
    }
  }

  clearSuperPower() {
    this.activePower = null;
    this.rocketAmmo = 0;
    clearInterval(this.powerInterval);
    clearTimeout(this.powerTimer);

    if (this.powerupBar) {
      this.powerupBar.className = 'powerup-bar';
    }
    this.updateCursorWeapon();
  }

  showSuperAnnouncement(text) {
    const el = document.createElement('div');
    el.className = 'super-announcement';
    el.innerText = text;
    document.body.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, 1800);
  }

  showSpeedUpPopup(text) {
    this.sound.playWhoosh();
    const el = document.createElement('div');
    el.className = 'speedup-popup';
    el.innerText = text;
    document.body.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, 1200);
  }

  // Special 1000-Score Event: All 9 holes pop up bombs simultaneously!
  spawnAllBombsEvent() {
    this.triggerScreenShake();

    // Clear previous timeouts on active slots
    this.activeSlots.forEach((info) => clearTimeout(info.timeout));
    this.activeSlots.clear();

    // Spawn bombs on all 9 holes
    this.holes.forEach((hole, idx) => {
      const slot = hole.querySelector('.character-slot');
      slot.innerHTML = `
        <div class="character bomb">
          ${BOMB_SVG}
        </div>
      `;

      requestAnimationFrame(() => {
        slot.classList.add('up');
      });

      // Long stay time so player can smash all 9 bombs with the 25s Super Hammer
      const timeoutId = setTimeout(() => {
        this.hideCharacter(idx);
      }, 18000);

      this.activeSlots.set(idx, { timeout: timeoutId, type: 'bomb' });
    });
  }

  // Rocket Strike that wipes all active holes
  fireRocketBarrage(targetX, targetY) {
    this.sound.playRocket();
    this.triggerScreenShake();

    if (targetX && targetY) {
      this.particles.createExplosion(targetX, targetY);
    }

    // Clear all currently visible slots
    let hitAny = false;
    this.holes.forEach((hole, idx) => {
      if (this.activeSlots.has(idx)) {
        hitAny = true;
        const info = this.activeSlots.get(idx);
        const slot = hole.querySelector('.character-slot');
        const rect = hole.getBoundingClientRect();
        const hX = rect.left + rect.width / 2;
        const hY = rect.top + rect.height / 2;

        this.particles.createExplosion(hX, hY);

        if (info.type === 'mouse') {
          this.miceHit++;
          this.combo++;
          const points = 15;
          this.score += points;
          this.showFloatingPopup(hole, `🚀 +${points}`, 'score');
        } else if (info.type === 'poison_mouse') {
          this.showFloatingPopup(hole, `🚀 RACUN MUSNAH!`, 'score');
        } else {
          this.showFloatingPopup(hole, `🚀 BOM MUSNAH!`, 'score');
        }

        clearTimeout(info.timeout);
        this.activeSlots.delete(idx);
        slot.classList.remove('up');
        setTimeout(() => { slot.innerHTML = ''; }, 200);
      }
    });

    if (!hitAny) {
      // General explosion effect on grid
      this.particles.createExplosion(window.innerWidth / 2, window.innerHeight / 2);
    }

    this.updateHUD();
  }

  // Laser Beam Effect
  fireLaserBeam(targetX, targetY) {
    this.sound.playLaser();

    // Create laser beam visual
    const beam = document.createElement('div');
    beam.className = 'laser-beam';

    const startX = window.innerWidth / 2;
    const startY = window.innerHeight;
    const deltaX = targetX - startX;
    const deltaY = targetY - startY;
    const distance = Math.hypot(deltaX, deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    beam.style.width = `${distance}px`;
    beam.style.left = `${startX}px`;
    beam.style.top = `${startY}px`;
    beam.style.transform = `rotate(${angle}deg)`;

    document.body.appendChild(beam);
    setTimeout(() => beam.remove(), 220);
  }

  // Laser Chain Arc (Menyambar ke petak di sebelah kanan dan kiri)
  fireLaserChain(fromX, fromY, toX, toY) {
    const beam = document.createElement('div');
    beam.className = 'laser-chain-beam';

    const deltaX = toX - fromX;
    const deltaY = toY - fromY;
    const distance = Math.hypot(deltaX, deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

    beam.style.width = `${distance}px`;
    beam.style.left = `${fromX}px`;
    beam.style.top = `${fromY}px`;
    beam.style.transform = `rotate(${angle}deg)`;

    document.body.appendChild(beam);
    setTimeout(() => beam.remove(), 250);
  }

  scheduleNextSpawn() {
    if (!this.isPlaying) return;

    const cfg = DIFFICULTY_CONFIG[this.mode];
    // Speed increases every 50 score
    const speedTier = Math.floor(this.score / 50);
    const speedReduction = Math.min(cfg.spawnMin * 0.45, speedTier * 55);
    const minTime = Math.max(260, cfg.spawnMin - speedReduction);
    const maxTime = Math.max(minTime + 80, cfg.spawnMax - speedReduction);
    const interval = Math.floor(Math.random() * (maxTime - minTime)) + minTime;

    this.spawnTimer = setTimeout(() => {
      this.spawnCharacter();
      this.scheduleNextSpawn();
    }, interval);
  }

  spawnCharacter() {
    if (!this.isPlaying) return;

    const available = [];
    this.holes.forEach((_, idx) => {
      if (!this.activeSlots.has(idx)) {
        available.push(idx);
      }
    });

    if (available.length === 0) return;

    const cfg = DIFFICULTY_CONFIG[this.mode];
    const baseDoubleRate = (cfg && typeof cfg.doubleSpawnRate === 'number') ? cfg.doubleSpawnRate : 0.35;

    // Bonus +10% kemungkinan muncul 2 tikus/lubang saat power-up Roket atau Laser aktif
    const isSpecialWeaponActive = (this.activePower === 'rocket' || this.activePower === 'laser');
    const powerBonus = isSpecialWeaponActive ? 0.10 : 0.0;
    const doubleRate = Math.min(0.95, baseDoubleRate + powerBonus);

    const isDoubleSpawn = available.length >= 2 && Math.random() < doubleRate;
    const countToSpawn = isDoubleSpawn ? 2 : 1;

    let hasSpawnedMouse = false;

    for (let i = 0; i < countToSpawn; i++) {
      if (available.length === 0) break;
      const randIdx = Math.floor(Math.random() * available.length);
      const chosenIndex = available.splice(randIdx, 1)[0];

      let forceType = null;
      if (this.mode === 'bomb_crazy') {
        // Mode Bom Gila: Bom bisa muncul di 2 petak sekaligus. Tikus hanya boleh maksimal 1 petak per gelombang.
        if (hasSpawnedMouse) {
          forceType = 'bomb';
        }
      } else if (isDoubleSpawn) {
        if (isSpecialWeaponActive) {
          // Dominan memunculkan tikus saat roket/laser aktif
          forceType = (Math.random() < 0.85) ? 'mouse' : null;
        } else if (i === countToSpawn - 1 && !hasSpawnedMouse) {
          forceType = 'mouse';
        }
      }

      const spawnedType = this.spawnAtHole(chosenIndex, forceType);
      if (spawnedType === 'mouse') {
        hasSpawnedMouse = true;
      }
    }
  }

  spawnAtHole(chosenIndex, forcedType = null) {
    const hole = this.holes[chosenIndex];
    const slot = hole.querySelector('.character-slot');
    const cfg = DIFFICULTY_CONFIG[this.mode];

    // Clear any previous timeout and increment generation
    if (this.activeSlots.has(chosenIndex)) {
      const oldInfo = this.activeSlots.get(chosenIndex);
      clearTimeout(oldInfo.timeout);
    }
    if (this.holeCleanTimeouts[chosenIndex]) {
      clearTimeout(this.holeCleanTimeouts[chosenIndex]);
      this.holeCleanTimeouts[chosenIndex] = null;
    }
    const gen = ++this.holeGenerations[chosenIndex];

    let type;
    if (forcedType) {
      type = forcedType;
    } else {
      const isBomb = Math.random() < cfg.bombRate;
      if (isBomb) {
        type = 'bomb';
      } else if (this.mode === 'poison_mouse' && Math.random() < (cfg.poisonRate || 0.40)) {
        type = 'poison_mouse';
      } else {
        type = 'mouse';
      }
    }

    let svgContent = MOUSE_SVG;
    if (type === 'bomb') svgContent = BOMB_SVG;
    else if (type === 'poison_mouse') svgContent = POISON_MOUSE_SVG;

    slot.classList.remove('up');
    slot.innerHTML = `
      <div class="character ${type}">
        ${svgContent}
      </div>
    `;

    // Force reflow so rising transition triggers cleanly
    void slot.offsetWidth;
    slot.classList.add('up');

    // Duration characters stay up scales with every 50 score
    const speedTier = Math.floor(this.score / 50);
    const upReduction = Math.min(cfg.upTimeMin * 0.35, speedTier * 30);
    const minUp = Math.max(550, cfg.upTimeMin - upReduction);
    const maxUp = Math.max(minUp + 150, cfg.upTimeMax - upReduction);
    const upTime = Math.floor(Math.random() * (maxUp - minUp)) + minUp;

    const timeoutId = setTimeout(() => {
      this.hideCharacter(chosenIndex, gen);
    }, upTime);

    this.activeSlots.set(chosenIndex, { timeout: timeoutId, type, gen, isHit: false });
    return type;
  }

  hideCharacter(index, gen = null) {
    if (!this.activeSlots.has(index)) return;
    const info = this.activeSlots.get(index);
    if (gen !== null && info.gen !== gen) return;
    if (info.isHit) return;
    clearTimeout(info.timeout);

    // Jika tikus kabur / lari kembali ke lubang tanpa sempat dipukul
    if (info.type === 'mouse' && !info.isHit && this.isPlaying) {
      if (this.combo > 0) {
        this.resetCombo();
        if (this.equippedWeapon === 'hyper_teaser') {
          this.sound.playWhoosh();
          this.showFloatingPopup(this.holes[index], '💨 Tikus Lari! Stack Reset', 'damage');
        }
      }
    }

    info.isHit = true;
    const currentGen = info.gen;
    const hole = this.holes[index];
    const slot = hole.querySelector('.character-slot');
    slot.classList.remove('up');

    if (this.holeCleanTimeouts[index]) {
      clearTimeout(this.holeCleanTimeouts[index]);
    }

    this.holeCleanTimeouts[index] = setTimeout(() => {
      if (this.holeGenerations[index] === currentGen) {
        this.activeSlots.delete(index);
        slot.innerHTML = '';
      }
    }, 200);
  }

  clearHoleAfterHit(index, delayMs = 250) {
    if (!this.activeSlots.has(index)) return;
    const info = this.activeSlots.get(index);
    info.isHit = true;
    clearTimeout(info.timeout);

    const hole = this.holes[index];
    const slot = hole.querySelector('.character-slot');
    const gen = info.gen || this.holeGenerations[index];

    if (this.holeCleanTimeouts[index]) {
      clearTimeout(this.holeCleanTimeouts[index]);
    }

    this.holeCleanTimeouts[index] = setTimeout(() => {
      if (this.holeGenerations[index] === gen) {
        slot.classList.remove('up');
        this.holeCleanTimeouts[index] = setTimeout(() => {
          if (this.holeGenerations[index] === gen) {
            this.activeSlots.delete(index);
            slot.innerHTML = '';
          }
        }, 180);
      }
    }, delayMs);
  }

  handleHit(index, event) {
    this.triggerHammerSwing();
    if (!this.isPlaying) return;

    const hole = this.holes[index];
    const slot = hole.querySelector('.character-slot');
    const charEl = slot.querySelector('.character');
    const rect = hole.getBoundingClientRect();
    const hitX = (event && typeof event.clientX === 'number') ? event.clientX : (rect.left + rect.width / 2);
    const hitY = (event && typeof event.clientY === 'number') ? event.clientY : (rect.top + rect.height / 2);

    // Rocket Super Power (5 charges)
    if (this.activePower === 'rocket') {
      this.fireRocketCharge(hitX, hitY);
      return;
    }

    // Sword Skill Active (Slash 3 Petak Sekaligus)
    if (this.isSlashModeActive && this.equippedWeapon === 'sword') {
      this.executeSlashAttack(index, hitX, hitY);
      return;
    }

    // Laser Super Power (Hits target & chains/sambars to 2 petak on left and right)
    if (this.activePower === 'laser') {
      this.fireLaserBeam(hitX, hitY);

      // Determine target row and chain to petak on left and right
      const row = Math.floor(index / 3);
      const col = index % 3;
      const targetIndices = new Set([index]);

      // 2 petak to the left and 2 petak to the right in the row
      for (let offset = 1; offset <= 2; offset++) {
        if (col - offset >= 0) targetIndices.add(index - offset);
        if (col + offset < 3) targetIndices.add(index + offset);
      }

      // Chain across all petak in the same row
      for (let c = 0; c < 3; c++) {
        targetIndices.add(row * 3 + c);
      }

      targetIndices.forEach((hIdx) => {
        const targetHole = this.holes[hIdx];
        const targetSlot = targetHole.querySelector('.character-slot');
        const targetRect = targetHole.getBoundingClientRect();
        const tX = targetRect.left + targetRect.width / 2;
        const tY = targetRect.top + targetRect.height / 2;

        // Visual electric chain arc from target to side petak
        if (hIdx !== index) {
          this.fireLaserChain(hitX, hitY, tX, tY);
        }

        // Electric spark particles
        this.particles.createHitSparks(tX, tY, 14, ['#63b3ed', '#90cdf4', '#ffffff']);

        // Check if there is an active character in this petak
        if (this.activeSlots.has(hIdx)) {
          const info = this.activeSlots.get(hIdx);
          if (info.isHit) return;

          if (info.type === 'mouse') {
            this.miceHit++;
            this.combo++;
            const points = 20;
            this.score += points;
            this.showFloatingPopup(targetHole, `🔫 +${points}`, 'score');
          } else if (info.type === 'poison_mouse') {
            // Laser vaporizes poison mouse without hurt!
            this.score += 15;
            this.showFloatingPopup(targetHole, `🔫 VAPORIZED! +15`, 'score');
          } else {
            // Laser vaporizes bomb without hurt!
            this.score += 15;
            this.showFloatingPopup(targetHole, `🔫 DEFUSED! +15`, 'score');
          }

          this.clearHoleAfterHit(hIdx, 200);
        }
      });

      this.updateHUD();
      return;
    }

    // Miss check
    if (!this.activeSlots.has(index)) {
      this.sound.playWhoosh();
      if (this.equippedWeapon !== 'hyper_teaser') {
        this.resetCombo();
      }
      return;
    }

    const info = this.activeSlots.get(index);
    if (info.isHit) return; // Prevent double hitting dying target
    clearTimeout(info.timeout);

    if (info.type === 'mouse') {
      // Hit mouse!
      this.miceHit++;

      let points = 10;
      if (this.activePower === 'super_hammer') {
        this.combo++;
        const multiplier = Math.min(4, 1 + Math.floor(this.combo / 4));
        points = 15 * multiplier;
        this.score += points;
        if (charEl) charEl.classList.add('hit-mouse');
        this.sound.playSuperHit();
        this.particles.createHitSparks(hitX, hitY, 20, ['#ecc94b', '#f6e05e', '#ffffff']);
        this.showFloatingPopup(hole, `⚡ +${points}`, 'score');
      } else if (this.equippedWeapon === 'hyper_teaser') {
        // Hyper Teaser: +5 poin per combo stack tanpa batas (+5, +10, +15, +20, +25, +30, ...)
        this.combo++;
        points = this.combo * 5;
        const isImmune = (points >= 25);
        this.score += points;
        if (charEl) charEl.classList.add('hit-mouse');
        this.sound.playHyperTeaserHit(points, isImmune);

        if (isImmune) {
          this.particles.createHitSparks(hitX, hitY, 22, ['#38bdf8', '#06b6d4', '#facc15', '#ffffff']);
          this.showFloatingPopup(hole, `⚡ +${points} [🛡️ KEBAL!]`, 'score');
        } else {
          this.particles.createHitSparks(hitX, hitY, 16, ['#38bdf8', '#06b6d4', '#ffffff']);
          this.showFloatingPopup(hole, `⚡ +${points}`, 'score');
        }
        this.updateCursorWeapon();
      } else if (this.equippedWeapon === 'knife') {
        // Pisau: flat +13 poin, tidak ada penambahan combo
        points = 13;
        this.score += points;
        this.combo = 0;
        if (this.comboBadge) this.comboBadge.classList.remove('show');
        if (charEl) charEl.classList.add('hit-mouse');
        this.sound.playKnifeStab();
        this.particles.createHitSparks(hitX, hitY, 16, ['#ffffff', '#e2e8f0', '#cbd5e0', '#e53e3e']);
        this.showFloatingPopup(hole, `🗡️ +13`, 'score');
      } else if (this.equippedWeapon === 'sword') {
        // Pedang: +11 poin basis * combo multiplier dengan fitur combo
        this.combo++;
        const multiplier = Math.min(4, 1 + Math.floor(this.combo / 4));
        points = 11 * multiplier;
        this.score += points;
        if (charEl) charEl.classList.add('hit-mouse');
        this.sound.playSwordSlash();
        this.particles.createHitSparks(hitX, hitY, 18, ['#ffffff', '#90cdf4', '#63b3ed', '#ffd700']);
        this.showFloatingPopup(hole, `⚔️ +${points}`, 'score');
      } else if (this.equippedWeapon === 'magnet_mace') {
        // Magnet Mace: flat +13 poin, bukan senjata combo
        points = 13;
        this.score += points;
        this.combo = 0;
        if (this.comboBadge) this.comboBadge.classList.remove('show');
        if (charEl) charEl.classList.add('hit-mouse');
        this.sound.playMaceHit();
        this.particles.createHitSparks(hitX, hitY, 18, ['#9f7aea', '#805ad5', '#e53e3e', '#ffd700', '#ffffff']);
        this.showFloatingPopup(hole, `🧲 +13`, 'score');
      } else if (this.equippedWeapon === 'electric_hammer') {
        // Palu Listrik: flat +13 poin, tidak ada penambahan combo
        points = 13;
        this.score += points;
        this.combo = 0;
        if (this.comboBadge) this.comboBadge.classList.remove('show');
        if (charEl) charEl.classList.add('hit-mouse');
        this.sound.playElectricZap();
        this.particles.createHitSparks(hitX, hitY, 18, ['#00f5d4', '#ffe600', '#00b4d8', '#ffffff']);
        this.showFloatingPopup(hole, `⚡ +13`, 'score');
      } else {
        // Palu Standar: +10 poin basis * combo multiplier
        this.combo++;
        const multiplier = Math.min(4, 1 + Math.floor(this.combo / 4));
        points = 10 * multiplier;
        this.score += points;
        if (charEl) charEl.classList.add('hit-mouse');
        this.sound.playHitMouse();
        this.particles.createHitSparks(hitX, hitY);
        this.showFloatingPopup(hole, `+${points}`, 'score');
      }

      this.updateHUD();
      this.clearHoleAfterHit(index, 250);

    } else if (info.type === 'poison_mouse') {
      // Hyper Teaser Immunity (Stack 25+)
      if (this.equippedWeapon === 'hyper_teaser' && (this.combo * 5 >= 25)) {
        const currentStack = this.combo * 5;
        this.score += 25;
        this.sound.playHyperTeaserBlock();
        this.particles.createHitSparks(hitX, hitY, 24, ['#22c55e', '#86efac', '#38bdf8', '#ffffff']);
        this.showFloatingPopup(hole, `🛡️ KEBAL RACUN (Stack ${currentStack})! +25`, 'score');
        this.showSpeedUpPopup(`🛡️ Hyper Teaser Kebal! Racun Tikus Dinetralkan (+25 Poin)`);
        this.triggerScreenShake();
        if (charEl) charEl.classList.add('hit-poison');
        this.updateHUD();
        this.clearHoleAfterHit(index, 250);
        return;
      }

      // Super Hammer is immune to poison
      if (this.activePower === 'super_hammer') {
        this.score += 20;
        this.sound.playSuperHit();
        this.particles.createHitSparks(hitX, hitY, 22, ['#22c55e', '#f6e05e', '#ffffff']);
        this.showFloatingPopup(hole, `⚡ NEUTRALIZED! +20`, 'score');
        if (charEl) charEl.classList.add('hit-poison');
        this.updateHUD();
        this.clearHoleAfterHit(index, 250);
        return;
      }

      // Mace Invincible Mode
      if (this.isMaceInvincible) {
        this.score += 25;
        this.sound.playShieldBlock();
        this.particles.createHitSparks(hitX, hitY, 22, ['#22c55e', '#ffd700', '#ffffff']);
        this.showFloatingPopup(hole, `🛡️ KEBAL RACUN! +25`, 'score');
        if (charEl) charEl.classList.add('hit-poison');
        this.updateHUD();
        this.clearHoleAfterHit(index, 250);
        return;
      }

      // Accidental hit on green poison mouse: -1 Nyawa / Life
      this.lives = Math.max(0, this.lives - 1);
      this.resetCombo();

      if (charEl) charEl.classList.add('hit-poison');
      this.sound.playPoisonHit();
      this.particles.createHitSparks(hitX, hitY, 24, ['#22c55e', '#86efac', '#15803d', '#a855f7', '#10b981']);
      this.showFloatingPopup(hole, `🤢 -1 ❤️ (RACUN!)`, 'damage');
      this.triggerScreenShake();

      this.updateHUD();
      this.clearHoleAfterHit(index, 300);

      if (this.lives <= 0) {
        if (this.equippedWeapon === 'magnet_mace' && !this.maceRevived) {
          this.triggerMaceRevival();
        } else {
          this.gameOver('Nyawamu habis karena memukul tikus beracun!');
        }
      }

    } else if (info.type === 'bomb') {
      // Hyper Teaser: Kebal terhadap apapun saat stack poin sudah mencapai 25+ (combo >= 5)
      // Tapi kalau stack cuma 5, 10, 15, 20 (combo 1-4), tidak kebal!
      if (this.equippedWeapon === 'hyper_teaser' && (this.combo * 5 >= 25)) {
        const currentStack = this.combo * 5;
        this.score += 25;
        this.sound.playHyperTeaserBlock();
        this.particles.createExplosion(hitX, hitY);
        this.particles.createHitSparks(hitX, hitY, 24, ['#38bdf8', '#06b6d4', '#facc15', '#ffffff']);
        this.showFloatingPopup(hole, `🛡️ KEBAL (Stack ${currentStack})! +25`, 'score');
        this.showSpeedUpPopup(`🛡️ Hyper Teaser Kebal! Ledakan Bom Dinetralkan (+25 Poin)`);
        this.triggerScreenShake();
        if (charEl) charEl.classList.add('hit-mouse');
        this.updateHUD();
        this.clearHoleAfterHit(index, 250);
        return;
      }

      // Super Hammer is immune to bombs!
      if (this.activePower === 'super_hammer') {
        this.score += 20;
        this.sound.playSuperHit();
        this.particles.createHitSparks(hitX, hitY, 22, ['#ecc94b', '#f6e05e', '#ffffff']);
        this.showFloatingPopup(hole, `⚡ DEFUSED! +20`, 'score');
        if (charEl) charEl.classList.add('hit-mouse');
        this.updateHUD();
        this.clearHoleAfterHit(index, 250);
        return;
      }

      // Mace Invincible Mode: Kebal terhadap bom apapun selama 8 detik setelah bangkit!
      if (this.isMaceInvincible) {
        this.score += 25;
        this.sound.playShieldBlock();
        this.particles.createExplosion(hitX, hitY);
        this.particles.createHitSparks(hitX, hitY, 22, ['#ffd700', '#ffffff', '#9f7aea']);
        this.showFloatingPopup(hole, `🛡️ KEBAL! +25`, 'score');
        if (charEl) charEl.classList.add('hit-mouse');
        this.updateHUD();
        this.clearHoleAfterHit(index, 250);
        return;
      }

      // Palu Listrik: Kebal terhadap bom satu kali per permainan!
      if (this.equippedWeapon === 'electric_hammer' && this.electricShieldAvailable) {
        this.electricShieldAvailable = false;
        this.score += 15;
        this.sound.playShieldBlock();
        this.particles.createExplosion(hitX, hitY);
        this.particles.createHitSparks(hitX, hitY, 24, ['#00f5d4', '#ffe600', '#00b4d8', '#ffffff']);
        this.showFloatingPopup(hole, `🛡️ KEBAL BOM 1X! +15`, 'score');
        this.showSpeedUpPopup('🛡️ Perisai Palu Listrik Menangkis Ledakan Bom!');
        this.triggerScreenShake();
        if (charEl) charEl.classList.add('hit-mouse');
        this.updateHUD();
        this.clearHoleAfterHit(index, 250);
        return;
      }

      // Normal Bomb hit: -1 life
      this.lives = Math.max(0, this.lives - 1);
      this.resetCombo();

      // Magnet Mace: Setiap bom yang dia terima, cooldown Iron Punch langsung instan reset & siap kembali!
      if (this.equippedWeapon === 'magnet_mace' && this.lives > 0) {
        this.lastMaceSkillTime = 0;
        clearInterval(this.maceSkillCdInterval);
        this.sound.playPowerUp();
        this.showSpeedUpPopup('🧲 ENERGI BOM DISERAP! IRON PUNCH SIAP DIGUNAKAN!');
        this.updateSlashSkillUI();
        this.updateWeaponBadge();
      }

      if (charEl) charEl.classList.add('hit-bomb');
      this.sound.playExplosion();
      this.particles.createExplosion(hitX, hitY);
      this.showFloatingPopup(hole, `💥 -1 ❤️`, 'damage');
      this.triggerScreenShake();

      this.updateHUD();
      this.clearHoleAfterHit(index, 300);

      if (this.lives <= 0) {
        if (this.equippedWeapon === 'magnet_mace' && !this.maceRevived) {
          this.triggerMaceRevival();
        } else {
          this.gameOver('Nyawamu habis karena terkena ledakan bom!');
        }
      }
    }
  }

  resetCombo() {
    this.combo = 0;
    if (this.comboBadge) {
      this.comboBadge.classList.remove('show');
      this.comboBadge.classList.remove('teaser-immune-combo');
    }
    if (this.equippedWeapon === 'hyper_teaser') {
      this.updateCursorWeapon();
      this.updateWeaponBadge();
    }
  }

  showFloatingPopup(holeElement, text, type) {
    const popup = document.createElement('div');
    popup.className = `floating-popup ${type}`;
    popup.textContent = text;
    popup.style.top = '10%';
    popup.style.left = '35%';
    holeElement.appendChild(popup);

    setTimeout(() => {
      popup.remove();
    }, 700);
  }

  showCoinPopup(text) {
    const el = document.createElement('div');
    el.className = 'floating-popup coin';
    el.innerText = text;
    el.style.position = 'fixed';
    el.style.top = '35%';
    el.style.left = '50%';
    el.style.transform = 'translate(-50%, -50%)';
    el.style.zIndex = '10001';
    document.body.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, 1200);
  }

  triggerScreenShake() {
    this.gameContainer.classList.remove('shake');
    void this.gameContainer.offsetWidth;
    this.gameContainer.classList.add('shake');
    setTimeout(() => {
      this.gameContainer.classList.remove('shake');
    }, 400);
  }

  updateHUD() {
    this.scoreDisplay.textContent = this.score;

    // Check for Coin Reward every 100 score milestone (tidak mendapatkan koin di mode Senjata Gila)
    const current100Tier = Math.floor(this.score / 100);
    if (current100Tier > this.lastCoinMilestone && this.isPlaying && this.score >= 100) {
      if (this.mode === 'crazy_weapons') {
        this.lastCoinMilestone = current100Tier;
      } else {
        const tiersGained = current100Tier - this.lastCoinMilestone;
        // Perolehan koin: Mudah=15, Sedang=20, Sulit=25, Extreme=30
        const coinRate = (this.mode === 'easy') ? 15 : (this.mode === 'medium' ? 20 : (this.mode === 'hard' ? 25 : 30));
        const coinsEarned = tiersGained * coinRate;
        this.coins += coinsEarned;
        localStorage.setItem('whack_mouse_coins', this.coins);
        this.lastCoinMilestone = current100Tier;

        this.sound.playCoin();
        this.showCoinPopup(`+${coinsEarned} 🪙 KOIN!`);
      }
    }

    // Update Coin Displays
    if (this.coinDisplay) this.coinDisplay.textContent = this.coins;
    if (this.menuCoinDisplay) this.menuCoinDisplay.textContent = this.coins;

    // Update Help Action Buttons (enable/disable and ready-to-buy pulse based on coin balance)
    if (this.btnPowerHammer) {
      const canAffordHammer = this.coins >= this.powerCosts.super_hammer;
      this.btnPowerHammer.disabled = !canAffordHammer;
      this.btnPowerHammer.classList.toggle('ready-to-buy', canAffordHammer);
    }
    if (this.btnPowerRocket) {
      const canAffordRocket = this.coins >= this.powerCosts.rocket;
      this.btnPowerRocket.disabled = !canAffordRocket;
      this.btnPowerRocket.classList.toggle('ready-to-buy', canAffordRocket);
    }
    if (this.btnPowerLaser) {
      const canAffordLaser = this.coins >= this.powerCosts.laser;
      this.btnPowerLaser.disabled = !canAffordLaser;
      this.btnPowerLaser.classList.toggle('ready-to-buy', canAffordLaser);
    }
    if (this.btnPowerHeart) {
      const canAffordHeart = this.coins >= this.powerCosts.heart;
      this.btnPowerHeart.disabled = !canAffordHeart;
      this.btnPowerHeart.classList.toggle('ready-to-buy', canAffordHeart);
    }

    // Victory Check: Reaching 1500 score completes/tamats the level!
    if (this.score >= 1500 && this.isPlaying) {
      this.gameVictory();
      return;
    }

    // Check for Speed Increase every 50 score!
    const currentSpeedLevel = Math.floor(this.score / 50) + 1;
    if (currentSpeedLevel > this.speedLevel && this.isPlaying && this.score >= 50) {
      this.speedLevel = currentSpeedLevel;
      this.showSpeedUpPopup(`⚡ KECEPATAN NAIK! (Level ${this.speedLevel})`);
    }

    // Check for Crazy Weapons Mode: Free random weapon every 100 score milestone without coins!
    if (this.mode === 'crazy_weapons' && this.isPlaying && this.score >= 100) {
      const currentFreeWeaponTier = Math.floor(this.score / 100);
      if (currentFreeWeaponTier > this.lastFreeWeaponMilestone) {
        this.lastFreeWeaponMilestone = currentFreeWeaponTier;
        this.triggerSuperPower(); // Acak Palu Kebal Bom, Roket, atau Laser!
        this.sound.playPowerUp();
        this.showSuperAnnouncement('⚔️ SENJATA GILA GRATIS!\n(BONUS KELIPATAN 100 SKOR)');
      }
    }

    // Check for Super Power reward: 150 score for Extreme mode, 250 score for other modes!
    const powerStep = (this.mode === 'extreme' || this.mode === 'crazy_weapons') ? 150 : 250;
    if (this.score >= this.nextPowerScore && this.isPlaying && this.mode !== 'crazy_weapons') {
      if (this.score >= 1000 && !this.milestone1000Done) {
        // Special Milestone: 1x Peluru Roket + 9-Bomb Rush Event!
        this.milestone1000Done = true;
        this.triggerSuperPower('rocket', 1, 'SEMUA JALAN TERTUTUP BOM\nCEPAT HANCURKAN MEREKA');
        this.spawnAllBombsEvent();
      } else {
        this.triggerSuperPower();
      }
      this.nextPowerScore += powerStep;
    }

    const currentModeHS = this.highScores[this.mode] || 0;
    if (this.score > currentModeHS) {
      this.highScores[this.mode] = this.score;
      localStorage.setItem(`whack_mouse_hs_${this.mode}`, this.score);
    }
    this.highScoreDisplay.textContent = this.highScores[this.mode] || 0;

    // Update menu high scores
    if (this.menuHsEasy) this.menuHsEasy.textContent = this.highScores.easy || 1000;
    if (this.menuHsMedium) this.menuHsMedium.textContent = this.highScores.medium || 750;
    if (this.menuHsHard) this.menuHsHard.textContent = this.highScores.hard || 500;
    if (this.menuHsExtreme) this.menuHsExtreme.textContent = this.highScores.extreme || 0;
    if (this.menuHsBombCrazy) this.menuHsBombCrazy.textContent = this.highScores.bomb_crazy || 0;
    if (this.menuHsCrazyWeapons) this.menuHsCrazyWeapons.textContent = this.highScores.crazy_weapons || 0;
    if (this.menuHsPoisonMouse) this.menuHsPoisonMouse.textContent = this.highScores.poison_mouse || 0;

    // Check if Extreme mode should be unlocked
    this.checkExtremeUnlock(true);

    // Update achievements on score/milestone changes
    this.checkAchievements(true);

    // Update hearts display dynamically (supports 3, 4, or more lives)
    if (this.heartsList) {
      this.heartsList.innerHTML = '';
      const totalSlots = Math.max(3, this.maxLives || 3, this.lives);
      for (let i = 1; i <= totalSlots; i++) {
        const heartEl = document.createElement('span');
        heartEl.id = `heart-${i}`;
        heartEl.className = i <= this.lives ? 'heart active' : 'heart lost';
        heartEl.textContent = '❤️';
        this.heartsList.appendChild(heartEl);
      }
    }

    // Update combo badge
    if (this.equippedWeapon === 'hyper_teaser') {
      if (this.combo >= 1) {
        const stackPts = this.combo * 5;
        const isImmune = stackPts >= 25;
        if (isImmune) {
          this.comboCount.innerHTML = `${this.combo}x <span class="teaser-combo-tag immune">⚡ +${stackPts} Pts [🛡️ KEBAL TOTAL]</span>`;
          this.comboBadge.classList.add('teaser-immune-combo');
        } else {
          this.comboCount.innerHTML = `${this.combo}x <span class="teaser-combo-tag">⚡ +${stackPts} Pts (Stack ${stackPts}/25)</span>`;
          this.comboBadge.classList.remove('teaser-immune-combo');
        }
        this.comboBadge.classList.add('show');
      } else {
        this.comboBadge.classList.remove('show');
        this.comboBadge.classList.remove('teaser-immune-combo');
      }
    } else if (this.combo >= 2) {
      const multiplier = Math.min(4, 1 + Math.floor(this.combo / 4));
      this.comboCount.textContent = `${multiplier} (${this.combo}x)`;
      this.comboBadge.classList.remove('teaser-immune-combo');
      this.comboBadge.classList.add('show');
    } else {
      this.comboBadge.classList.remove('show');
      this.comboBadge.classList.remove('teaser-immune-combo');
    }

    // Update weapon status in HUD
    this.updateWeaponBadge();
    this.updateSlashSkillUI();
  }

  // Achievements System Methods
  openAchievementsModal() {
    this.checkAchievements(false);
    this.renderAchievements();
    if (this.achievementsOverlay) {
      this.achievementsOverlay.classList.add('active');
    }
  }

  closeAchievementsModal() {
    if (this.achievementsOverlay) {
      this.achievementsOverlay.classList.remove('active');
    }
  }

  checkAchievements(showNotification = true) {
    let unlockedAny = false;
    let unlockedCount = 0;

    ACHIEVEMENTS_CONFIG.forEach((achieve) => {
      const state = this.achievements[achieve.id] || { unlocked: false, claimed: false };
      let isEligible = state.unlocked;

      if (!isEligible) {
        switch (achieve.id) {
          case 'too_easy':
            isEligible = (this.mode === 'easy' && this.score >= 250) || ((this.highScores.easy || 0) >= 250);
            break;
          case 'all_is_boom_wall':
            isEligible = ((this.mode === 'easy' || this.mode === 'medium' || this.mode === 'hard' || this.mode === 'extreme') && this.score >= 1000) ||
              ((this.highScores.easy || 0) >= 1000 || (this.highScores.medium || 0) >= 1000 || (this.highScores.hard || 0) >= 1000 || (this.highScores.extreme || 0) >= 1000);
            break;
          case 'complete_the_easy':
            isEligible = this.clearedModes.has('easy') || ((this.highScores.easy || 0) >= 1500);
            break;
          case 'complete_the_medium':
            isEligible = this.clearedModes.has('medium') || ((this.highScores.medium || 0) >= 1500);
            break;
          case 'complete_hard':
            isEligible = this.clearedModes.has('hard') || ((this.highScores.hard || 0) >= 1500);
            break;
          case 'impossible':
            isEligible = this.hasPlayedExtreme || (this.mode === 'extreme' && this.isPlaying);
            break;
          case 'collector':
            isEligible = ['super_hammer', 'rocket', 'laser', 'heart'].every(item => this.purchasedItems.has(item));
            break;
          case 'crazy':
            isEligible = (this.mode === 'extreme' && this.score >= 500) || ((this.highScores.extreme || 0) >= 500);
            break;
          case 'boom_and_swing':
            isEligible = (this.clearedModes.has('bomb_crazy') && this.clearedModes.has('crazy_weapons')) ||
              (((this.highScores.bomb_crazy || 0) >= 1500) && ((this.highScores.crazy_weapons || 0) >= 1500));
            break;
          case 'all_in':
            // Check if other 9 achievements are unlocked
            isEligible = ACHIEVEMENTS_CONFIG.filter(a => a.id !== 'all_in')
              .every(a => this.achievements[a.id] && this.achievements[a.id].unlocked);
            break;
        }
      }

      if (isEligible && !state.unlocked) {
        state.unlocked = true;
        this.achievements[achieve.id] = state;
        unlockedAny = true;
        if (showNotification) {
          this.showAchievementToast(achieve);
          this.sound.playPowerUp();
        }
      }

      if (state.unlocked) {
        unlockedCount++;
      }
    });

    if (unlockedAny) {
      localStorage.setItem('whack_mouse_achievements', JSON.stringify(this.achievements));
      // Recheck for all_in achievement if any unlocked
      const allOthersUnlocked = ACHIEVEMENTS_CONFIG.filter(a => a.id !== 'all_in')
        .every(a => this.achievements[a.id] && this.achievements[a.id].unlocked);
      if (allOthersUnlocked && (!this.achievements['all_in'] || !this.achievements['all_in'].unlocked)) {
        this.achievements['all_in'] = { unlocked: true, claimed: false };
        localStorage.setItem('whack_mouse_achievements', JSON.stringify(this.achievements));
        unlockedCount++;
        if (showNotification) {
          const allInCfg = ACHIEVEMENTS_CONFIG.find(a => a.id === 'all_in');
          if (allInCfg) this.showAchievementToast(allInCfg);
        }
      }
    }

    // Update Counter Badges
    if (this.achieveCounterBadge) {
      this.achieveCounterBadge.textContent = `${unlockedCount}/10`;
    }
    if (this.achieveTotalProgress) {
      this.achieveTotalProgress.textContent = `${unlockedCount} / 10 Terbuka`;
    }

    if (this.achievementsOverlay && this.achievementsOverlay.classList.contains('active')) {
      this.renderAchievements();
    }
  }

  claimAchievement(achieveId) {
    const state = this.achievements[achieveId];
    const cfg = ACHIEVEMENTS_CONFIG.find(a => a.id === achieveId);
    if (!state || !state.unlocked || state.claimed || !cfg) return;

    state.claimed = true;
    localStorage.setItem('whack_mouse_achievements', JSON.stringify(this.achievements));

    // Award coins
    this.coins += cfg.reward;
    localStorage.setItem('whack_mouse_coins', this.coins);

    this.sound.playCoin();
    this.particles.createExplosion(window.innerWidth / 2, window.innerHeight / 2);
    this.showSpeedUpPopup(`🪙 +${cfg.reward} Koin Diklaim dari "${cfg.title}"!`);

    this.updateHUD();
    this.renderAchievements();
  }

  renderAchievements() {
    if (!this.achievementsList) return;
    this.achievementsList.innerHTML = '';

    ACHIEVEMENTS_CONFIG.forEach((achieve) => {
      const state = this.achievements[achieve.id] || { unlocked: false, claimed: false };
      const itemEl = document.createElement('div');
      
      let statusClass = 'locked';
      if (state.claimed) {
        statusClass = 'claimed';
      } else if (state.unlocked) {
        statusClass = 'unlocked';
      }

      itemEl.className = `achievement-item ${statusClass}`;

      let actionHtml = '';
      if (state.claimed) {
        actionHtml = `<span class="achieve-status-badge claimed">Diklaim ✅</span>`;
      } else if (state.unlocked) {
        actionHtml = `<button class="achieve-btn-claim" data-id="${achieve.id}">KLAIM 🪙 ${achieve.reward}</button>`;
      } else {
        actionHtml = `<span class="achieve-status-badge locked">Belum Tercapai 🔒</span>`;
      }

      itemEl.innerHTML = `
        <div class="achieve-item-left">
          <div class="achieve-item-icon">${achieve.icon}</div>
          <div class="achieve-item-details">
            <div class="achieve-item-title">${achieve.title}</div>
            <div class="achieve-item-desc">${achieve.desc}</div>
            <div class="achieve-item-reward">🎁 Hadiah: 🪙 ${achieve.reward} Koin</div>
          </div>
        </div>
        <div class="achieve-item-right">
          ${actionHtml}
        </div>
      `;

      // Attach claim event
      const claimBtn = itemEl.querySelector('.achieve-btn-claim');
      if (claimBtn) {
        claimBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.claimAchievement(achieve.id);
        });
      }

      this.achievementsList.appendChild(itemEl);
    });
  }

  showAchievementToast(achieve) {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
      <div class="toast-icon">${achieve.icon}</div>
      <div class="toast-info">
        <span class="toast-label">🏅 PIAGAM TERBUKA!</span>
        <span class="toast-title">${achieve.title}</span>
        <span class="toast-reward">+${achieve.reward} 🪙 Koin (Buka Menu Piagam untuk Klaim)</span>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3200);
  }

  // Level Victory Celebration when reaching 1500 score!
  gameVictory() {
    this.isPlaying = false;
    clearTimeout(this.spawnTimer);
    this.clearSuperPower();
    this.sound.stopBGM();

    // Clear all active hole slots
    this.activeSlots.forEach((val) => clearTimeout(val.timeout));
    this.activeSlots.clear();

    // Track cleared mode for achievements
    this.clearedModes.add(this.mode);
    localStorage.setItem('whack_mouse_cleared_modes', JSON.stringify([...this.clearedModes]));

    // Special Victory Reward: 250 Koin untuk Mode Tikus Beracun
    let bonusCoins = 0;
    if (this.mode === 'poison_mouse') {
      bonusCoins = 250;
      this.coins += bonusCoins;
      localStorage.setItem('whack_mouse_coins', this.coins);
      this.showSpeedUpPopup('🎉 BONUS TAMAT TIKUS BERACUN: +250 🪙 KOIN!');
    }

    const currentModeHS = this.highScores[this.mode] || 0;
    if (this.score > currentModeHS) {
      this.highScores[this.mode] = this.score;
      localStorage.setItem(`whack_mouse_hs_${this.mode}`, this.score);
    }
    this.checkExtremeUnlock(true);
    this.checkAchievements(true);

    const cfg = DIFFICULTY_CONFIG[this.mode];

    setTimeout(() => {
      this.sound.playVictory();

      // Launch multiple bursts of celebratory confetti
      for (let k = 0; k < 6; k++) {
        setTimeout(() => {
          this.particles.createConfetti(
            Math.random() * window.innerWidth,
            Math.random() * (window.innerHeight * 0.6)
          );
        }, k * 200);
      }

      if (this.victoryScore) this.victoryScore.textContent = this.score;
      if (this.victoryMiceHit) this.victoryMiceHit.textContent = this.miceHit;
      if (this.victoryCoins) this.victoryCoins.textContent = this.coins;
      if (this.victoryLevelName) this.victoryLevelName.textContent = cfg.name;

      const victoryMsg = document.getElementById('victory-message');
      if (victoryMsg) {
        if (this.mode === 'poison_mouse') {
          victoryMsg.innerHTML = `Luar biasa! Kamu berhasil menamatkan mode <strong>Tikus Beracun</strong> dan meraih hadiah <strong>+250 Koin 🪙</strong>!`;
        } else {
          victoryMsg.textContent = 'Luar biasa! Kamu berhasil menamatkan level dengan mencapai target skor 1500!';
        }
      }

      if (this.victoryOverlay) {
        this.victoryOverlay.classList.add('active');
      }
    }, 400);
  }

  gameOver(reason = 'Permainan Berakhir!') {
    this.isPlaying = false;
    clearTimeout(this.spawnTimer);
    this.clearSuperPower();
    this.sound.stopBGM();

    // Clear all holes
    this.activeSlots.forEach((val) => clearTimeout(val.timeout));
    this.activeSlots.clear();

    const currentModeHS = this.highScores[this.mode] || 0;
    const cfg = DIFFICULTY_CONFIG[this.mode];

    setTimeout(() => {
      this.sound.playGameOver();
      document.getElementById('gameover-reason').textContent = reason;
      this.finalScore.textContent = this.score;
      this.finalMiceHit.textContent = this.miceHit;
      if (this.finalCoins) this.finalCoins.textContent = this.coins;
      this.finalHighScore.textContent = currentModeHS;
      if (this.finalModeLabel) {
        this.finalModeLabel.textContent = cfg.name;
      }
      this.gameOverOverlay.classList.add('active');
    }, 500);
  }
}

// Instantiate Game on load
document.addEventListener('DOMContentLoaded', () => {
  new Game();
});

