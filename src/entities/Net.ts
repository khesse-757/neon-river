/**
 * Net Entity
 *
 * Player-controlled net for catching fish.
 * Moves horizontally based on input, fixed Y position.
 * Features a pole connecting to the fisherman's hand position.
 *
 * Rendering is split into pole (behind fisherman) and net head (in front).
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

  // Wobble animation for catch effect
  private meshWobble: number = 0;
  private wobbleDecay: number = 0.92;

  constructor(initialX: number = GAME_WIDTH / 2 - NET_WIDTH / 2) {
    this.x = initialX;
    this.y = NET_Y;
    this.targetX = initialX;
  }

  /**
   * Trigger catch animation - mesh wobbles
   */
  triggerCatch(): void {
    this.meshWobble = 1.0;
  }

  /**
   * Set the net's horizontal position (with smoothing)
   */
  setX(x: number): void {
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

    // Decay the wobble over time
    if (this.meshWobble > 0.01) {
      this.meshWobble *= this.wobbleDecay;
    } else {
      this.meshWobble = 0;
    }

    void delta;
  }

  /**
   * Render the pole - call BEFORE fisherman sprite
   */
  renderPole(ctx: CanvasRenderingContext2D): void {
    const gripX = GAME_WIDTH * 0.72;
    const gripY = GAME_HEIGHT * 0.92;

    const netCenterX = this.x + this.width / 2;
    const netCenterY = this.y + 10;

    // Pole shadow
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(gripX + 3, gripY + 3);
    ctx.lineTo(netCenterX + 3, netCenterY + 3);
    ctx.stroke();

    // Main pole
    ctx.strokeStyle = '#8B7355';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(gripX, gripY);
    ctx.lineTo(netCenterX, netCenterY);
    ctx.stroke();

    // Pole highlight
    ctx.strokeStyle = '#A08060';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gripX - 1, gripY - 1);
    ctx.lineTo(netCenterX - 1, netCenterY - 1);
    ctx.stroke();
  }

  /**
   * Render the net head (hoop + mesh) - call AFTER fisherman sprite
   */
  renderNetHead(ctx: CanvasRenderingContext2D): void {
    const netCenterX = this.x + this.width / 2;
    const time = performance.now() * 0.015;

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

    // === NET MESH with wobble ===
    ctx.strokeStyle = 'rgba(100, 180, 160, 0.6)';
    ctx.lineWidth = 1;

    // Vertical mesh lines - wobble when catching
    for (let i = -3; i <= 3; i++) {
      const offsetX = i * (this.width / 7);
      const wobbleOffset = this.meshWobble * Math.sin(time + i * 1.5) * 8;

      ctx.beginPath();
      ctx.moveTo(netCenterX + offsetX, this.y);
      ctx.quadraticCurveTo(
        netCenterX + offsetX * 0.8 + wobbleOffset,
        this.y + this.height * 0.6,
        netCenterX + offsetX * 0.3,
        this.y + this.height
      );
      ctx.stroke();
    }

    // Horizontal curves - also wobble
    for (let i = 1; i <= 4; i++) {
      const curveY = this.y + (this.height * i) / 5;
      const widthAtY = this.width * (1 - i * 0.15);
      const wobbleY = this.meshWobble * Math.sin(time + i * 2) * 4;

      ctx.beginPath();
      ctx.ellipse(netCenterX, curveY + wobbleY, widthAtY / 2, 5, 0, 0, Math.PI);
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
   * Render the full net (pole + head) - for backward compatibility
   */
  render(ctx: CanvasRenderingContext2D): void {
    this.renderPole(ctx);
    this.renderNetHead(ctx);
  }

  /**
   * Get bounding box for collision detection
   * Only the front opening of the net (top 35%) is the hitbox
   */
  getBoundingBox(): BoundingBox {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height * 0.35,
    };
  }

  /**
   * Reset net to initial state
   */
  reset(): void {
    this.x = GAME_WIDTH / 2 - this.width / 2;
    this.targetX = this.x;
    this.meshWobble = 0;
  }
}
