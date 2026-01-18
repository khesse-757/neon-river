/**
 * Bluegill Fish Entity
 *
 * Common fish worth 1 lb. Follows the river curve as it swims downstream.
 * Has subtle bioluminescent glow.
 */

import type { FishEntity, BoundingBox } from '../utils/types';
import { BLUEGILL_WEIGHT, SPEEDS, GAME_HEIGHT } from '../utils/constants';
import { getRiverPoint, getRiverWidth } from '../utils/riverPath';
import { BLUEGILL } from '../assets/sprites';
import { SpriteRenderer } from '../renderer/SpriteRenderer';

const SPRITE_SCALE = 2;
const OFF_SCREEN_MARGIN = 50;

export class Bluegill implements FishEntity {
  x: number;
  y: number;
  width: number;
  height: number;
  weight: number = BLUEGILL_WEIGHT;
  points: number = BLUEGILL_WEIGHT;
  type = 'bluegill' as const;

  private renderer: SpriteRenderer;
  private speed: number = SPEEDS.BLUEGILL;

  // River path tracking
  private pathT: number; // Position along river (0-1)
  private pathOffset: number; // Lateral offset from center (-1 to 1)
  private wobblePhase: number; // For natural swimming motion

  constructor(x: number, y: number, pathT: number = 0, pathOffset: number = 0) {
    this.renderer = new SpriteRenderer(BLUEGILL);
    const dims = this.renderer.getDimensions();

    this.pathT = pathT;
    this.pathOffset = pathOffset;
    this.wobblePhase = Math.random() * Math.PI * 2;

    // Set initial position from path parameters
    const point = getRiverPoint(pathT);
    const width = getRiverWidth(pathT);
    this.x = point.x + pathOffset * width * 0.4;
    this.y = point.y;

    // Override with provided x, y if not following path from start
    if (pathT === 0 && pathOffset === 0) {
      this.x = x;
      this.y = y;
    }

    this.width = dims.width * SPRITE_SCALE;
    this.height = dims.height * SPRITE_SCALE;
  }

  /**
   * Update fish position - follows river curve
   */
  update(delta: number): void {
    // Move along the river path
    // Speed determines how fast we progress along the path
    // Approximate path length for speed normalization
    const pathSpeed = this.speed / (GAME_HEIGHT * 0.8);
    this.pathT += pathSpeed * delta;

    // Add wobble for natural swimming
    this.wobblePhase += delta * 3;
    const wobble = Math.sin(this.wobblePhase) * 0.05;

    // Calculate position from path
    const point = getRiverPoint(this.pathT);
    const width = getRiverWidth(this.pathT);

    // Update position with wobble
    this.x = point.x + (this.pathOffset + wobble) * width * 0.4;
    this.y = point.y;

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
   * Check if fish has left the screen (past end of river path)
   */
  isOffScreen(): boolean {
    return this.y > GAME_HEIGHT + OFF_SCREEN_MARGIN || this.pathT > 1.1;
  }
}
