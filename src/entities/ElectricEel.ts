/**
 * Electric Eel Hazard Entity
 *
 * Deadly hazard - instant game over on contact.
 * Follows river path with additional S-curve slither motion.
 */

import type { HazardEntity, BoundingBox } from '../utils/types';
import { SPEEDS, FISH_BASE_SCALE } from '../utils/constants';
import { getRiverPoint, getRiverWidth } from '../utils/riverPath';
import { ELECTRIC_EEL } from '../assets/sprites';
import { SpriteRenderer } from '../renderer/SpriteRenderer';

// S-curve slither parameters (overlaid on river path)
const SLITHER_AMPLITUDE = 0.3;
const SLITHER_FREQUENCY = 3;

export class ElectricEel implements HazardEntity {
  x: number;
  y: number;
  width: number;
  height: number;
  type = 'electricEel' as const;
  isLethal = true;

  private renderer: SpriteRenderer;
  private speed: number = SPEEDS.ELECTRIC_EEL;
  private baseWidth: number;
  private baseHeight: number;

  // River path tracking
  private pathT: number;
  private baseOffset: number;

  constructor(
    _x: number,
    _y: number,
    pathT: number = 0,
    pathOffset: number = 0
  ) {
    this.renderer = new SpriteRenderer(ELECTRIC_EEL);
    const dims = this.renderer.getDimensions();

    this.pathT = pathT;
    this.baseOffset = pathOffset;

    // Store base dimensions for scaling
    this.baseWidth = dims.width;
    this.baseHeight = dims.height;

    // Set initial position from path parameters
    const point = getRiverPoint(pathT);
    this.x = point.x;
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
   * Update eel position - follows river with S-curve slither
   */
  update(delta: number): void {
    // Move along the river path (speed is in path units per second)
    this.pathT += this.speed * delta;

    // Calculate position from path
    const point = getRiverPoint(this.pathT);
    const width = getRiverWidth(this.pathT);

    // S-curve slither: sinusoidal offset based on position along path
    const slitherPhase = this.pathT * SLITHER_FREQUENCY * Math.PI * 2;
    const slitherOffset = Math.sin(slitherPhase) * SLITHER_AMPLITUDE;

    // Combine base offset with slither
    const totalOffset = this.baseOffset + slitherOffset;

    // Update position
    this.x = point.x + totalOffset * width * 0.4;
    this.y = point.y;

    // Update size based on path position (perspective)
    const scale = this.getScale();
    this.width = this.baseWidth * scale;
    this.height = this.baseHeight * scale;

    this.renderer.update(delta);
  }

  /**
   * Render the eel with dynamic scaling
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
   * Check if eel has exited the play area
   */
  isOffScreen(): boolean {
    return this.pathT >= 1.0;
  }
}
