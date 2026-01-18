/**
 * Collision Detection
 *
 * AABB (Axis-Aligned Bounding Box) collision detection utilities.
 */

import type { BoundingBox } from '../utils/types';

/**
 * Check if two bounding boxes overlap (AABB collision)
 */
export function checkCollision(a: BoundingBox, b: BoundingBox): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
