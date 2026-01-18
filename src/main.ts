/**
 * Neon River - Main Entry Point
 *
 * A pixel art arcade fishing game.
 */

import {
  GAME_WIDTH,
  GAME_HEIGHT,
  BOUNDS,
  WIN_WEIGHT,
  MAX_MISSED_WEIGHT,
} from './utils/constants';
import { InputManager } from './input/InputManager';
import { Net } from './entities/Net';
import { Spawner } from './game/Spawner';
import { checkCollision } from './game/Collision';
import { Background } from './scene/Background';
import { Water } from './scene/Water';

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
    const scaleX = window.innerWidth / GAME_WIDTH;
    const scaleY = window.innerHeight / GAME_HEIGHT;
    const scale = Math.min(scaleX, scaleY) * 0.95; // 95% to add small margin

    canvas.style.width = `${GAME_WIDTH * scale}px`;
    canvas.style.height = `${GAME_HEIGHT * scale}px`;
  }

  scaleCanvas();
  window.addEventListener('resize', scaleCanvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.imageSmoothingEnabled = false;

  // Create game systems
  const inputManager = new InputManager(canvas);
  const background = new Background();
  const water = new Water();
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

    // Always update water animation
    water.update(delta);

    // Update game logic (only when playing)
    if (gameState === 'playing') {
      timeElapsed += delta;

      // Update net position from input
      const minX = BOUNDS.LEFT;
      const maxX = BOUNDS.RIGHT - net.width;
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

    // Render (ctx is checked non-null before gameLoop is called)
    render(
      ctx!,
      gameState,
      background,
      water,
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
  background: Background,
  water: Water,
  net: Net,
  spawner: Spawner,
  caughtWeight: number,
  timeElapsed: number,
  wasShocked: boolean
): void {
  // 1. Draw background layers (sky, moon, stars, city, hills)
  background.render(ctx);

  // 2. Draw water (below hills, above fish)
  water.render(ctx);

  // Draw title
  ctx.fillStyle = '#4ecdc4';
  ctx.font = '16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('NEON RIVER', GAME_WIDTH / 2, 40);

  // 3. Draw fish and eels (they swim in the water)
  spawner.render(ctx);

  // 4. Draw net
  net.render(ctx);

  // Draw HUD
  ctx.font = '14px monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = '#4ecdc4';
  ctx.fillText(`Caught: ${caughtWeight}/${WIN_WEIGHT} lbs`, 10, 30);
  ctx.fillStyle = '#ff6b6b';
  ctx.fillText(
    `Missed: ${spawner.getMissedWeight()}/${MAX_MISSED_WEIGHT} lbs`,
    10,
    50
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

  // Title
  ctx.fillStyle = color;
  ctx.font = 'bold 32px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(title, GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60);

  // Stats
  ctx.fillStyle = '#ffffff';
  ctx.font = '16px monospace';
  ctx.fillText(
    `Fish caught: ${caughtWeight} lbs`,
    GAME_WIDTH / 2,
    GAME_HEIGHT / 2
  );
  ctx.fillText(
    `Time: ${Math.floor(timeElapsed)}s`,
    GAME_WIDTH / 2,
    GAME_HEIGHT / 2 + 30
  );

  // Restart prompt
  ctx.fillStyle = '#888888';
  ctx.font = '14px monospace';
  ctx.fillText('Click to play again', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 80);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
