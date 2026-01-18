/**
 * Neon River - Main Entry Point
 *
 * A pixel art arcade fishing game.
 */

import {
  GAME_WIDTH,
  GAME_HEIGHT,
  PIXEL_SCALE,
  BOUNDS,
} from './utils/constants';
import { InputManager } from './input/InputManager';
import { Net } from './entities/Net';

function init(): void {
  // Remove loading screen
  const loading = document.getElementById('loading');
  if (loading) loading.remove();

  const app = document.getElementById('app');
  if (!app) return;

  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = GAME_WIDTH;
  canvas.height = GAME_HEIGHT;
  canvas.style.width = `${GAME_WIDTH * PIXEL_SCALE}px`;
  canvas.style.height = `${GAME_HEIGHT * PIXEL_SCALE}px`;
  app.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.imageSmoothingEnabled = false;

  // Create input manager and net
  const inputManager = new InputManager(canvas);
  const net = new Net();

  // Start game loop
  runGameLoop(ctx, inputManager, net);
}

function runGameLoop(
  ctx: CanvasRenderingContext2D,
  inputManager: InputManager,
  net: Net
): void {
  let lastTime = 0;

  function gameLoop(currentTime: number): void {
    const delta = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // Update net position from input
    const minX = BOUNDS.LEFT;
    const maxX = BOUNDS.RIGHT - net.width;
    net.setX(inputManager.getWorldX(minX, maxX));
    net.update(delta);

    // Render: clear background
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Render: draw title
    ctx.fillStyle = '#4ecdc4';
    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('NEON RIVER', GAME_WIDTH / 2, 40);

    // Render: draw net
    net.render(ctx);

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
