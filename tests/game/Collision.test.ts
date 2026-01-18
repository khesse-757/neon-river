import { describe, it, expect } from 'vitest';
import { checkCollision } from '../../src/game/Collision';

describe('checkCollision', () => {
  it('returns true for overlapping boxes', () => {
    const a = { x: 0, y: 0, width: 100, height: 100 };
    const b = { x: 50, y: 50, width: 100, height: 100 };
    expect(checkCollision(a, b)).toBe(true);
  });

  it('returns false for non-overlapping boxes (horizontal gap)', () => {
    const a = { x: 0, y: 0, width: 100, height: 100 };
    const b = { x: 200, y: 0, width: 100, height: 100 };
    expect(checkCollision(a, b)).toBe(false);
  });

  it('returns false for non-overlapping boxes (vertical gap)', () => {
    const a = { x: 0, y: 0, width: 100, height: 100 };
    const b = { x: 0, y: 200, width: 100, height: 100 };
    expect(checkCollision(a, b)).toBe(false);
  });

  it('returns false for boxes that touch at edge (not overlapping)', () => {
    const a = { x: 0, y: 0, width: 100, height: 100 };
    const b = { x: 100, y: 0, width: 100, height: 100 };
    expect(checkCollision(a, b)).toBe(false);
  });

  it('returns true when one box is inside another', () => {
    const outer = { x: 0, y: 0, width: 200, height: 200 };
    const inner = { x: 50, y: 50, width: 50, height: 50 };
    expect(checkCollision(outer, inner)).toBe(true);
    expect(checkCollision(inner, outer)).toBe(true);
  });

  it('returns true for partial overlap from left', () => {
    const a = { x: 0, y: 50, width: 100, height: 50 };
    const b = { x: 80, y: 50, width: 100, height: 50 };
    expect(checkCollision(a, b)).toBe(true);
  });

  it('returns true for partial overlap from top', () => {
    const a = { x: 50, y: 0, width: 50, height: 100 };
    const b = { x: 50, y: 80, width: 50, height: 100 };
    expect(checkCollision(a, b)).toBe(true);
  });

  it('returns false for diagonal non-overlapping boxes', () => {
    const a = { x: 0, y: 0, width: 50, height: 50 };
    const b = { x: 100, y: 100, width: 50, height: 50 };
    expect(checkCollision(a, b)).toBe(false);
  });
});
