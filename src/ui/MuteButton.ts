/**
 * MuteButton - Audio toggle button
 *
 * Displays speaker icon, toggles mute state on click.
 * Positioned top-left, next to pause button.
 */

import { audioManager } from '../audio/AudioManager';

// Button positioned to the right of pause button (pause is at x:15)
export const MUTE_BUTTON = {
  x: 60,
  y: 15,
  size: 36,
};

export class MuteButton {
  render(ctx: CanvasRenderingContext2D): void {
    const { x, y, size } = MUTE_BUTTON;
    const muted = audioManager.isMuted();

    // Button background
    ctx.fillStyle = 'rgba(40, 50, 45, 0.5)';
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Border
    ctx.strokeStyle = 'rgba(100, 120, 110, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.stroke();

    // Icon center
    const cx = x + size / 2;
    const cy = y + size / 2;

    // Speaker body
    ctx.fillStyle = muted
      ? 'rgba(100, 100, 100, 0.7)'
      : 'rgba(150, 180, 170, 0.7)';
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy - 3);
    ctx.lineTo(cx - 2, cy - 3);
    ctx.lineTo(cx + 3, cy - 7);
    ctx.lineTo(cx + 3, cy + 7);
    ctx.lineTo(cx - 2, cy + 3);
    ctx.lineTo(cx - 6, cy + 3);
    ctx.closePath();
    ctx.fill();

    if (muted) {
      // X through speaker when muted
      ctx.strokeStyle = 'rgba(255, 100, 100, 0.8)';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx + 5, cy - 5);
      ctx.lineTo(cx + 12, cy + 5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 12, cy - 5);
      ctx.lineTo(cx + 5, cy + 5);
      ctx.stroke();
    } else {
      // Sound waves when unmuted
      ctx.strokeStyle = 'rgba(150, 180, 170, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';

      // Small wave
      ctx.beginPath();
      ctx.arc(cx + 4, cy, 4, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();

      // Large wave
      ctx.beginPath();
      ctx.arc(cx + 4, cy, 8, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
    }
  }

  /**
   * Check if a canvas point is within the button
   */
  isClicked(canvasX: number, canvasY: number): boolean {
    const { x, y, size } = MUTE_BUTTON;
    const centerX = x + size / 2;
    const centerY = y + size / 2;
    const dx = canvasX - centerX;
    const dy = canvasY - centerY;
    return dx * dx + dy * dy <= (size / 2) * (size / 2);
  }

  /**
   * Handle click - toggle mute
   */
  handleClick(): void {
    audioManager.toggleMute();
  }
}
