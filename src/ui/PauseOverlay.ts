/**
 * Pause Overlay
 *
 * Simple overlay when paused. Player can tap to resume.
 */

import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants';

// Button dimensions
const BTN_WIDTH = 200;
const BTN_HEIGHT = 48;
const BTN_RADIUS = 6;

export class PauseOverlay {
  private time: number = 0;

  // Button positions
  private resumeBtnY = GAME_HEIGHT * 0.52;
  private quitBtnY = GAME_HEIGHT * 0.66;

  update(delta: number): void {
    this.time += delta;
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Dim overlay
    ctx.fillStyle = 'rgba(10, 20, 30, 0.85)';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Paused text
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#00aa88';
    ctx.fillText('PAUSED', GAME_WIDTH / 2, GAME_HEIGHT * 0.35);

    // === RESUME BUTTON (Primary - bright) ===
    const resumeX = (GAME_WIDTH - BTN_WIDTH) / 2;

    // Button background
    ctx.fillStyle = 'rgba(0, 180, 140, 0.9)';
    ctx.beginPath();
    ctx.roundRect(resumeX, this.resumeBtnY, BTN_WIDTH, BTN_HEIGHT, BTN_RADIUS);
    ctx.fill();

    // Button border
    ctx.strokeStyle = '#00ffcc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(resumeX, this.resumeBtnY, BTN_WIDTH, BTN_HEIGHT, BTN_RADIUS);
    ctx.stroke();

    // Button text
    ctx.font = 'bold 20px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('RESUME', GAME_WIDTH / 2, this.resumeBtnY + BTN_HEIGHT / 2);

    // === QUIT BUTTON (Secondary - muted) ===
    const quitX = (GAME_WIDTH - BTN_WIDTH) / 2;

    // Button background
    ctx.fillStyle = 'rgba(60, 70, 75, 0.8)';
    ctx.beginPath();
    ctx.roundRect(quitX, this.quitBtnY, BTN_WIDTH, BTN_HEIGHT, BTN_RADIUS);
    ctx.fill();

    // Button border
    ctx.strokeStyle = 'rgba(120, 140, 135, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(quitX, this.quitBtnY, BTN_WIDTH, BTN_HEIGHT, BTN_RADIUS);
    ctx.stroke();

    // Button text
    ctx.font = '18px monospace';
    ctx.fillStyle = '#889090';
    ctx.fillText(
      'QUIT TO TITLE',
      GAME_WIDTH / 2,
      this.quitBtnY + BTN_HEIGHT / 2
    );
  }

  /**
   * Check if a canvas point is in the resume button
   */
  isInResumeButton(canvasX: number, canvasY: number): boolean {
    const btnX = (GAME_WIDTH - BTN_WIDTH) / 2;
    return (
      canvasX >= btnX &&
      canvasX <= btnX + BTN_WIDTH &&
      canvasY >= this.resumeBtnY &&
      canvasY <= this.resumeBtnY + BTN_HEIGHT
    );
  }

  /**
   * Check if a canvas point is in the quit button
   */
  isInQuitButton(canvasX: number, canvasY: number): boolean {
    const btnX = (GAME_WIDTH - BTN_WIDTH) / 2;
    return (
      canvasX >= btnX &&
      canvasX <= btnX + BTN_WIDTH &&
      canvasY >= this.quitBtnY &&
      canvasY <= this.quitBtnY + BTN_HEIGHT
    );
  }

  reset(): void {
    this.time = 0;
  }
}
