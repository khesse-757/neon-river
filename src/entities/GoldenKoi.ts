/**
 * Golden Koi Fish Entity
 *
 * Rare fish worth 5 lbs. Follows the river curve, swims faster than Bluegill.
 */

import type { FishEntity, BoundingBox } from '../utils/types';
import { GOLDEN_KOI_WEIGHT, SPEEDS } from '../utils/constants';
import { getRiverPoint, getRiverWidth } from '../utils/riverPath';
import { GOLDEN_KOI } from '../assets/sprites';
import { SpriteRenderer } from '../renderer/SpriteRenderer';

const SPRITE_SCALE = 2;

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

  // River path tracking
  private pathT: number;
  private pathOffset: number;
  private wobblePhase: number;

  constructor(
    _x: number,
    _y: number,
    pathT: number = 0,
    pathOffset: number = 0
  ) {
    this.renderer = new SpriteRenderer(GOLDEN_KOI);
    const dims = this.renderer.getDimensions();

    this.pathT = pathT;
    this.pathOffset = pathOffset;
    this.wobblePhase = Math.random() * Math.PI * 2;

    // Set initial position from path parameters
    const point = getRiverPoint(pathT);
    const width = getRiverWidth(pathT);
    this.x = point.x + pathOffset * width * 0.4;
    this.y = point.y;

    this.width = dims.width * SPRITE_SCALE;
    this.height = dims.height * SPRITE_SCALE;
  }

  /**
   * Update fish position - follows river curve (faster than Bluegill)
   */
  update(delta: number): void {
    // Move along the river path (speed is in path units per second)
    this.pathT += this.speed * delta;

    // Add wobble for natural swimming (faster wobble)
    this.wobblePhase += delta * 4;
    const wobble = Math.sin(this.wobblePhase) * 0.06;

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
   * Check if fish has exited the play area
   */
  isOffScreen(): boolean {
    return this.pathT >= 1.0;
  }
}
