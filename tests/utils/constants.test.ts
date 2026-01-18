/**
 * Tests for game constants
 */

import { describe, it, expect } from 'vitest';
import {
  WIN_WEIGHT,
  MAX_MISSED_WEIGHT,
  BLUEGILL_WEIGHT,
  GOLDEN_KOI_WEIGHT,
  SPAWN_WEIGHTS,
  INITIAL_SPAWN_INTERVAL,
  MIN_SPAWN_INTERVAL,
} from '../../src/utils/constants';

describe('Game Constants', () => {
  describe('Win/Lose conditions', () => {
    it('win weight is positive', () => {
      expect(WIN_WEIGHT).toBeGreaterThan(0);
    });

    it('max missed weight is positive', () => {
      expect(MAX_MISSED_WEIGHT).toBeGreaterThan(0);
    });

    it('max missed is less than win weight', () => {
      expect(MAX_MISSED_WEIGHT).toBeLessThan(WIN_WEIGHT);
    });
  });

  describe('Entity weights', () => {
    it('bluegill is 1 lb', () => {
      expect(BLUEGILL_WEIGHT).toBe(1);
    });

    it('golden koi is 5 lbs', () => {
      expect(GOLDEN_KOI_WEIGHT).toBe(5);
    });

    it('koi is worth more than bluegill', () => {
      expect(GOLDEN_KOI_WEIGHT).toBeGreaterThan(BLUEGILL_WEIGHT);
    });
  });

  describe('Spawn weights', () => {
    it('probabilities sum to 1', () => {
      const sum =
        SPAWN_WEIGHTS.BLUEGILL +
        SPAWN_WEIGHTS.GOLDEN_KOI +
        SPAWN_WEIGHTS.ELECTRIC_EEL;
      expect(sum).toBeCloseTo(1.0, 5);
    });

    it('bluegill is most common', () => {
      expect(SPAWN_WEIGHTS.BLUEGILL).toBeGreaterThan(SPAWN_WEIGHTS.GOLDEN_KOI);
      expect(SPAWN_WEIGHTS.BLUEGILL).toBeGreaterThan(
        SPAWN_WEIGHTS.ELECTRIC_EEL
      );
    });

    it('eel is rarest', () => {
      expect(SPAWN_WEIGHTS.ELECTRIC_EEL).toBeLessThan(SPAWN_WEIGHTS.BLUEGILL);
      expect(SPAWN_WEIGHTS.ELECTRIC_EEL).toBeLessThan(SPAWN_WEIGHTS.GOLDEN_KOI);
    });
  });

  describe('Spawn timing', () => {
    it('initial interval is positive', () => {
      expect(INITIAL_SPAWN_INTERVAL).toBeGreaterThan(0);
    });

    it('min interval is positive', () => {
      expect(MIN_SPAWN_INTERVAL).toBeGreaterThan(0);
    });

    it('initial is slower than minimum', () => {
      expect(INITIAL_SPAWN_INTERVAL).toBeGreaterThan(MIN_SPAWN_INTERVAL);
    });
  });
});
