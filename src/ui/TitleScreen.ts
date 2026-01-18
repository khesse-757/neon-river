/**
 * Title Screen
 *
 * Shown when game first loads. Peaceful, sets the mood.
 */

import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants';

export class TitleScreen {
  private time: number = 0;

  update(delta: number): void {
    this.time += delta;
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Semi-transparent overlay (let background show through)
    ctx.fillStyle = 'rgba(10, 20, 30, 0.7)';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // === TITLE ===
    const titleY = GAME_HEIGHT * 0.3;

    // Title glow (subtle pulse)
    const glowAlpha = 0.3 + Math.sin(this.time * 2) * 0.1;
    ctx.fillStyle = `rgba(0, 200, 180, ${glowAlpha})`;
    ctx.font = 'bold 64px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NEON RIVER', GAME_WIDTH / 2 + 3, titleY + 3);

    // Title text with gradient
    const gradient = ctx.createLinearGradient(0, titleY - 30, 0, titleY + 30);
    gradient.addColorStop(0, '#00ffcc');
    gradient.addColorStop(0.5, '#00aa88');
    gradient.addColorStop(1, '#006655');
    ctx.fillStyle = gradient;
    ctx.fillText('NEON RIVER', GAME_WIDTH / 2, titleY);

    // === SUBTITLE ===
    ctx.font = '18px monospace';
    ctx.fillStyle = '#668888';
    ctx.fillText('A Zen Fishing Game', GAME_WIDTH / 2, titleY + 50);

    // === INSTRUCTIONS ===
    const instructY = GAME_HEIGHT * 0.55;
    ctx.font = '16px monospace';
    ctx.fillStyle = '#88aaaa';
    ctx.fillText('Catch fish to reach 200 lbs', GAME_WIDTH / 2, instructY);
    ctx.fillText('Avoid the electric eels', GAME_WIDTH / 2, instructY + 28);
    ctx.fillText("Don't let 20 lbs escape", GAME_WIDTH / 2, instructY + 56);

    // === START PROMPT (blinking) ===
    const blink = Math.sin(this.time * 3) > 0;
    if (blink) {
      ctx.font = 'bold 22px monospace';
      ctx.fillStyle = '#00d4aa';
      ctx.fillText('TAP TO START', GAME_WIDTH / 2, GAME_HEIGHT * 0.78);
    }

    // === CREDITS ===
    ctx.font = '12px monospace';
    ctx.fillStyle = '#445555';
    ctx.fillText(
      'Move net with mouse or touch',
      GAME_WIDTH / 2,
      GAME_HEIGHT * 0.92
    );
  }

  reset(): void {
    this.time = 0;
  }
}
