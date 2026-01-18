/**
 * Neon River - Main Entry Point
 *
 * A pixel art arcade fishing game.
 */

import { GAME_WIDTH, GAME_HEIGHT, PIXEL_SCALE } from './utils/constants';

// Hide loading screen when ready
function hideLoading(): void {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.classList.add('hidden');
  }
}

// Initialize the game
function init(): void {
  const app = document.getElementById('app');
  if (!app) {
    console.error('Could not find #app container');
    return;
  }

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
  canvas.style.width = `${GAME_WIDTH * PIXEL_SCALE}px`;
  canvas.style.height = `${GAME_HEIGHT * PIXEL_SCALE}px`;
  app.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Could not get 2D context');
    return;
  }

  // Disable image smoothing for crisp pixels
  ctx.imageSmoothingEnabled = false;

  // TODO: Initialize game systems
  // - Renderer
  // - Input manager
  // - Audio manager
  // - Scene
  // - Game state

  // For now, just show a placeholder
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  ctx.fillStyle = '#4ecdc4';
  ctx.font = '16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('NEON RIVER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20);
  ctx.fillStyle = '#666';
  ctx.font = '12px monospace';
  ctx.fillText('Phase 1: Foundation', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10);
  ctx.fillText(
    'See CLAUDE.md for next steps',
    GAME_WIDTH / 2,
    GAME_HEIGHT / 2 + 30
  );

  hideLoading();
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
