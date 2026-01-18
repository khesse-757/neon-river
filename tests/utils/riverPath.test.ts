/**
 * Tests for river path utilities
 */

import { describe, it, expect } from 'vitest';
import {
  getRiverPoint,
  getRiverWidth,
  getSpawnPosition,
} from '../../src/utils/riverPath';
import {
  RIVER_PATH,
  RIVER_WIDTH_START,
  RIVER_WIDTH_END,
  SPAWN_PATH_T,
} from '../../src/utils/constants';

describe('getRiverPoint', () => {
  describe('bezier curve (t >= 0)', () => {
    it('returns start point at t=0', () => {
      const point = getRiverPoint(0);
      expect(point.x).toBeCloseTo(RIVER_PATH.start.x, 1);
      expect(point.y).toBeCloseTo(RIVER_PATH.start.y, 1);
    });

    it('returns end point at t=1', () => {
      const point = getRiverPoint(1);
      expect(point.x).toBeCloseTo(RIVER_PATH.end.x, 1);
      expect(point.y).toBeCloseTo(RIVER_PATH.end.y, 1);
    });

    it('returns intermediate point at t=0.5', () => {
      const point = getRiverPoint(0.5);
      // Should be somewhere between start and end
      expect(point.y).toBeGreaterThan(RIVER_PATH.start.y);
      expect(point.y).toBeLessThan(RIVER_PATH.end.y);
    });

    it('progresses downward along path', () => {
      const p0 = getRiverPoint(0);
      const p1 = getRiverPoint(0.25);
      const p2 = getRiverPoint(0.5);
      const p3 = getRiverPoint(0.75);
      const p4 = getRiverPoint(1);

      // Y should increase (moving down the screen)
      expect(p1.y).toBeGreaterThan(p0.y);
      expect(p2.y).toBeGreaterThan(p1.y);
      expect(p3.y).toBeGreaterThan(p2.y);
      expect(p4.y).toBeGreaterThan(p3.y);
    });
  });

  describe('pre-spawn region (t < 0)', () => {
    it('interpolates toward preSpawn point for negative t', () => {
      const point = getRiverPoint(SPAWN_PATH_T);
      // Should be closer to preSpawn than start
      expect(point.x).toBeGreaterThan(RIVER_PATH.start.x);
    });

    it('returns start at t=0 boundary', () => {
      const point = getRiverPoint(0);
      expect(point.x).toBeCloseTo(RIVER_PATH.start.x, 1);
    });
  });
});

describe('getRiverWidth', () => {
  it('returns start width at t=0', () => {
    expect(getRiverWidth(0)).toBe(RIVER_WIDTH_START);
  });

  it('returns end width at t=1', () => {
    expect(getRiverWidth(1)).toBeCloseTo(RIVER_WIDTH_END, 1);
  });

  it('returns start width for negative t', () => {
    expect(getRiverWidth(-0.5)).toBe(RIVER_WIDTH_START);
    expect(getRiverWidth(SPAWN_PATH_T)).toBe(RIVER_WIDTH_START);
  });

  it('increases width as t increases (perspective widening)', () => {
    const w0 = getRiverWidth(0);
    const w1 = getRiverWidth(0.5);
    const w2 = getRiverWidth(1);

    expect(w1).toBeGreaterThan(w0);
    expect(w2).toBeGreaterThan(w1);
  });

  it('uses eased interpolation (not linear)', () => {
    const w25 = getRiverWidth(0.25);
    const w50 = getRiverWidth(0.5);
    const w75 = getRiverWidth(0.75);

    // With quadratic easing, difference between 0.5-0.25 should be less than 0.75-0.5
    const delta1 = w50 - w25;
    const delta2 = w75 - w50;

    expect(delta2).toBeGreaterThan(delta1);
  });
});

describe('getSpawnPosition', () => {
  it('returns pathT equal to SPAWN_PATH_T', () => {
    const pos = getSpawnPosition();
    expect(pos.pathT).toBe(SPAWN_PATH_T);
  });

  it('returns valid coordinates', () => {
    const pos = getSpawnPosition();
    expect(pos.x).toBeGreaterThan(0);
    expect(pos.y).toBeGreaterThan(0);
    expect(typeof pos.x).toBe('number');
    expect(typeof pos.y).toBe('number');
  });

  it('returns lateral offset in valid range', () => {
    // Run multiple times to test randomness
    for (let i = 0; i < 20; i++) {
      const pos = getSpawnPosition();
      expect(pos.pathOffset).toBeGreaterThanOrEqual(-0.8);
      expect(pos.pathOffset).toBeLessThanOrEqual(0.8);
    }
  });

  it('returns consistent y position at spawn', () => {
    const pos1 = getSpawnPosition();
    const pos2 = getSpawnPosition();
    // Y should be same since it depends only on pathT
    expect(pos1.y).toBe(pos2.y);
  });
});
