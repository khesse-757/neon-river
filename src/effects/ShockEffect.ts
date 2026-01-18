/**
 * ShockEffect - Subtle eel shock visual
 *
 * Zen-style effect: soft tint, small sparks, gentle glow.
 * No dramatic flash or text - just a quiet "mistake" moment.
 */

import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants';

interface Spark {
  x: number;
  y: number;
  angle: number;
  length: number;
  life: number;
  maxLife: number;
}

export class ShockEffect {
  private active: boolean = false;
  private timer: number = 0;
  private duration: number = 0.8;

  private tintAlpha: number = 0;
  private sparks: Spark[] = [];
  private eelX: number = 0;
  private eelY: number = 0;

  trigger(eelX: number, eelY: number): void {
    this.active = true;
    this.timer = 0;
    this.eelX = eelX;
    this.eelY = eelY;
    this.tintAlpha = 0.3;

    // Small sparks around eel - fewer, shorter
    this.sparks = [];
    for (let i = 0; i < 8; i++) {
      this.sparks.push({
        x: eelX + (Math.random() - 0.5) * 30,
        y: eelY + (Math.random() - 0.5) * 20,
        angle: Math.random() * Math.PI * 2,
        length: 10 + Math.random() * 15,
        life: 0.2 + Math.random() * 0.3,
        maxLife: 0.2 + Math.random() * 0.3,
      });
    }
  }

  update(delta: number): void {
    if (!this.active) return;

    this.timer += delta;

    // Tint fades gently
    this.tintAlpha = Math.max(0, 0.3 - this.timer * 0.5);

    // Update sparks
    for (const spark of this.sparks) {
      spark.life -= delta;
    }
    this.sparks = this.sparks.filter((s) => s.life > 0);

    if (this.timer >= this.duration) {
      this.active = false;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.active) return;

    // === SUBTLE SCREEN TINT (pale cyan, not white flash) ===
    if (this.tintAlpha > 0) {
      ctx.fillStyle = `rgba(150, 200, 210, ${this.tintAlpha})`;
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }

    // === SMALL ELECTRIC SPARKS around eel ===
    for (const spark of this.sparks) {
      const alpha = spark.life / spark.maxLife;
      const endX = spark.x + Math.cos(spark.angle) * spark.length;
      const endY = spark.y + Math.sin(spark.angle) * spark.length;

      // Spark glow (soft cyan)
      ctx.strokeStyle = `rgba(100, 220, 230, ${alpha * 0.4})`;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(spark.x, spark.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();

      // Spark core (white)
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(spark.x, spark.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    // === EEL HIGHLIGHT (subtle glow around where it was) ===
    if (this.timer < 0.4) {
      const alpha = 0.3 * (1 - this.timer / 0.4);
      const gradient = ctx.createRadialGradient(
        this.eelX,
        this.eelY,
        0,
        this.eelX,
        this.eelY,
        50
      );
      gradient.addColorStop(0, `rgba(100, 200, 220, ${alpha})`);
      gradient.addColorStop(1, 'rgba(100, 200, 220, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.eelX, this.eelY, 50, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  isActive(): boolean {
    return this.active;
  }
}
