/**
 * Game Over Screen
 *
 * Shows stats, reason for loss, retry option.
 */

import { GAME_WIDTH, GAME_HEIGHT, WIN_WEIGHT } from '../utils/constants';
import { ELECTRIC_EEL } from '../assets/sprites';
import { SpriteRenderer } from '../renderer/SpriteRenderer';

// Button dimensions
const BTN_WIDTH = 200;
const BTN_HEIGHT = 48;
const BTN_RADIUS = 6;

// Eel display settings
const EEL_SCALE = 5;

export class GameOverScreen {
  private time: number = 0;
  private causeOfDeath: 'eel' | 'missed' = 'missed';
  private finalCaught: number = 0;
  private finalMissed: number = 0;

  // Animated eel display
  private eelRenderer: SpriteRenderer;
  private sparkPhase: number = 0;
  private sparkTimer: number = 0;

  constructor() {
    this.eelRenderer = new SpriteRenderer(ELECTRIC_EEL);
  }

  show(cause: 'eel' | 'missed', caught: number, missed: number): void {
    this.time = 0;
    this.causeOfDeath = cause;
    this.finalCaught = caught;
    this.finalMissed = missed;
  }

  update(delta: number): void {
    this.time += delta;

    // Animate eel sprite and sparks
    this.eelRenderer.update(delta);
    this.sparkTimer += delta;
    if (this.sparkTimer >= 0.15) {
      this.sparkTimer = 0;
      this.sparkPhase = (this.sparkPhase + 1) % 4;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Fade in overlay
    const fadeIn = Math.min(1, this.time * 2);
    ctx.fillStyle = `rgba(15, 10, 20, ${0.85 * fadeIn})`;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    if (this.time < 0.3) return; // Brief delay before showing text

    const textAlpha = Math.min(1, (this.time - 0.3) * 3);

    // === GAME OVER TEXT ===
    ctx.font = 'bold 52px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = `rgba(200, 80, 80, ${textAlpha})`;
    ctx.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT * 0.25);

    // === CAUSE OF DEATH ===
    ctx.font = '20px monospace';
    if (this.causeOfDeath === 'eel') {
      ctx.fillStyle = `rgba(100, 200, 220, ${textAlpha})`;
      ctx.fillText('Shocked by an eel', GAME_WIDTH / 2, GAME_HEIGHT * 0.35);
    } else {
      ctx.fillStyle = `rgba(180, 140, 100, ${textAlpha})`;
      ctx.fillText('Too many fish escaped', GAME_WIDTH / 2, GAME_HEIGHT * 0.35);
    }

    // === STATS BOX ===
    const boxX = GAME_WIDTH * 0.2;
    const boxY = GAME_HEIGHT * 0.43;
    const boxW = GAME_WIDTH * 0.6;
    const boxH = 120;

    // Box background
    ctx.fillStyle = `rgba(30, 40, 45, ${textAlpha * 0.9})`;
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = `rgba(60, 80, 80, ${textAlpha})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // Stats text
    ctx.font = '18px monospace';
    ctx.textAlign = 'left';

    ctx.fillStyle = `rgba(150, 200, 180, ${textAlpha})`;
    ctx.fillText('Caught:', boxX + 20, boxY + 35);
    ctx.fillText('Missed:', boxX + 20, boxY + 65);
    ctx.fillText('Progress:', boxX + 20, boxY + 95);

    ctx.textAlign = 'right';
    ctx.fillStyle = `rgba(100, 220, 200, ${textAlpha})`;
    ctx.fillText(`${this.finalCaught} lbs`, boxX + boxW - 20, boxY + 35);

    ctx.fillStyle = `rgba(220, 150, 100, ${textAlpha})`;
    ctx.fillText(`${this.finalMissed} lbs`, boxX + boxW - 20, boxY + 65);

    const progress = Math.floor((this.finalCaught / WIN_WEIGHT) * 100);
    ctx.fillStyle = `rgba(180, 180, 180, ${textAlpha})`;
    ctx.fillText(`${progress}%`, boxX + boxW - 20, boxY + 95);

    // === ANIMATED EEL (only for eel death) ===
    if (this.causeOfDeath === 'eel' && this.time > 0.5) {
      const eelAlpha = Math.min(1, (this.time - 0.5) * 2);
      const retryBtnY = GAME_HEIGHT * 0.72;
      const eelHeight = ELECTRIC_EEL.height * EEL_SCALE;
      // Center eel between stats box bottom and retry button top
      const gapStart = boxY + boxH;
      const gapEnd = retryBtnY;
      const eelY = gapStart + (gapEnd - gapStart - eelHeight) / 2;
      const eelX = GAME_WIDTH / 2 - (ELECTRIC_EEL.width * EEL_SCALE) / 2;

      // Draw sparks behind the eel
      this.renderEelSparks(ctx, eelX, eelY, eelAlpha);

      // Draw the eel sprite
      ctx.globalAlpha = eelAlpha;
      this.eelRenderer.draw(ctx, {
        x: eelX,
        y: eelY,
        scale: EEL_SCALE,
      });
      ctx.globalAlpha = 1;
    }

    // Button positions
    const retryBtnY = GAME_HEIGHT * 0.72;
    const quitBtnY = GAME_HEIGHT * 0.83;
    const btnX = (GAME_WIDTH - BTN_WIDTH) / 2;

    // === RETRY BUTTON (Primary - bright) ===
    if (this.time > 1.5) {
      // Button background
      ctx.fillStyle = `rgba(0, 180, 140, ${textAlpha * 0.9})`;
      ctx.beginPath();
      ctx.roundRect(btnX, retryBtnY, BTN_WIDTH, BTN_HEIGHT, BTN_RADIUS);
      ctx.fill();

      // Button border
      ctx.strokeStyle = `rgba(0, 255, 200, ${textAlpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(btnX, retryBtnY, BTN_WIDTH, BTN_HEIGHT, BTN_RADIUS);
      ctx.stroke();

      // Button text
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(255, 255, 255, ${textAlpha})`;
      ctx.fillText('TRY AGAIN', GAME_WIDTH / 2, retryBtnY + BTN_HEIGHT / 2);
    }

    // === QUIT BUTTON (Secondary - muted) ===
    // Button background
    ctx.fillStyle = `rgba(60, 70, 75, ${textAlpha * 0.8})`;
    ctx.beginPath();
    ctx.roundRect(btnX, quitBtnY, BTN_WIDTH, BTN_HEIGHT, BTN_RADIUS);
    ctx.fill();

    // Button border
    ctx.strokeStyle = `rgba(120, 140, 135, ${textAlpha * 0.6})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(btnX, quitBtnY, BTN_WIDTH, BTN_HEIGHT, BTN_RADIUS);
    ctx.stroke();

    // Button text
    ctx.font = '18px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = `rgba(136, 144, 144, ${textAlpha})`;
    ctx.fillText('QUIT TO TITLE', GAME_WIDTH / 2, quitBtnY + BTN_HEIGHT / 2);
  }

  canRetry(): boolean {
    return this.time > 1.5;
  }

  /**
   * Check if a canvas point is in the retry button
   */
  isInRetryButton(canvasX: number, canvasY: number): boolean {
    const btnY = GAME_HEIGHT * 0.72;
    const btnX = (GAME_WIDTH - BTN_WIDTH) / 2;
    return (
      canvasX >= btnX &&
      canvasX <= btnX + BTN_WIDTH &&
      canvasY >= btnY &&
      canvasY <= btnY + BTN_HEIGHT
    );
  }

  /**
   * Check if a canvas point is in the quit button
   */
  isInQuitButton(canvasX: number, canvasY: number): boolean {
    const btnY = GAME_HEIGHT * 0.83;
    const btnX = (GAME_WIDTH - BTN_WIDTH) / 2;
    return (
      canvasX >= btnX &&
      canvasX <= btnX + BTN_WIDTH &&
      canvasY >= btnY &&
      canvasY <= btnY + BTN_HEIGHT
    );
  }

  /**
   * Render electric sparks around the display eel
   */
  private renderEelSparks(
    ctx: CanvasRenderingContext2D,
    eelX: number,
    eelY: number,
    alpha: number
  ): void {
    const eelWidth = ELECTRIC_EEL.width * EEL_SCALE;
    const eelHeight = ELECTRIC_EEL.height * EEL_SCALE;
    const centerX = eelX + eelWidth / 2;
    const centerY = eelY + eelHeight / 2;
    const pixelSize = Math.floor(EEL_SCALE);

    // Spark colors
    const colors = ['#ffff44', '#44ffff', '#ffff88', '#88ffff'];

    // Spark positions based on phase
    const sparkSets = [
      [
        { ox: -eelWidth * 0.35, oy: -eelHeight * 0.5 },
        { ox: eelWidth * 0.15, oy: eelHeight * 0.6 },
        { ox: eelWidth * 0.4, oy: -eelHeight * 0.4 },
      ],
      [
        { ox: -eelWidth * 0.15, oy: eelHeight * 0.5 },
        { ox: eelWidth * 0.35, oy: -eelHeight * 0.6 },
        { ox: -eelWidth * 0.4, oy: eelHeight * 0.3 },
      ],
      [
        { ox: eelWidth * 0.0, oy: -eelHeight * 0.55 },
        { ox: eelWidth * 0.45, oy: eelHeight * 0.4 },
        { ox: -eelWidth * 0.3, oy: -eelHeight * 0.3 },
      ],
      [
        { ox: -eelWidth * 0.25, oy: eelHeight * 0.4 },
        { ox: eelWidth * 0.25, oy: -eelHeight * 0.5 },
        { ox: eelWidth * 0.5, oy: eelHeight * 0.2 },
      ],
    ];

    const sparks = sparkSets[this.sparkPhase];
    if (!sparks) return;

    ctx.globalAlpha = alpha;

    for (let i = 0; i < sparks.length; i++) {
      const spark = sparks[i];
      if (!spark) continue;

      const sx = centerX + spark.ox;
      const sy = centerY + spark.oy;
      const color = colors[(i + this.sparkPhase) % colors.length] ?? '#ffff44';

      ctx.fillStyle = color;

      // Draw zigzag lightning bolt
      ctx.fillRect(sx, sy, pixelSize, pixelSize);
      ctx.fillRect(sx + pixelSize, sy + pixelSize, pixelSize, pixelSize);
      ctx.fillRect(sx, sy + pixelSize * 2, pixelSize, pixelSize);
      if (this.sparkPhase % 2 === 0) {
        ctx.fillRect(sx + pixelSize, sy + pixelSize * 3, pixelSize, pixelSize);
      }
    }

    ctx.globalAlpha = 1;
  }
}
