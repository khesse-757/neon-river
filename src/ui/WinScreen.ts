/**
 * Win Screen
 *
 * Celebration! Shows final stats, encourages replay.
 */

import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants';

// Button dimensions
const BTN_WIDTH = 200;
const BTN_HEIGHT = 48;
const BTN_RADIUS = 6;

export class WinScreen {
  private time: number = 0;
  private finalCaught: number = 0;
  private finalMissed: number = 0;

  show(caught: number, missed: number): void {
    this.time = 0;
    this.finalCaught = caught;
    this.finalMissed = missed;
  }

  update(delta: number): void {
    this.time += delta;
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Gentle overlay (let the peaceful scene show through more)
    const fadeIn = Math.min(1, this.time * 1.5);
    ctx.fillStyle = `rgba(10, 25, 30, ${0.75 * fadeIn})`;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    if (this.time < 0.4) return;

    const textAlpha = Math.min(1, (this.time - 0.4) * 2);

    // === VICTORY TEXT ===
    ctx.font = 'bold 48px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Gentle glow
    const glowAlpha = textAlpha * (0.3 + Math.sin(this.time * 2) * 0.1);
    ctx.fillStyle = `rgba(0, 255, 200, ${glowAlpha})`;
    ctx.fillText('VICTORY', GAME_WIDTH / 2 + 2, GAME_HEIGHT * 0.22 + 2);

    // Main text with gradient
    const gradient = ctx.createLinearGradient(
      0,
      GAME_HEIGHT * 0.22 - 25,
      0,
      GAME_HEIGHT * 0.22 + 25
    );
    gradient.addColorStop(0, `rgba(150, 255, 220, ${textAlpha})`);
    gradient.addColorStop(1, `rgba(50, 180, 140, ${textAlpha})`);
    ctx.fillStyle = gradient;
    ctx.fillText('VICTORY', GAME_WIDTH / 2, GAME_HEIGHT * 0.22);

    // === FLAVOR TEXT ===
    ctx.font = '18px monospace';
    ctx.fillStyle = `rgba(130, 180, 160, ${textAlpha})`;
    ctx.fillText('The river provides', GAME_WIDTH / 2, GAME_HEIGHT * 0.32);

    // === STATS BOX ===
    const boxX = GAME_WIDTH * 0.2;
    const boxY = GAME_HEIGHT * 0.4;
    const boxW = GAME_WIDTH * 0.6;
    const boxH = 130;

    ctx.fillStyle = `rgba(25, 45, 45, ${textAlpha * 0.9})`;
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = `rgba(60, 120, 110, ${textAlpha})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // Stats
    ctx.font = '18px monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = `rgba(150, 200, 180, ${textAlpha})`;
    ctx.fillText('Total catch:', boxX + 20, boxY + 35);
    ctx.fillText('Escaped:', boxX + 20, boxY + 65);
    ctx.fillText('Efficiency:', boxX + 20, boxY + 95);

    ctx.textAlign = 'right';
    ctx.fillStyle = `rgba(100, 255, 200, ${textAlpha})`;
    ctx.fillText(`${this.finalCaught} lbs`, boxX + boxW - 20, boxY + 35);

    ctx.fillStyle = `rgba(200, 180, 140, ${textAlpha})`;
    ctx.fillText(`${this.finalMissed} lbs`, boxX + boxW - 20, boxY + 65);

    // Efficiency rating
    const total = this.finalCaught + this.finalMissed;
    const efficiency =
      total > 0 ? Math.floor((this.finalCaught / total) * 100) : 100;
    let rating = '';
    let ratingColor = '';
    if (efficiency >= 95) {
      rating = 'Master';
      ratingColor = '255, 215, 0';
    } else if (efficiency >= 85) {
      rating = 'Expert';
      ratingColor = '180, 220, 200';
    } else if (efficiency >= 70) {
      rating = 'Skilled';
      ratingColor = '140, 180, 160';
    } else {
      rating = 'Novice';
      ratingColor = '120, 140, 130';
    }

    ctx.fillStyle = `rgba(${ratingColor}, ${textAlpha})`;
    ctx.fillText(rating, boxX + boxW - 20, boxY + 95);

    // Button positions
    const playBtnY = GAME_HEIGHT * 0.72;
    const quitBtnY = GAME_HEIGHT * 0.83;
    const btnX = (GAME_WIDTH - BTN_WIDTH) / 2;

    // === PLAY AGAIN BUTTON (Primary - bright, celebratory) ===
    if (this.time > 2) {
      // Button background (golden/celebratory tint)
      ctx.fillStyle = `rgba(0, 200, 160, ${textAlpha * 0.9})`;
      ctx.beginPath();
      ctx.roundRect(btnX, playBtnY, BTN_WIDTH, BTN_HEIGHT, BTN_RADIUS);
      ctx.fill();

      // Button border
      ctx.strokeStyle = `rgba(100, 255, 220, ${textAlpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(btnX, playBtnY, BTN_WIDTH, BTN_HEIGHT, BTN_RADIUS);
      ctx.stroke();

      // Button text
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(255, 255, 255, ${textAlpha})`;
      ctx.fillText('PLAY AGAIN', GAME_WIDTH / 2, playBtnY + BTN_HEIGHT / 2);
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

  canContinue(): boolean {
    return this.time > 2;
  }

  /**
   * Check if a canvas point is in the play again button
   */
  isInPlayButton(canvasX: number, canvasY: number): boolean {
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
