/**
 * HUD - Heads Up Display
 *
 * Displays caught and missed weight in a stone tablet style
 * positioned at the bottom-left on the bridge area.
 */

import { GAME_HEIGHT, WIN_WEIGHT, MAX_MISSED_WEIGHT } from '../utils/constants';

export class HUD {
  render(ctx: CanvasRenderingContext2D, caught: number, missed: number): void {
    const hudX = 30;
    const hudY = GAME_HEIGHT - 120; // Bottom area, on bridge
    const hudWidth = 180;
    const hudHeight = 90;

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

    // "MISSED" label
    ctx.font = 'bold 18px monospace';
    ctx.fillStyle = '#a0b8a0';
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
}
