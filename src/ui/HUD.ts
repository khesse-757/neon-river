/**
 * HUD - Heads Up Display
 *
 * Displays caught and missed weight in a stone tablet style
 * positioned at the bottom-left on the bridge area.
 * Includes a subtle pause button in the top-left for mobile.
 */

import { GAME_HEIGHT, WIN_WEIGHT, MAX_MISSED_WEIGHT } from '../utils/constants';

// Pause button bounds (exported for hit testing)
export const PAUSE_BUTTON = {
  x: 15,
  y: 15,
  size: 36,
};

export class HUD {
  render(ctx: CanvasRenderingContext2D, caught: number, missed: number): void {
    // Render pause button first (top-left)
    this.renderPauseButton(ctx);
    const hudX = 30;
    const hudY = GAME_HEIGHT - 130; // Bottom area, on bridge
    const hudWidth = 180;
    const hudHeight = 100; // Taller to fit both sections

    // Stone tablet background
    ctx.fillStyle = 'rgba(60, 70, 65, 0.85)';
    ctx.fillRect(hudX, hudY, hudWidth, hudHeight);

    // Border (darker stone edge)
    ctx.strokeStyle = '#2a3530';
    ctx.lineWidth = 3;
    ctx.strokeRect(hudX, hudY, hudWidth, hudHeight);

    // Inner border highlight
    ctx.strokeStyle = 'rgba(100, 120, 110, 0.5)';
    ctx.lineWidth = 1;
    ctx.strokeRect(hudX + 4, hudY + 4, hudWidth - 8, hudHeight - 8);

    // Text styling - pixel font look
    ctx.font = 'bold 18px monospace';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';

    // "CAUGHT" label
    ctx.fillStyle = '#a0b8a0';
    ctx.fillText('CAUGHT', hudX + 12, hudY + 12);

    // Caught value (bright cyan when progressing)
    const caughtPercent = caught / WIN_WEIGHT;
    ctx.fillStyle = caughtPercent > 0.5 ? '#00d4aa' : '#70c8b8';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(`${caught}/${WIN_WEIGHT} lb`, hudX + 12, hudY + 32);

    // "MISSED" label (warning color - muted amber)
    ctx.font = 'bold 18px monospace';
    ctx.fillStyle = '#c4a060';
    ctx.fillText('MISSED', hudX + 12, hudY + 58);

    // Missed value (turns red as danger increases)
    const missedPercent = missed / MAX_MISSED_WEIGHT;
    if (missedPercent > 0.7) {
      ctx.fillStyle = '#ff6b6b';
    } else if (missedPercent > 0.4) {
      ctx.fillStyle = '#d4a44a';
    } else {
      ctx.fillStyle = '#70c8b8';
    }
    ctx.font = 'bold 22px monospace';
    ctx.fillText(`${missed}/${MAX_MISSED_WEIGHT} lb`, hudX + 12, hudY + 78);
  }

  /**
   * Render subtle pause button in top-left
   */
  private renderPauseButton(ctx: CanvasRenderingContext2D): void {
    const { x, y, size } = PAUSE_BUTTON;

    // Subtle circular background
    ctx.fillStyle = 'rgba(40, 50, 45, 0.5)';
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Subtle border
    ctx.strokeStyle = 'rgba(100, 120, 110, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.stroke();

    // Pause icon (two vertical bars)
    ctx.fillStyle = 'rgba(150, 180, 170, 0.7)';
    const barWidth = 5;
    const barHeight = 14;
    const gap = 4;
    const centerX = x + size / 2;
    const centerY = y + size / 2;

    // Left bar
    ctx.fillRect(
      centerX - gap / 2 - barWidth,
      centerY - barHeight / 2,
      barWidth,
      barHeight
    );
    // Right bar
    ctx.fillRect(
      centerX + gap / 2,
      centerY - barHeight / 2,
      barWidth,
      barHeight
    );
  }
}
