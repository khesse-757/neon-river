/**
 * Fish Color Palettes
 *
 * 0 is always transparent.
 * Other numbers map to colors used in sprite pixel grids.
 */

import type { ColorPalette } from '../../utils/types';

export const BLUEGILL_PALETTE: ColorPalette = {
  0: 'transparent',
  1: '#1a1a2e', // outline (dark)
  2: '#1e3a5f', // dark blue
  3: '#3366aa', // mid blue
  4: '#5588cc', // light blue
  5: '#8faabe', // belly (lightest)
  6: '#ffffff', // eye
  7: '#4a90a0', // fin accent
};

export const GOLDEN_KOI_PALETTE: ColorPalette = {
  0: 'transparent',
  1: '#2a1a0a', // outline (dark brown)
  2: '#cc6600', // dark orange
  3: '#ff9933', // mid orange
  4: '#ffcc66', // light gold
  5: '#ffeecc', // belly (cream)
  6: '#ffffff', // eye
  7: '#ffdd88', // fin accent
};

export const ELECTRIC_EEL_PALETTE: ColorPalette = {
  0: 'transparent',
  1: '#0a0a1a', // outline (near black)
  2: '#1a1a3a', // dark body
  3: '#2a2a5a', // mid body
  4: '#00ffff', // electric cyan (glow)
  5: '#44ffff', // light cyan
  6: '#ffffff', // eye / spark
  7: '#0088aa', // accent
};
