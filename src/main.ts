/**
 * Neon River - Main Entry Point
 *
 * A pixel art arcade fishing game.
 */

import {
  GAME_WIDTH,
  GAME_HEIGHT,
  NET_MIN_X,
  NET_MAX_X,
  WIN_WEIGHT,
  MAX_MISSED_WEIGHT,
} from './utils/constants';
import { InputManager } from './input/InputManager';
import { Net } from './entities/Net';
import { Spawner } from './game/Spawner';
import { checkCollision } from './game/Collision';
import { BackgroundImage } from './scene/BackgroundImage';

type GameState = 'playing' | 'win' | 'lose';

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
  app.appendChild(canvas);

  // Scale canvas to fill viewport while maintaining aspect ratio
  function scaleCanvas(): void {
    const gameRatio = GAME_WIDTH / GAME_HEIGHT;
    const windowRatio = window.innerWidth / window.innerHeight;

    let displayWidth: number;
    let displayHeight: number;

    if (windowRatio > gameRatio) {
      // Window wider than game - fit to height
      displayHeight = window.innerHeight * 0.98;
      displayWidth = displayHeight * gameRatio;
    } else {
      // Window taller than game - fit to width
      displayWidth = window.innerWidth * 0.98;
      displayHeight = displayWidth / gameRatio;
    }

    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
  }

  scaleCanvas();
  window.addEventListener('resize', scaleCanvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.imageSmoothingEnabled = false;

  // Create game systems
  const inputManager = new InputManager(canvas);
  const background = new BackgroundImage();
  const net = new Net();
  const spawner = new Spawner();

  // Game state
  let gameState: GameState = 'playing';
  let caughtWeight = 0;
  let timeElapsed = 0;
  let wasShocked = false;

  // Click to restart handler
  canvas.addEventListener('click', () => {
    if (gameState === 'win' || gameState === 'lose') {
      // Reset game
      gameState = 'playing';
      caughtWeight = 0;
      timeElapsed = 0;
      wasShocked = false;
      spawner.reset();
    }
  });

  // Start game loop
  let lastTime = 0;

  function gameLoop(currentTime: number): void {
    const delta = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // Update game logic (only when playing)
    if (gameState === 'playing') {
      timeElapsed += delta;

      // Update net position from input
      const minX = NET_MIN_X;
      const maxX = NET_MAX_X - net.width;
      net.setX(inputManager.getWorldX(minX, maxX));
      net.update(delta);

      // Update spawner
      spawner.update(delta);

      // Check collisions with fish
      const netBox = net.getBoundingBox();
      for (const fish of spawner.getEntities()) {
        if (checkCollision(netBox, fish.getBoundingBox())) {
          caughtWeight += fish.weight;
          spawner.removeFish(fish);
        }
      }

      // Check collisions with eels (instant death)
      for (const eel of spawner.getEels()) {
        if (checkCollision(netBox, eel.getBoundingBox())) {
          wasShocked = true;
          gameState = 'lose';
          break;
        }
      }

      // Check win/lose conditions (only if not already shocked)
      if (gameState === 'playing') {
        if (caughtWeight >= WIN_WEIGHT) {
          gameState = 'win';
        } else if (spawner.getMissedWeight() >= MAX_MISSED_WEIGHT) {
          gameState = 'lose';
        }
      }
    }

    // Render
    render(
      ctx!,
      gameState,
      background,
      net,
      spawner,
      caughtWeight,
      timeElapsed,
      wasShocked
    );

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
}

function render(
  ctx: CanvasRenderingContext2D,
  gameState: GameState,
  background: BackgroundImage,
  net: Net,
  spawner: Spawner,
  caughtWeight: number,
  timeElapsed: number,
  wasShocked: boolean
): void {
  // 1. Draw background image (entire scene)
  background.render(ctx);

  // 2. Draw fish and eels (they swim in the water)
  spawner.render(ctx);

  // 3. Draw net
  net.render(ctx);

  // 4. Draw HUD (scaled for larger canvas)
  ctx.font = '24px monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#4ecdc4';
  ctx.fillText(`Caught: ${caughtWeight}/${WIN_WEIGHT} lbs`, 20, 50);
  ctx.fillStyle = '#ff6b6b';
  ctx.fillText(
    `Missed: ${spawner.getMissedWeight()}/${MAX_MISSED_WEIGHT} lbs`,
    20,
    85
  );

  // Draw win/lose overlay
  if (gameState === 'win') {
    drawEndScreen(ctx, 'YOU WIN!', '#4ecdc4', caughtWeight, timeElapsed);
  } else if (gameState === 'lose') {
    const title = wasShocked ? 'SHOCKED!' : 'GAME OVER';
    const color = wasShocked ? '#00ffff' : '#ff6b6b';
    drawEndScreen(ctx, title, color, caughtWeight, timeElapsed);
  }
}

function drawEndScreen(
  ctx: CanvasRenderingContext2D,
  title: string,
  color: string,
  caughtWeight: number,
  timeElapsed: number
): void {
  // Semi-transparent overlay
  ctx.fillStyle = 'rgba(10, 10, 26, 0.85)';
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  // Title (scaled for larger canvas)
  ctx.fillStyle = color;
  ctx.font = 'bold 56px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(title, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 100);

  // Stats
  ctx.fillStyle = '#ffffff';
  ctx.font = '28px monospace';
  ctx.fillText(
    `Fish caught: ${caughtWeight} lbs`,
    GAME_WIDTH / 2,
    GAME_HEIGHT / 2
  );
  ctx.fillText(
    `Time: ${Math.floor(timeElapsed)}s`,
    GAME_WIDTH / 2,
    GAME_HEIGHT / 2 + 50
  );

  // Restart prompt
  ctx.fillStyle = '#888888';
  ctx.font = '24px monospace';
  ctx.fillText('Click to play again', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 130);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
