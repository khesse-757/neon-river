/**
 * AudioManager - Handles all game audio
 *
 * Loads and plays sound effects, manages mute state with persistence.
 */

export class AudioManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private muted: boolean = false;
  private volume: number = 0.5;

  constructor() {
    this.loadMuteState();
    this.loadSounds();
  }

  private loadSounds(): void {
    // Preload all sound effects
    this.loadSound('catch', '/audio/water_net.wav');
    // Future sounds:
    // this.loadSound('miss', '/audio/sfx_miss.mp3');
    // this.loadSound('shock', '/audio/sfx_shock.mp3');
    // this.loadSound('win', '/audio/sfx_win.mp3');
    // this.loadSound('lose', '/audio/sfx_lose.mp3');
  }

  private loadSound(name: string, path: string): void {
    const audio = new Audio(path);
    audio.preload = 'auto';
    audio.volume = this.volume;
    this.sounds.set(name, audio);
  }

  play(name: string): void {
    if (this.muted) return;

    const sound = this.sounds.get(name);
    if (sound) {
      // Clone for overlapping plays (multiple fish caught quickly)
      const clone = sound.cloneNode() as HTMLAudioElement;
      clone.volume = this.volume;
      clone.play().catch(() => {
        // Ignore autoplay errors (user hasn't interacted yet)
      });
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
    this.sounds.forEach((sound) => {
      sound.volume = this.volume;
    });
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
}

// Singleton instance
export const audioManager = new AudioManager();
