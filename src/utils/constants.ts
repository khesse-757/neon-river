/**
 * Game Constants - All balance values in one place
 */

// Canvas dimensions
export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 640;
export const PIXEL_SCALE = 2;

// Game rules
export const WIN_WEIGHT = 200;
export const MAX_MISSED_WEIGHT = 20;

// Entity weights (lbs)
export const BLUEGILL_WEIGHT = 1;
export const GOLDEN_KOI_WEIGHT = 5;

// Spawn settings
export const INITIAL_SPAWN_INTERVAL = 2.0; // seconds
export const MIN_SPAWN_INTERVAL = 0.5; // seconds
export const SPAWN_ACCELERATION = 0.98; // multiply interval by this each spawn

// Spawn probabilities (must sum to 1.0)
export const SPAWN_WEIGHTS = {
  BLUEGILL: 0.7,
  GOLDEN_KOI: 0.2,
  ELECTRIC_EEL: 0.1,
} as const;

// Entity speeds (pixels per second)
export const SPEEDS = {
  BLUEGILL: 60,
  GOLDEN_KOI: 100,
  ELECTRIC_EEL: 40,
} as const;

// Net settings
export const NET_WIDTH = 48;
export const NET_HEIGHT = 32;
export const NET_Y = GAME_HEIGHT - 100; // Position from top

// Play area bounds
export const BOUNDS = {
  LEFT: 40,
  RIGHT: GAME_WIDTH - 40,
  SPAWN_Y: -40, // Above screen
  DESPAWN_Y: GAME_HEIGHT + 40, // Below screen
} as const;
