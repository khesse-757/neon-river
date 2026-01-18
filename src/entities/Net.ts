/**
 * Net Entity
 *
 * Player-controlled net for catching fish.
 * Moves horizontally based on input, fixed Y position.
 * Features a pole connecting to the fisherman's hand position.
 */

import type { Entity, BoundingBox } from '../utils/types';
import {
  NET_Y,
  NET_WIDTH,
  NET_HEIGHT,
  NET_MIN_X,
  NET_MAX_X,
  GAME_WIDTH,
  GAME_HEIGHT,
} from '../utils/constants';

export class Net implements Entity {
  x: number;
  y: number;
  width: number = NET_WIDTH;
  height: number = NET_HEIGHT;

  private targetX: number;

  constructor(initialX: number = GAME_WIDTH / 2 - NET_WIDTH / 2) {
    this.x = initialX;
    this.y = NET_Y;
    this.targetX = initialX;
  }

  /**
   * Set the net's horizontal position (with smoothing)
   */
  setX(x: number): void {
    // Calculate clamped target
    const minX = NET_MIN_X;
    const maxX = NET_MAX_X - this.width;
    this.targetX = Math.max(minX, Math.min(maxX, x));
  }

  /**
   * Update the net position with smoothing
   */
  update(delta: number): void {
    // Smooth movement with increased responsiveness
    const smoothing = 0.25;
    this.x += (this.targetX - this.x) * smoothing;

    // Final hard clamp to prevent ANY overshoot
    const minX = NET_MIN_X;
    const maxX = NET_MAX_X - this.width;
    this.x = Math.max(minX, Math.min(maxX, this.x));

    // Suppress unused delta warning
    void delta;
  }

  /**
   * Render the net with pole to the canvas
   */
  render(ctx: CanvasRenderingContext2D): void {
    // Hand/grip position (fixed point on the right side, like fisherman holding it)
    const gripX = GAME_WIDTH * 0.85;
    const gripY = GAME_HEIGHT * 0.88;

    // Net head position (moves with input)
    const netCenterX = this.x + this.width / 2;
    const netCenterY = this.y + this.height / 2;

    // === POLE ===
    ctx.strokeStyle = '#8B7355'; // Wood brown
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(gripX, gripY);
    ctx.lineTo(netCenterX, netCenterY - 10);
    ctx.stroke();

    // Pole highlight
    ctx.strokeStyle = '#A08060';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gripX - 1, gripY);
    ctx.lineTo(netCenterX - 1, netCenterY - 10);
    ctx.stroke();

    // === NET FRAME (oval hoop) ===
    ctx.strokeStyle = '#5a7a6a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(
      netCenterX,
      this.y + 15,
      this.width / 2,
      this.height / 2.5,
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();

    // === NET MESH ===
    ctx.strokeStyle = 'rgba(100, 180, 160, 0.6)';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let i = -3; i <= 3; i++) {
      const offsetX = i * (this.width / 7);
      ctx.beginPath();
      ctx.moveTo(netCenterX + offsetX, this.y);
      ctx.quadraticCurveTo(
        netCenterX + offsetX * 0.8,
        this.y + this.height * 0.6,
        netCenterX + offsetX * 0.3,
        this.y + this.height
      );
      ctx.stroke();
    }

    // Horizontal curves
    for (let i = 1; i <= 4; i++) {
      const curveY = this.y + (this.height * i) / 5;
      const widthAtY = this.width * (1 - i * 0.15);
      ctx.beginPath();
      ctx.ellipse(netCenterX, curveY, widthAtY / 2, 5, 0, 0, Math.PI);
      ctx.stroke();
    }

    // === GLOW EFFECT (subtle) ===
    ctx.strokeStyle = 'rgba(0, 212, 170, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(
      netCenterX,
      this.y + 15,
      this.width / 2 + 3,
      this.height / 2.5 + 3,
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();
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
