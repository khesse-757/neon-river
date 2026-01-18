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

  // Electric spark effect
  private sparkTimer: number = 0;
  private sparkPhase: number = 0;

  constructor(
    spawnLane: number = 0,
    moveDirection: number = 1,
    speedMult: number = 1
  ) {
    this.renderer = new SpriteRenderer(ELECTRIC_EEL);
    const dims = this.renderer.getDimensions();

    // Start at river source
    this.pathT = 0;

    // Coordinated movement from spawner
    this.lateralOffset = spawnLane;
    this.moveDirection = moveDirection;

    // Apply speed multiplier for progressive difficulty
    this.speed = SPEEDS.ELECTRIC_EEL * speedMult;

    // Electric Eel: very slow, wide sweep (menacing)
    this.driftSpeed = (0.08 + Math.random() * 0.05) * speedMult; // 0.08-0.13

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

    // Update spark effect timer
    this.sparkTimer += delta;
    if (this.sparkTimer >= 0.15) {
      this.sparkTimer = 0;
      this.sparkPhase = (this.sparkPhase + 1) % 4;
    }

    this.renderer.update(delta);
  }

  /**
   * Render the eel with dynamic scaling and electric sparks
   */
  render(ctx: CanvasRenderingContext2D): void {
    const scale = this.getScale();

    // Draw electric sparks (before eel so they appear behind/around)
    this.renderSparks(ctx, scale);

    this.renderer.draw(ctx, {
      x: this.x,
      y: this.y,
      scale: scale,
    });
  }

  /**
   * Render pixel-art electric sparks around the eel
   */
  private renderSparks(ctx: CanvasRenderingContext2D, scale: number): void {
    const pixelSize = Math.max(1, Math.floor(scale));
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    // Spark colors - electric yellow and cyan
    const colors = ['#ffff44', '#44ffff', '#ffff88', '#88ffff'];

    // Different spark positions based on phase (creates cycling effect)
    const sparkSets = [
      // Phase 0: sparks at head and mid-body
      [
        { ox: -this.width * 0.4, oy: -this.height * 0.3 },
        { ox: this.width * 0.1, oy: this.height * 0.4 },
      ],
      // Phase 1: sparks shift
      [
        { ox: -this.width * 0.2, oy: this.height * 0.3 },
        { ox: this.width * 0.3, oy: -this.height * 0.4 },
      ],
      // Phase 2: sparks at different spots
      [
        { ox: this.width * 0.0, oy: -this.height * 0.35 },
        { ox: this.width * 0.4, oy: this.height * 0.2 },
      ],
      // Phase 3: cycle back
      [
        { ox: -this.width * 0.3, oy: this.height * 0.2 },
        { ox: this.width * 0.2, oy: -this.height * 0.3 },
      ],
    ];

    const sparks = sparkSets[this.sparkPhase];
    if (!sparks) return;

    for (let i = 0; i < sparks.length; i++) {
      const spark = sparks[i];
      if (!spark) continue;

      const sx = centerX + spark.ox;
      const sy = centerY + spark.oy;
      const color = colors[(i + this.sparkPhase) % colors.length] ?? '#ffff44';

      // Draw tiny zigzag lightning bolt (3-4 pixels)
      ctx.fillStyle = color;

      // Pixel 1
      ctx.fillRect(sx, sy, pixelSize, pixelSize);
      // Pixel 2 - diagonal
      ctx.fillRect(sx + pixelSize, sy + pixelSize, pixelSize, pixelSize);
      // Pixel 3 - back
      ctx.fillRect(sx, sy + pixelSize * 2, pixelSize, pixelSize);
      // Pixel 4 - diagonal again (optional, based on phase)
      if (this.sparkPhase % 2 === 0) {
        ctx.fillRect(sx + pixelSize, sy + pixelSize * 3, pixelSize, pixelSize);
      }
    }
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
