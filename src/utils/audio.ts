// Ambient Wedding Audio Engine synthesizing gentle acoustic harp & sitar tones in Raag Yaman
class AmbientAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timerId: number | null = null;
  private masterGain: GainNode | null = null;

  // Frequencies in Raag Yaman (Key of C# / D approx, meditative scale)
  // C4, D4, E4, F#4, G4, A4, B4, C5, D5, E5
  private notes = [
    261.63, // C4 (Sa)
    293.66, // D4 (Re)
    329.63, // E4 (Ga)
    369.99, // F#4 (Teevra Ma)
    392.0,  // G4 (Pa)
    440.0,  // A4 (Dha)
    493.88, // B4 (Ni)
    523.25, // C5 (Taar Sa)
    587.33, // D5 (Taar Re)
    659.25, // E5 (Taar Ga)
  ];

  // Pluck an acoustic harp / sitar harmonic note
  private playPluck(freq: number, duration = 3.5, velocity = 0.12) {
    if (!this.ctx || !this.masterGain) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Sitar / acoustic harp rich harmonic blend
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    // Second harmonic with subtle sympathetic resonance
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);

    // Warm resonant low-pass filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3.5, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.2, now + duration);

    // Pluck envelope: sharp attack, gentle plucked decay
    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(velocity, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(velocity * 0.4, now + 0.35);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  // Melodic sequence generator following meditative Yaman phrases
  private stepSequence = () => {
    if (!this.isPlaying) return;

    // Pick meditative patterns: Ni-Re-Ga-Ma#-Dha-Ni-Sa
    const yamanIndices = [6, 1, 2, 3, 4, 5, 6, 7, 5, 2, 1, 0, 2, 4, 7];
    const randomIndex = yamanIndices[Math.floor(Math.random() * yamanIndices.length)];
    const freq = this.notes[randomIndex % this.notes.length];

    this.playPluck(freq, 3.2, 0.08 + Math.random() * 0.05);

    // Occasionally add a soft drone or counter-harmony
    if (Math.random() > 0.6) {
      setTimeout(() => {
        if (!this.isPlaying) return;
        const harmonyIdx = [0, 4, 7][Math.floor(Math.random() * 3)];
        this.playPluck(this.notes[harmonyIdx], 4.5, 0.05);
      }, 400);
    }

    // Schedule next note with humanized gentle timing
    const nextInterval = 1200 + Math.random() * 1600;
    this.timerId = window.setTimeout(this.stepSequence, nextInterval);
  };

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    if (this.isPlaying) return;

    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!this.ctx) {
      this.ctx = new AudioContextClass();
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.isPlaying = true;
    // Initial opening chime
    this.playPluck(this.notes[0], 4.0, 0.08);
    this.playPluck(this.notes[4], 4.5, 0.06);

    this.timerId = window.setTimeout(this.stepSequence, 1500);
  }

  public stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const ambientAudio = new AmbientAudioEngine();
