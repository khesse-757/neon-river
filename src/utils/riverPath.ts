/**
 * RiverPath - Utility functions for river path calculations
 *
 * The river path is defined as a cubic bezier curve.
 * t=0 is the spawn point (top), t=1 is the catch zone (bottom).
 */

import { RIVER_PATH, RIVER_WIDTH_START, RIVER_WIDTH_END } from './constants';

/**
 * Get a point on the river centerline at parameter t (0-1)
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
 * Get river width at parameter t (eased for natural perspective widening)
 */
export function getRiverWidth(t: number): number {
  const eased = t * t;
  return RIVER_WIDTH_START + (RIVER_WIDTH_END - RIVER_WIDTH_START) * eased;
}

/**
 * Get spawn position for new fish/eel
 */
export function getSpawnPosition(): {
  x: number;
  y: number;
  pathT: number;
  pathOffset: number;
} {
  const pathT = 0;
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
