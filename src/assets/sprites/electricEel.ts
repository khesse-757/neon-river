/**
 * Electric Eel Sprite
 *
 * Deadly hazard - instant game over on contact.
 * Weaves side-to-side as it swims.
 *
 * Size: 24x8 pixels
 * Animation: 2 frames (electric pulse)
 */

import type { SpriteDefinition } from '../../utils/types';
import { ELECTRIC_EEL_PALETTE } from '../palettes/fish';

// Pixel grid: 0=transparent, 1-7=palette colors
// 1=outline, 2=dark body, 3=mid body, 4=electric cyan, 5=light cyan, 6=spark, 7=accent

const frame1 = [
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 2, 2, 1, 6, 1, 2, 2, 3, 4, 3, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 2, 2, 2, 1, 1, 2, 2, 3, 3, 5, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 2, 2, 2, 2, 2, 2, 3, 3, 4, 3, 3, 2, 2, 2, 2, 3, 3, 3, 2, 2, 1, 0],
  [0, 0, 1, 2, 2, 2, 2, 3, 3, 5, 3, 3, 2, 2, 2, 2, 3, 4, 3, 2, 2, 1, 0, 0],
  [0, 0, 0, 1, 1, 2, 3, 3, 4, 3, 2, 2, 2, 2, 3, 3, 5, 3, 2, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
];

// Frame 2: electric pulse shifts
const frame2 = [
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 2, 2, 1, 6, 1, 2, 2, 3, 3, 3, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 2, 2, 2, 1, 1, 2, 2, 3, 5, 3, 3, 3, 2, 2, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 2, 2, 2, 2, 2, 2, 3, 4, 3, 3, 3, 2, 2, 2, 2, 3, 5, 3, 2, 2, 1, 0],
  [0, 0, 1, 2, 2, 2, 2, 3, 5, 3, 3, 3, 2, 2, 2, 2, 3, 3, 4, 2, 2, 1, 0, 0],
  [0, 0, 0, 1, 1, 2, 3, 4, 3, 3, 2, 2, 2, 2, 3, 5, 3, 3, 2, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
];

export const ELECTRIC_EEL: SpriteDefinition = {
  name: 'electricEel',
  width: 24,
  height: 8,
  frames: [frame1, frame2],
  palette: ELECTRIC_EEL_PALETTE,
  animation: {
    frameRate: 8, // Fast flicker for electric effect
    loop: true,
  },
};
