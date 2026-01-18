/**
 * Electric Eel Hazard Entity
 *
 * Deadly hazard - instant game over on contact.
 * Follows river path with additional S-curve slither motion.
 */

import type { HazardEntity, BoundingBox } from '../utils/types';
import { SPEEDS } from '../utils/constants';
import { getRiverPoint, getRiverWidth } from '../utils/riverPath';
import { ELECTRIC_EEL } from '../assets/sprites';
import { SpriteRenderer } from '../renderer/SpriteRenderer';

const SPRITE_SCALE = 2;

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

    // Set initial position from path parameters
    const point = getRiverPoint(pathT);
    this.x = point.x;
    this.y = point.y;

    this.width = dims.width * SPRITE_SCALE;
    this.height = dims.height * SPRITE_SCALE;
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

    this.renderer.update(delta);
  }

  /**
   * Render the eel
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
   * Check if eel has exited the play area
   */
  isOffScreen(): boolean {
    return this.pathT >= 1.0;
  }
}
