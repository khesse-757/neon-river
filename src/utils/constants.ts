/**
 * Game Constants - All balance values in one place
 */

// Canvas dimensions (match background image: 768x1376)
export const GAME_WIDTH = 768;
export const GAME_HEIGHT = 1376;

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

// Entity speeds (path units per second, where 1.0 = full path)
export const SPEEDS = {
  BLUEGILL: 0.12,
  GOLDEN_KOI: 0.18,
  ELECTRIC_EEL: 0.08,
} as const;

// River path control points (cubic bezier for river centerline)
// Based on background image river flow
export const RIVER_PATH = {
  // Pre-spawn point off-screen right (fish start here but aren't visible)
  preSpawn: { x: GAME_WIDTH * 0.85, y: GAME_HEIGHT * 0.18 },

  // Visible spawn point (where fish first appear on screen) - lowered into water
  start: { x: GAME_WIDTH * 0.58, y: GAME_HEIGHT * 0.26 },

  // Control points for the S-curve
  cp1: { x: GAME_WIDTH * 0.62, y: GAME_HEIGHT * 0.33 }, // Curves right
  cp2: { x: GAME_WIDTH * 0.38, y: GAME_HEIGHT * 0.55 }, // Curves back left

  // Catch zone
  end: { x: GAME_WIDTH * 0.5, y: GAME_HEIGHT * 0.74 },
} as const;

// Fish spawn at t=-0.15 (before visible path) and enter view around t=0
export const SPAWN_PATH_T = -0.15;

// River width at different points (narrow at top, wide at bottom)
export const RIVER_WIDTH_START = GAME_WIDTH * 0.1; // ~77px at spawn
export const RIVER_WIDTH_END = GAME_WIDTH * 0.45; // ~346px at catch zone

// Net settings (reduced 10% for balance)
export const NET_WIDTH = 90;
export const NET_HEIGHT = 45;
export const NET_Y = GAME_HEIGHT * 0.7; // Fixed Y position in water area
export const NET_MIN_X = GAME_WIDTH * 0.18;
export const NET_MAX_X = GAME_WIDTH * 0.82;

// Fish sprite scale (2x base size, grows as approaches)
export const FISH_BASE_SCALE = 2.0;

// Play area bounds
export const BOUNDS = {
  LEFT: GAME_WIDTH * 0.15,
  RIGHT: GAME_WIDTH * 0.85,
  SPAWN_Y: GAME_HEIGHT * 0.21,
  DESPAWN_Y: GAME_HEIGHT * 0.73, // Just past the net, before bridge
} as const;
