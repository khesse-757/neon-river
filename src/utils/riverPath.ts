/**
 * River Path - Shared bezier curve calculations for river flow
 *
 * Used by Water (for rendering) and fish entities (for movement).
 * The path goes from t=0 (source between hills) to t=1 (bottom of screen).
 */

import { GAME_WIDTH, GAME_HEIGHT } from './constants';

// River path control points (cubic bezier)
export const RIVER_PATH = {
  start: { x: GAME_WIDTH * 0.5, y: GAME_HEIGHT * 0.25 },
  cp1: { x: GAME_WIDTH * 0.58, y: GAME_HEIGHT * 0.35 },
  cp2: { x: GAME_WIDTH * 0.42, y: GAME_HEIGHT * 0.65 },
  end: { x: GAME_WIDTH * 0.5, y: GAME_HEIGHT * 1.05 },
};

// River width: narrow at source, wide at viewer
export const RIVER_WIDTH_START = 35;
export const RIVER_WIDTH_END = 200;

/**
 * Get a point on the river center line at parameter t (0-1)
 */
export function getRiverPoint(t: number): { x: number; y: number } {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  const t2 = t * t;
  const t3 = t2 * t;

  return {
    x:
      mt3 * RIVER_PATH.start.x +
      3 * mt2 * t * RIVER_PATH.cp1.x +
      3 * mt * t2 * RIVER_PATH.cp2.x +
      t3 * RIVER_PATH.end.x,
    y:
      mt3 * RIVER_PATH.start.y +
      3 * mt2 * t * RIVER_PATH.cp1.y +
      3 * mt * t2 * RIVER_PATH.cp2.y +
      t3 * RIVER_PATH.end.y,
  };
}

/**
 * Get river width at parameter t (eased for natural widening)
 */
export function getRiverWidth(t: number): number {
  const eased = t * t;
  return RIVER_WIDTH_START + (RIVER_WIDTH_END - RIVER_WIDTH_START) * eased;
}

/**
 * Get spawn position - at the river bend where fish emerge
 * Returns a position within the river at the spawn point
 */
export function getSpawnPosition(): { x: number; y: number; t: number } {
  // Spawn at t = 0 (river source between hills)
  const t = 0;
  const point = getRiverPoint(t);
  const width = getRiverWidth(t);

  // Random position within the river width
  const offset = (Math.random() - 0.5) * width * 0.6;

  return {
    x: point.x + offset,
    y: point.y,
    t,
  };
}
