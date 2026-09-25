// Qaafirana Music Engine
// Streams the soulful wedding anthem "Qaafirana" (Kedarnath · Arijit Singh & Nikhita Gandhi · Amit Trivedi)
// with resilient fallback to acoustic mountain sitar notes in Raag Yaman.

export interface AudioState {
  isPlaying: boolean;
  isReady: boolean;
  trackTitle: string;
  artist: string;
  source: 'youtube' | 'local' | 'synth';
  volume: number;
  isMuted: boolean;
}

type AudioListener = (state: AudioState) => void;

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

class QaafiranaAudioEngine {
  private isPlaying = false;
  private isReady = false;
  private volume = 85;
  private isMuted = false;
  private listeners: Set<AudioListener> = new Set();
  private ytPlayer: any = null;
  private pendingPlay = false;
  private localAudio: HTMLAudioElement | null = null;
  private usingLocal = false;

  // Fallback acoustic synth notes (Raag Yaman)
  private synthCtx: AudioContext | null = null;
  private synthTimer: number | null = null;
  private synthGain: GainNode | null = null;
  private notes = [261.63, 293.66, 329.63, 369.99, 392.0, 440.0, 493.88, 523.25, 587.33, 659.25];

  constructor() {
    if (typeof window !== 'undefined') {
      // Defer DOM access until ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.init());
      } else {
        setTimeout(() => this.init(), 100);
      }
    }
  }

  private init() {
    // 1. Direct extracted audio from https://youtu.be/ZmcBC9-wAXM
    try {
      const audio = new Audio('/qaafirana.mp3');
      audio.preload = 'auto';
      audio.loop = true;
      audio.volume = this.volume / 100;
      this.localAudio = audio;
      this.usingLocal = true;
      this.isReady = true;

      audio.addEventListener('canplaythrough', () => {
        this.isReady = true;
        this.notify();
      });

      audio.addEventListener('playing', () => {
        this.isPlaying = true;
        this.notify();
      });

      audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });

      audio.addEventListener('ended', () => {
        if (this.isPlaying) {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        }
      });

      audio.addEventListener('error', () => {
        if (audio.src.includes('.mp3')) {
          audio.src = '/qaafirana.m4a';
          audio.load();
        }
      });

      audio.load();
      this.notify();
    } catch {
      // Local audio fallback
    }

    // 2. Initialize YouTube Stream for user-provided link: https://youtu.be/ZmcBC9-wAXM
    this.initYouTubePlayer();
  }

  private initYouTubePlayer() {
    if (typeof document === 'undefined') return;

    // Create offscreen container keeping iframe active in DOM
    let container = document.getElementById('qaafirana-player-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'qaafirana-player-container';
      container.style.position = 'fixed';
      container.style.bottom = '0';
      container.style.right = '0';
      container.style.width = '160px';
      container.style.height = '90px';
      container.style.opacity = '0.001';
      container.style.pointerEvents = 'none';
      container.style.zIndex = '-999';
      document.body.appendChild(container);
    }

    const playerId = 'qaafirana-yt-iframe';
    let playerDiv = document.getElementById(playerId);
    if (!playerDiv) {
      playerDiv = document.createElement('div');
      playerDiv.id = playerId;
      container.appendChild(playerDiv);
    }

    const setupPlayer = () => {
      if (window.YT && window.YT.Player) {
        this.createYTPlayer(playerId);
      }
    };

    if (window.YT && window.YT.Player) {
      setupPlayer();
    } else {
      const prevHandler = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevHandler) prevHandler();
        setupPlayer();
      };

      if (!document.getElementById('yt-iframe-api-script')) {
        const script = document.createElement('script');
        script.id = 'yt-iframe-api-script';
        script.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(script);
      }
    }
  }

  private createYTPlayer(elementId: string) {
    if (this.ytPlayer) return;

    try {
      this.ytPlayer = new window.YT.Player(elementId, {
        height: '90',
        width: '160',
        videoId: 'ZmcBC9-wAXM', // User specified: https://youtu.be/ZmcBC9-wAXM
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          loop: 1,
          playlist: 'ZmcBC9-wAXM',
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            this.isReady = true;
            try {
              event.target.setVolume(this.volume);
            } catch {
              // Ignore
            }
            if (this.pendingPlay) {
              this.pendingPlay = false;
              this.play();
            }
            this.notify();
          },
          onStateChange: (event: any) => {
            // YT.PlayerState: PLAYING = 1, PAUSED = 2, ENDED = 0, BUFFERING = 3
            if (event.data === 1) {
              this.isPlaying = true;
              this.stopSynth();
            } else if (event.data === 2 || event.data === 0) {
              this.isPlaying = false;
            }
            this.notify();
          },
          onError: () => {
            // If YouTube is restricted, seamless fallback to acoustic sitar
            if (this.isPlaying) {
              this.startSynth();
            }
          },
        },
      });
    } catch (e) {
      console.warn('YouTube Player initialization note:', e);
    }
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (err) {
        console.error(err);
      }
    });
  }

  public getState(): AudioState {
    return {
      isPlaying: this.isPlaying,
      isReady: this.isReady,
      trackTitle: 'Qaafirana',
      artist: 'Arijit Singh & Nikhita Gandhi · Kedarnath',
      source: this.usingLocal ? 'local' : this.ytPlayer ? 'youtube' : 'synth',
      volume: this.volume,
      isMuted: this.isMuted,
    };
  }

  public play() {
    this.isPlaying = true;

    // 1. Try local audio if loaded
    if (this.usingLocal && this.localAudio) {
      this.localAudio.play().catch(() => {});
      this.notify();
      return;
    }

    // 2. Play YouTube stream
    if (this.ytPlayer && typeof this.ytPlayer.playVideo === 'function') {
      try {
        this.ytPlayer.playVideo();
      } catch {
        this.startSynth();
      }
    } else {
      this.pendingPlay = true;
      // Start gentle synth until YouTube is ready
      this.startSynth();
    }
    this.notify();
  }

  public pause() {
    this.isPlaying = false;
    this.pendingPlay = false;

    if (this.usingLocal && this.localAudio) {
      this.localAudio.pause();
    }

    if (this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
      try {
        this.ytPlayer.pauseVideo();
      } catch {
        // Ignore
      }
    }

    this.stopSynth();
    this.notify();
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(100, vol));
    if (this.ytPlayer && typeof this.ytPlayer.setVolume === 'function') {
      try {
        this.ytPlayer.setVolume(this.volume);
      } catch {
        // Ignore
      }
    }
    if (this.localAudio) {
      this.localAudio.volume = this.volume / 100;
    }
    if (this.synthGain && this.synthCtx) {
      this.synthGain.gain.setValueAtTime((this.volume / 100) * 0.7, this.synthCtx.currentTime);
    }
    this.notify();
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ytPlayer) {
      try {
        if (this.isMuted) {
          this.ytPlayer.mute?.();
        } else {
          this.ytPlayer.unMute?.();
        }
      } catch {
        // Ignore
      }
    }
    if (this.localAudio) {
      this.localAudio.muted = this.isMuted;
    }
    this.notify();
    return this.isMuted;
  }

  // Backwards compatibility methods
  public start() {
    this.play();
  }

  public stop() {
    this.pause();
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }

  // --- Meditative Sitar Synth Fallback ---
  private playPluck(freq: number, duration = 3.5, velocity = 0.12) {
    if (!this.synthCtx || !this.synthGain) return;
    const now = this.synthCtx.currentTime;
    const osc1 = this.synthCtx.createOscillator();
    const osc2 = this.synthCtx.createOscillator();
    const gainNode = this.synthCtx.createGain();
    const filter = this.synthCtx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, now);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3.5, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 1.2, now + duration);

    gainNode.gain.setValueAtTime(0.0001, now);
    gainNode.gain.linearRampToValueAtTime(velocity, now + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(velocity * 0.4, now + 0.35);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.synthGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  private stepSequence = () => {
    if (!this.isPlaying) return;
    const yamanIndices = [6, 1, 2, 3, 4, 5, 6, 7, 5, 2, 1, 0, 2, 4, 7];
    const randomIndex = yamanIndices[Math.floor(Math.random() * yamanIndices.length)];
    const freq = this.notes[randomIndex % this.notes.length];

    this.playPluck(freq, 3.2, 0.08 + Math.random() * 0.05);

    if (Math.random() > 0.6) {
      setTimeout(() => {
        if (!this.isPlaying) return;
        const harmonyIdx = [0, 4, 7][Math.floor(Math.random() * 3)];
        this.playPluck(this.notes[harmonyIdx], 4.5, 0.05);
      }, 400);
    }

    const nextInterval = 1200 + Math.random() * 1600;
    this.synthTimer = window.setTimeout(this.stepSequence, nextInterval);
  };

  private startSynth() {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!this.synthCtx) {
      this.synthCtx = new AudioContextClass();
    }
    if (this.synthCtx.state === 'suspended') {
      this.synthCtx.resume();
    }
    this.synthGain = this.synthCtx.createGain();
    this.synthGain.gain.setValueAtTime((this.volume / 100) * 0.7, this.synthCtx.currentTime);
    this.synthGain.connect(this.synthCtx.destination);

    this.playPluck(this.notes[0], 4.0, 0.08);
    this.playPluck(this.notes[4], 4.5, 0.06);
    this.synthTimer = window.setTimeout(this.stepSequence, 1500);
  }

  private stopSynth() {
    if (this.synthTimer) {
      clearTimeout(this.synthTimer);
      this.synthTimer = null;
    }
    if (this.synthGain && this.synthCtx) {
      this.synthGain.gain.linearRampToValueAtTime(0.0001, this.synthCtx.currentTime + 0.3);
    }
  }
}

export const qaafiranaAudio = new QaafiranaAudioEngine();
// Alias for backwards compatibility
export const ambientAudio = qaafiranaAudio;
