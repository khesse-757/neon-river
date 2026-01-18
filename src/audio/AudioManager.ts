/**
 * AudioManager - Handles all game audio with Web Audio API
 *
 * Uses Web Audio API for low-latency playback on mobile.
 * Pre-decodes sounds into buffers for instant playback.
 */

export class AudioManager {
  private context: AudioContext | null = null;
  private buffers: Map<string, AudioBuffer> = new Map();
  private muted: boolean = false;
  private volume: number = 0.5;
  private initialized: boolean = false;

  constructor() {
    this.loadMuteState();
  }

  // Must be called after user interaction (tap/click)
  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      // Create audio context (requires user gesture on mobile)
      this.context = new (
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      )();

      // Resume if suspended (mobile browsers)
      if (this.context.state === 'suspended') {
        await this.context.resume();
      }

      // Preload all sounds
      await this.loadSound('catch', '/audio/water_net.wav');
      // Future sounds:
      // await this.loadSound('miss', '/audio/sfx_miss.mp3');
      // await this.loadSound('shock', '/audio/sfx_shock.mp3');

      this.initialized = true;
    } catch {
      // Audio initialization failed
    }
  }

  private async loadSound(name: string, path: string): Promise<void> {
    if (!this.context) return;

    try {
      const response = await fetch(path);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
      this.buffers.set(name, audioBuffer);
    } catch {
      // Failed to load sound
    }
  }

  play(name: string): void {
    if (this.muted || !this.context || !this.initialized) return;

    const buffer = this.buffers.get(name);
    if (!buffer) return;

    try {
      // Create buffer source (one-shot, very low latency)
      const source = this.context.createBufferSource();
      source.buffer = buffer;

      // Create gain node for volume control
      const gainNode = this.context.createGain();
      gainNode.gain.value = this.volume;

      // Connect: source -> gain -> output
      source.connect(gainNode);
      gainNode.connect(this.context.destination);

      // Play immediately
      source.start(0);
    } catch {
      // Failed to play sound
    }
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    this.saveMuteState();
    return this.muted;
  }

  isMuted(): boolean {
    return this.muted;
  }

  setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  // Persist mute preference
  private saveMuteState(): void {
    try {
      localStorage.setItem('neonriver_muted', String(this.muted));
    } catch {
      // localStorage not available
    }
  }

  private loadMuteState(): void {
    try {
      const saved = localStorage.getItem('neonriver_muted');
      if (saved !== null) {
        this.muted = saved === 'true';
      }
    } catch {
      // localStorage not available
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

// Singleton instance
export const audioManager = new AudioManager();
