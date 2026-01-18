/**
 * Golden Koi Fish Entity
 *
 * Rare fish worth 5 lbs. Swims faster than Bluegill.
 */

import type { FishEntity, BoundingBox } from '../utils/types';
import { GOLDEN_KOI_WEIGHT, SPEEDS, GAME_HEIGHT } from '../utils/constants';
import { GOLDEN_KOI } from '../assets/sprites';
import { SpriteRenderer } from '../renderer/SpriteRenderer';

const SPRITE_SCALE = 4;
const OFF_SCREEN_MARGIN = 50;

export class GoldenKoi implements FishEntity {
  x: number;
  y: number;
  width: number;
  height: number;
  weight: number = GOLDEN_KOI_WEIGHT;
  points: number = GOLDEN_KOI_WEIGHT;
  type = 'goldenKoi' as const;

  private renderer: SpriteRenderer;
  private speed: number = SPEEDS.GOLDEN_KOI;

  constructor(x: number, y: number) {
    this.renderer = new SpriteRenderer(GOLDEN_KOI);
    const dims = this.renderer.getDimensions();

    this.x = x;
    this.y = y;
    this.width = dims.width * SPRITE_SCALE;
    this.height = dims.height * SPRITE_SCALE;
  }

  /**
   * Update fish position - swims downward (faster than Bluegill)
   */
  update(delta: number): void {
    this.y += this.speed * delta;
    this.renderer.update(delta);
  }

  /**
   * Render the fish
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

  /**
   * Check if fish has left the screen (bottom)
   */
  isOffScreen(): boolean {
    return this.y > GAME_HEIGHT + OFF_SCREEN_MARGIN;
  }
}
