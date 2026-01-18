/**
 * Electric Eel Hazard Entity
 *
 * Deadly hazard - instant game over on contact.
 * Very slow, wide sweep - menacing and deliberate.
 */

import type { HazardEntity, BoundingBox } from '../utils/types';
import { SPEEDS, FISH_BASE_SCALE } from '../utils/constants';
import { getRiverPoint, getRiverWidth } from '../utils/riverPath';
import { ELECTRIC_EEL } from '../assets/sprites';
import { SpriteRenderer } from '../renderer/SpriteRenderer';

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

  // Coordinated wave movement
  private lateralOffset: number;
  private moveDirection: number; // 1 = drifting right, -1 = drifting left
  private driftSpeed: number;
  private wobblePhase: number;

  constructor(spawnLane: number = 0, moveDirection: number = 1) {
    this.renderer = new SpriteRenderer(ELECTRIC_EEL);
    const dims = this.renderer.getDimensions();

    // Start at river source
    this.pathT = 0;

    // Coordinated movement from spawner
    this.lateralOffset = spawnLane;
    this.moveDirection = moveDirection;

    // Electric Eel: very slow, wide sweep (menacing)
    this.driftSpeed = 0.08 + Math.random() * 0.05; // 0.08-0.13

    // Slow undulation for natural feel
    this.wobblePhase = Math.random() * Math.PI * 2;

    // Store base dimensions for scaling
    this.baseWidth = dims.width;
    this.baseHeight = dims.height;

    // Set initial position from path
    const point = getRiverPoint(this.pathT);
    const width = getRiverWidth(this.pathT);
    this.x = point.x + this.lateralOffset * width;
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
   * Update eel position - follows river with slow, menacing sweep
   */
  update(delta: number): void {
    // Move down the river (slowest entity)
    this.pathT += this.speed * delta;

    // Drift sideways in assigned direction (very slow)
    this.lateralOffset += this.moveDirection * this.driftSpeed * delta;

    // Bounce back at river bounds
    if (this.lateralOffset > 0.4) {
      this.lateralOffset = 0.4;
      this.moveDirection = -1;
    } else if (this.lateralOffset < -0.4) {
      this.lateralOffset = -0.4;
      this.moveDirection = 1;
    }

    // Slow undulation (menacing)
    this.wobblePhase += delta * 1.2;
    const wobble = Math.sin(this.wobblePhase) * 0.02;

    // Calculate position from path
    const point = getRiverPoint(this.pathT);
    const width = getRiverWidth(this.pathT);

    this.x = point.x + (this.lateralOffset + wobble) * width;
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
