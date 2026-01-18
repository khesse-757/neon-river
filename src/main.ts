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
import { Fisherman } from './scene/Fisherman';
import { ShockEffect } from './effects/ShockEffect';
import { HUD, PAUSE_BUTTON } from './ui/HUD';
import { TitleScreen } from './ui/TitleScreen';
import { PauseOverlay } from './ui/PauseOverlay';
import { GameOverScreen } from './ui/GameOverScreen';
import { WinScreen } from './ui/WinScreen';
import { MuteButton } from './ui/MuteButton';
import { audioManager } from './audio/AudioManager';

type GameState = 'title' | 'playing' | 'paused' | 'gameover' | 'win';

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
  const fisherman = new Fisherman();
  const net = new Net();
  const spawner = new Spawner();
  const shockEffect = new ShockEffect();
  const hud = new HUD();

  // Create UI screens
  const titleScreen = new TitleScreen();
  const pauseOverlay = new PauseOverlay();
  const gameOverScreen = new GameOverScreen();
  const winScreen = new WinScreen();
  const muteButton = new MuteButton();

  // Game state
  let gameState: GameState = 'title';
  let caughtWeight = 0;
  let pendingShock = false; // Waiting for shock effect before gameover
  let audioInitialized = false; // Track if Web Audio API is initialized

  // Initialize audio on first user interaction (required for mobile)
  async function ensureAudioInitialized(): Promise<void> {
    if (!audioInitialized) {
      await audioManager.init();
      audioInitialized = true;
    }
  }

  // Update cursor based on state
  function updateCursor(): void {
    if (gameState === 'playing') {
      canvas.style.cursor = 'none';
    } else {
      canvas.style.cursor = 'default';
    }
  }

  // Reset game to initial playing state
  function resetGame(): void {
    caughtWeight = 0;
    pendingShock = false;
    spawner.reset();
    net.reset();
  }

  // Start a new game
  function startGame(): void {
    gameState = 'playing';
    resetGame();
    updateCursor();
  }

  // Go to title screen
  function goToTitle(): void {
    gameState = 'title';
    titleScreen.reset();
    updateCursor();
  }

  // Pause the game
  function pauseGame(): void {
    gameState = 'paused';
    pauseOverlay.reset();
    updateCursor();
  }

  // Resume from pause
  function resumeGame(): void {
    gameState = 'playing';
    updateCursor();
  }

  // Trigger game over
  function triggerGameOver(cause: 'eel' | 'missed'): void {
    gameState = 'gameover';
    gameOverScreen.show(cause, caughtWeight, spawner.getMissedWeight());
    updateCursor();
  }

  // Trigger win
  function triggerWin(): void {
    gameState = 'win';
    winScreen.show(caughtWeight, spawner.getMissedWeight());
    updateCursor();
  }

  // Convert screen coordinates to canvas coordinates
  function screenToCanvas(
    screenX: number,
    screenY: number
  ): { x: number; y: number } {
    const rect = canvas.getBoundingClientRect();
    const scaleX = GAME_WIDTH / rect.width;
    const scaleY = GAME_HEIGHT / rect.height;
    return {
      x: (screenX - rect.left) * scaleX,
      y: (screenY - rect.top) * scaleY,
    };
  }

  // Check if point is inside pause button
  function isInsidePauseButton(canvasX: number, canvasY: number): boolean {
    const centerX = PAUSE_BUTTON.x + PAUSE_BUTTON.size / 2;
    const centerY = PAUSE_BUTTON.y + PAUSE_BUTTON.size / 2;
    const dx = canvasX - centerX;
    const dy = canvasY - centerY;
    return (
      dx * dx + dy * dy <= (PAUSE_BUTTON.size / 2) * (PAUSE_BUTTON.size / 2)
    );
  }

  // Handle tap/click input
  function handleTap(screenX?: number, screenY?: number): void {
    // Get canvas coordinates if screen coordinates provided
    let canvasX: number | undefined;
    let canvasY: number | undefined;
    if (screenX !== undefined && screenY !== undefined) {
      const coords = screenToCanvas(screenX, screenY);
      canvasX = coords.x;
      canvasY = coords.y;
    }

    // Check for mute button tap (available in all states except title)
    if (
      gameState !== 'title' &&
      canvasX !== undefined &&
      canvasY !== undefined
    ) {
      if (muteButton.isClicked(canvasX, canvasY)) {
        muteButton.handleClick();
        return;
      }
    }

    // Check for pause/play button tap during gameplay or pause
    if (
      (gameState === 'playing' || gameState === 'paused') &&
      canvasX !== undefined &&
      canvasY !== undefined
    ) {
      if (isInsidePauseButton(canvasX, canvasY)) {
        if (gameState === 'playing') {
          pauseGame();
        } else {
          resumeGame();
        }
        return;
      }
    }

    switch (gameState) {
      case 'title':
        startGame();
        break;
      case 'playing':
        // Tap during play is for net movement (handled by InputManager)
        break;
      case 'paused':
        if (canvasX !== undefined && canvasY !== undefined) {
          if (pauseOverlay.isInResumeButton(canvasX, canvasY)) {
            resumeGame();
            return;
          }
          if (pauseOverlay.isInQuitButton(canvasX, canvasY)) {
            goToTitle();
            return;
          }
        }
        break;
      case 'gameover':
        if (canvasX !== undefined && canvasY !== undefined) {
          if (
            gameOverScreen.canRetry() &&
            gameOverScreen.isInRetryButton(canvasX, canvasY)
          ) {
            startGame();
            return;
          }
          if (gameOverScreen.isInQuitButton(canvasX, canvasY)) {
            goToTitle();
            return;
          }
        }
        break;
      case 'win':
        if (canvasX !== undefined && canvasY !== undefined) {
          if (
            winScreen.canContinue() &&
            winScreen.isInPlayButton(canvasX, canvasY)
          ) {
            startGame();
            return;
          }
          if (winScreen.isInQuitButton(canvasX, canvasY)) {
            goToTitle();
            return;
          }
        }
        break;
    }
  }

  // Handle keyboard input
  function handleKey(e: KeyboardEvent): void {
    // Escape, P, or Space to pause/unpause
    if (e.key === 'Escape' || e.key === 'p' || e.key === 'P' || e.key === ' ') {
      if (gameState === 'playing') {
        e.preventDefault(); // Prevent space from scrolling
        pauseGame();
      } else if (gameState === 'paused') {
        e.preventDefault();
        resumeGame();
      }
    }

    // Q to quit to title
    if (e.key === 'q' || e.key === 'Q') {
      if (
        gameState === 'paused' ||
        gameState === 'gameover' ||
        gameState === 'win'
      ) {
        goToTitle();
      }
    }
  }

  // Set up input handlers
  canvas.addEventListener('click', (e) => {
    ensureAudioInitialized();
    handleTap(e.clientX, e.clientY);
  });
  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    ensureAudioInitialized();
    const touch = e.changedTouches[0];
    if (touch) {
      handleTap(touch.clientX, touch.clientY);
    } else {
      handleTap();
    }
  });
  window.addEventListener('keydown', (e) => {
    ensureAudioInitialized();
    handleKey(e);
  });

  // Start game loop
  let lastTime = 0;

  function gameLoop(currentTime: number): void {
    const delta = Math.min((currentTime - lastTime) / 1000, 0.1); // Cap delta to prevent large jumps
    lastTime = currentTime;

    // Update based on state
    switch (gameState) {
      case 'title':
        titleScreen.update(delta);
        break;

      case 'playing': {
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
            net.triggerCatch();
            audioManager.play('catch');
          }
        }

        // Check collisions with eels (instant death)
        if (!pendingShock) {
          for (const eel of spawner.getEels()) {
            if (checkCollision(netBox, eel.getBoundingBox())) {
              pendingShock = true;
              shockEffect.trigger(eel.x, eel.y);
              spawner.removeEel(eel);
              // Delay game over so effect plays
              setTimeout(() => {
                if (gameState === 'playing') {
                  triggerGameOver('eel');
                }
              }, 800);
              break;
            }
          }
        }

        // Update shock effect
        shockEffect.update(delta);

        // Check win/lose conditions (only if not pending shock)
        if (!pendingShock) {
          if (caughtWeight >= WIN_WEIGHT) {
            triggerWin();
          } else if (spawner.getMissedWeight() >= MAX_MISSED_WEIGHT) {
            triggerGameOver('missed');
          }
        }
        break;
      }

      case 'paused':
        pauseOverlay.update(delta);
        break;

      case 'gameover':
        gameOverScreen.update(delta);
        shockEffect.update(delta); // Keep updating shock effect
        break;

      case 'win':
        winScreen.update(delta);
        break;
    }

    // Render
    render();

    requestAnimationFrame(gameLoop);
  }

  function render(): void {
    if (!ctx) return;
    // Always render the background scene
    background.render(ctx);

    // Render game elements based on state
    if (gameState !== 'title') {
      // Draw net pole (behind fisherman)
      net.renderPole(ctx);

      // Draw fisherman
      fisherman.render(ctx);

      // Draw net head
      net.renderNetHead(ctx);

      // Draw fish and eels
      spawner.render(ctx);

      // Draw HUD (only during gameplay states)
      if (gameState === 'playing' || gameState === 'paused') {
        hud.render(ctx, caughtWeight, spawner.getMissedWeight());
      }

      // Draw shock effect
      shockEffect.render(ctx);
    } else {
      // On title screen, still show fisherman for atmosphere
      fisherman.render(ctx);
    }

    // Render UI overlays on top
    switch (gameState) {
      case 'title':
        titleScreen.render(ctx);
        break;
      case 'paused':
        pauseOverlay.render(ctx);
        break;
      case 'gameover':
        gameOverScreen.render(ctx);
        break;
      case 'win':
        winScreen.render(ctx);
        break;
    }

    // Render pause/mute buttons on top of overlays (during gameplay states)
    if (gameState === 'playing' || gameState === 'paused') {
      hud.renderPauseButton(ctx, gameState === 'paused'); // Show play icon when paused
      muteButton.render(ctx);
    }
  }

  // Initialize cursor state
  updateCursor();

  requestAnimationFrame(gameLoop);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
