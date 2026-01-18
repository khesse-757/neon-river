/**
 * Fisherman - Static sprite of the seated fisherman
 *
 * Positioned in bottom-right, sitting on the bridge.
 * Rendered after background but before fish/net.
 */

import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants';

export class Fisherman {
  private image: HTMLImageElement;
  private loaded: boolean = false;

  // Position (anchor at bottom-center of sprite)
  private x: number = GAME_WIDTH * 0.8;
  private y: number = GAME_HEIGHT * 0.995;

  // Scale factor - adjust if sprite is too big/small
  private scale: number = 1.0;

  constructor() {
    this.image = new Image();
    this.image.src = '/images/fisherman.png';
    this.image.onload = (): void => {
      this.loaded = true;
    };
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.loaded) return;

    const width = this.image.width * this.scale;
    const height = this.image.height * this.scale;

    // Draw with anchor at bottom-center
    ctx.drawImage(
      this.image,
      this.x - width / 2, // Center horizontally on x
      this.y - height, // Anchor at bottom
      width,
      height
    );
  }
}
