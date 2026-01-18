/**
 * Game Over Screen
 *
 * Shows stats, reason for loss, retry option.
 */

import { GAME_WIDTH, GAME_HEIGHT, WIN_WEIGHT } from '../utils/constants';

// Button dimensions
const BTN_WIDTH = 200;
const BTN_HEIGHT = 48;
const BTN_RADIUS = 6;

export class GameOverScreen {
  private time: number = 0;
  private causeOfDeath: 'eel' | 'missed' = 'missed';
  private finalCaught: number = 0;
  private finalMissed: number = 0;

  show(cause: 'eel' | 'missed', caught: number, missed: number): void {
    this.time = 0;
    this.causeOfDeath = cause;
    this.finalCaught = caught;
    this.finalMissed = missed;
  }

  update(delta: number): void {
    this.time += delta;
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
}
