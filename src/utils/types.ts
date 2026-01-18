/**
 * Shared TypeScript types for Neon River
 */

// Sprite System
export type PixelGrid = number[][];
export type ColorPalette = Record<number, string>;

export interface AnimationConfig {
  frameRate: number; // frames per second
  loop: boolean;
}

export interface SpriteDefinition {
  name: string;
  width: number;
  height: number;
  frames: PixelGrid[];
  palette: ColorPalette;
  animation?: AnimationConfig;
}

// Game Entities
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Entity {
  x: number;
  y: number;
  width: number;
  height: number;
  update(delta: number): void;
  render(ctx: CanvasRenderingContext2D): void;
  getBoundingBox(): BoundingBox;
}

export interface FishEntity extends Entity {
  weight: number;
  points: number;
  type: 'bluegill' | 'goldenKoi';
}

export interface HazardEntity extends Entity {
  type: 'electricEel';
}

// Game State
export type GameState = 'menu' | 'playing' | 'paused' | 'gameover' | 'win';

export interface GameStats {
  weightCaught: number;
  weightMissed: number;
  fishCaught: number;
  koiCaught: number;
  timeElapsed: number;
}

// Input
export interface InputState {
  x: number; // Normalized 0-1
  active: boolean;
}

// Layers
export interface Layer {
  update(delta: number): void;
  render(ctx: CanvasRenderingContext2D): void;
}
