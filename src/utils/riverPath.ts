/**
 * RiverPath - Utility functions for river path calculations
 *
 * The river path is defined as a cubic bezier curve.
 * t < 0: Pre-spawn area (interpolate from preSpawn to start)
 * t = 0: Visible spawn point (top of river in view)
 * t = 1: Catch zone (bottom)
 */

import {
  RIVER_PATH,
  RIVER_WIDTH_START,
  RIVER_WIDTH_END,
  SPAWN_PATH_T,
} from './constants';

/**
 * Get a point on the river centerline at parameter t
 * t < 0: Linear interpolation from preSpawn to start
 * t >= 0: Cubic bezier curve from start to end
 */
export function getRiverPoint(t: number): { x: number; y: number } {
  // Handle pre-spawn region (t < 0)
  if (t < 0) {
    // Normalize t from [SPAWN_PATH_T, 0] to [0, 1]
    const preT = t / SPAWN_PATH_T; // 1 at spawn, 0 at start
    return {
      x: RIVER_PATH.preSpawn.x * preT + RIVER_PATH.start.x * (1 - preT),
      y: RIVER_PATH.preSpawn.y * preT + RIVER_PATH.start.y * (1 - preT),
    };
  }

  // Standard bezier for t >= 0
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
 * Get river width at parameter t (eased for natural perspective widening)
 * For t < 0, use the start width
 */
export function getRiverWidth(t: number): number {
  if (t < 0) {
    return RIVER_WIDTH_START;
  }
  const eased = t * t;
  return RIVER_WIDTH_START + (RIVER_WIDTH_END - RIVER_WIDTH_START) * eased;
}

/**
 * Get spawn position for new fish/eel
 * Fish spawn at SPAWN_PATH_T (before visible area) and swim into view
 */
export function getSpawnPosition(): {
  x: number;
  y: number;
  pathT: number;
  pathOffset: number;
} {
  const pathT = SPAWN_PATH_T;
  const point = getRiverPoint(pathT);
  const width = getRiverWidth(pathT);

  // Random lateral offset within river (-0.8 to 0.8)
  const pathOffset = (Math.random() - 0.5) * 1.6;
  const x = point.x + pathOffset * width * 0.4;

  return {
    x,
    y: point.y,
    pathT,
    pathOffset,
  };
}
