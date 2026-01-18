/**
 * Bluegill Fish Entity
 *
 * Common fish worth 1 lb. Follows the river curve as it swims downstream.
 */

import type { FishEntity, BoundingBox } from '../utils/types';
import { BLUEGILL_WEIGHT, SPEEDS, FISH_BASE_SCALE } from '../utils/constants';
import { getRiverPoint, getRiverWidth } from '../utils/riverPath';
import { BLUEGILL } from '../assets/sprites';
import { SpriteRenderer } from '../renderer/SpriteRenderer';

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
  private baseWidth: number;
  private baseHeight: number;

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
    this.renderer = new SpriteRenderer(BLUEGILL);
    const dims = this.renderer.getDimensions();

    this.pathT = pathT;
    this.pathOffset = pathOffset;
    this.wobblePhase = Math.random() * Math.PI * 2;

    // Store base dimensions for scaling
    this.baseWidth = dims.width;
    this.baseHeight = dims.height;

    // Set initial position from path parameters
    const point = getRiverPoint(pathT);
    const width = getRiverWidth(pathT);
    this.x = point.x + pathOffset * width * 0.4;
    this.y = point.y;

    // Initial size (will be updated based on pathT)
    const scale = this.getScale();
    this.width = this.baseWidth * scale;
    this.height = this.baseHeight * scale;
  }

  /**
   * Get current scale based on path position (perspective effect)
   */
  private getScale(): number {
    // Normalize pathT to 0-1 range for scaling (clamp negative values)
    const normalizedT = Math.max(0, this.pathT);
    // Scale from 0.8x at spawn to 1.1x at catch zone
    return FISH_BASE_SCALE * (0.8 + normalizedT * 0.3);
  }

  /**
   * Update fish position - follows river curve
   */
  update(delta: number): void {
    // Move along the river path (speed is in path units per second)
    this.pathT += this.speed * delta;

    // Add wobble for natural swimming
    this.wobblePhase += delta * 3;
    const wobble = Math.sin(this.wobblePhase) * 0.05;

    // Calculate position from path
    const point = getRiverPoint(this.pathT);
    const width = getRiverWidth(this.pathT);

    // Update position with wobble
    this.x = point.x + (this.pathOffset + wobble) * width * 0.4;
    this.y = point.y;

    // Update size based on path position (perspective)
    const scale = this.getScale();
    this.width = this.baseWidth * scale;
    this.height = this.baseHeight * scale;

    this.renderer.update(delta);
  }

  /**
   * Render the fish with dynamic scaling
   */
  render(ctx: CanvasRenderingContext2D): void {
    const scale = this.getScale();
    this.renderer.draw(ctx, {
      x: this.x,
      y: this.y,
      scale: scale,
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
