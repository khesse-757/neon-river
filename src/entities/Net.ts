/**
 * Net Entity
 *
 * Player-controlled net for catching fish.
 * Moves horizontally based on input, fixed Y position.
 */

import type { Entity, BoundingBox } from '../utils/types';
import { NET_Y } from '../utils/constants';
import { NET } from '../assets/sprites';
import { SpriteRenderer } from '../renderer/SpriteRenderer';

const SPRITE_SCALE = 4;

export class Net implements Entity {
  x: number;
  y: number;
  width: number;
  height: number;

  private renderer: SpriteRenderer;

  constructor(initialX: number = 0) {
    this.renderer = new SpriteRenderer(NET);
    const dims = this.renderer.getDimensions();

    this.x = initialX;
    this.y = NET_Y;
    this.width = dims.width * SPRITE_SCALE;
    this.height = dims.height * SPRITE_SCALE;
  }

  /**
   * Set the net's horizontal position
   */
  setX(x: number): void {
    this.x = x;
  }

  /**
   * Update the net (currently no animation)
   */
  update(_delta: number): void {
    this.renderer.update(_delta);
  }

  /**
   * Render the net to the canvas
   */
  render(ctx: CanvasRenderingContext2D): void {
    this.renderer.draw(ctx, {
      x: this.x,
      y: this.y,
      scale: SPRITE_SCALE,
    });
  }

  /**
   * Get bounding box for collision detection
   */
  getBoundingBox(): BoundingBox {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
}
