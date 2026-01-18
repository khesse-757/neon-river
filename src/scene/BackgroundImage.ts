/**
 * BackgroundImage - Loads and renders the static background image
 *
 * The entire scene (sky, city, hills, water, bridge) is pre-rendered
 * in the background image. Only fish, net, and HUD are drawn on top.
 */

import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants';

export class BackgroundImage {
  private image: HTMLImageElement;
  private loaded: boolean = false;

  constructor() {
    this.image = new Image();
    this.image.src = '/images/background.png';
    this.image.onload = (): void => {
      this.loaded = true;
    };
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.loaded) {
      ctx.drawImage(this.image, 0, 0, GAME_WIDTH, GAME_HEIGHT);
    } else {
      // Fallback color while loading
      ctx.fillStyle = '#0a1822';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }
  }

  isLoaded(): boolean {
    return this.loaded;
  }
}
