/**
 * SpriteRenderer - Draws pixel art sprites to a canvas
 *
 * Handles animation frames, scaling, and palette-based rendering.
 */

import type { SpriteDefinition, PixelGrid, ColorPalette } from '../utils/types';

export interface DrawOptions {
  x: number;
  y: number;
  scale?: number; // Default: 1
  frameOverride?: number; // Force specific frame (0-indexed)
}

export class SpriteRenderer {
  private sprite: SpriteDefinition;
  private elapsedTime: number = 0;

  constructor(sprite: SpriteDefinition) {
    this.sprite = sprite;
  }

  /**
   * Update animation state
   * @param delta - Time elapsed in seconds
   */
  update(delta: number): void {
    if (this.sprite.animation) {
      this.elapsedTime += delta;
    }
  }

  /**
   * Get current animation frame index
   */
  getCurrentFrame(): number {
    const { frames, animation } = this.sprite;
    if (!animation || frames.length <= 1) {
      return 0;
    }

    const frameDuration = 1 / animation.frameRate;
    const totalDuration = frameDuration * frames.length;

    let time = this.elapsedTime;
    if (animation.loop) {
      time = time % totalDuration;
    } else {
      time = Math.min(time, totalDuration - 0.001);
    }

    return Math.floor(time / frameDuration);
  }

  /**
   * Draw the sprite to the canvas
   */
  draw(ctx: CanvasRenderingContext2D, options: DrawOptions): void {
    const { x, y, scale = 1, frameOverride } = options;
    const { frames, palette } = this.sprite;

    const frameIndex = frameOverride ?? this.getCurrentFrame();
    const frame = frames[frameIndex];
    if (!frame) return;

    this.drawPixelGrid(ctx, frame, palette, x, y, scale);
  }

  /**
   * Draw a single frame's pixel grid
   */
  private drawPixelGrid(
    ctx: CanvasRenderingContext2D,
    grid: PixelGrid,
    palette: ColorPalette,
    x: number,
    y: number,
    scale: number
  ): void {
    for (let rowIdx = 0; rowIdx < grid.length; rowIdx++) {
      const row = grid[rowIdx];
      if (!row) continue;

      for (let col = 0; col < row.length; col++) {
        const colorIndex = row[col];

        // Skip transparent pixels (0)
        if (colorIndex === 0 || colorIndex === undefined) continue;

        const color = palette[colorIndex];
        if (!color || color === 'transparent') continue;

        ctx.fillStyle = color;
        ctx.fillRect(x + col * scale, y + rowIdx * scale, scale, scale);
      }
    }
  }

  /**
   * Reset animation to start
   */
  reset(): void {
    this.elapsedTime = 0;
  }

  /**
   * Get sprite dimensions (unscaled)
   */
  getDimensions(): { width: number; height: number } {
    return { width: this.sprite.width, height: this.sprite.height };
  }

  /**
   * Get sprite name
   */
  getName(): string {
    return this.sprite.name;
  }
}
