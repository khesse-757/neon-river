/**
 * Bluegill Fish Sprite
 *
 * Common fish worth 1 lb. Medium speed, predictable path.
 *
 * Size: 16x12 pixels
 * Animation: 2 frames (tail wag)
 */

import type { SpriteDefinition } from '../../utils/types';
import { BLUEGILL_PALETTE } from '../palettes/fish';

// Pixel grid: 0=transparent, 1-7=palette colors
// Grid reads left-to-right, top-to-bottom

const frame1 = [
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 3, 3, 3, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 3, 3, 2, 2, 3, 3, 3, 1, 0, 0, 0, 0],
  [0, 0, 1, 3, 2, 2, 2, 2, 2, 3, 3, 3, 1, 0, 0, 0],
  [0, 1, 3, 2, 2, 1, 1, 2, 2, 2, 3, 3, 3, 1, 1, 0],
  [1, 7, 3, 2, 2, 1, 6, 1, 2, 2, 3, 3, 3, 5, 5, 1],
  [1, 7, 7, 3, 2, 1, 1, 2, 2, 3, 3, 3, 5, 5, 5, 1],
  [1, 7, 3, 3, 2, 2, 2, 2, 3, 3, 3, 5, 5, 5, 1, 0],
  [0, 1, 3, 3, 3, 2, 2, 3, 3, 3, 5, 5, 5, 1, 0, 0],
  [0, 0, 1, 3, 3, 3, 3, 3, 3, 5, 5, 5, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 3, 3, 3, 5, 5, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
];

// Frame 2: tail wags up
const frame2 = [
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 3, 3, 3, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 3, 3, 2, 2, 3, 3, 3, 1, 0, 0, 0, 0],
  [0, 0, 1, 3, 2, 2, 2, 2, 2, 3, 3, 3, 1, 0, 0, 0],
  [1, 1, 3, 2, 2, 1, 1, 2, 2, 2, 3, 3, 3, 1, 0, 0],
  [1, 7, 3, 2, 2, 1, 6, 1, 2, 2, 3, 3, 3, 5, 5, 1],
  [1, 7, 7, 3, 2, 1, 1, 2, 2, 3, 3, 3, 5, 5, 5, 1],
  [0, 1, 7, 3, 2, 2, 2, 2, 3, 3, 3, 5, 5, 5, 1, 0],
  [0, 0, 1, 3, 3, 2, 2, 3, 3, 3, 5, 5, 5, 1, 0, 0],
  [0, 0, 0, 1, 3, 3, 3, 3, 3, 5, 5, 5, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 3, 3, 5, 5, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
];

export const BLUEGILL: SpriteDefinition = {
  name: 'bluegill',
  width: 16,
  height: 12,
  frames: [frame1, frame2],
  palette: BLUEGILL_PALETTE,
  animation: {
    frameRate: 4, // 4 fps = 0.25s per frame
    loop: true,
  },
};
