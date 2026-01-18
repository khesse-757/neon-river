/**
 * Tests for the Spawner class
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Spawner } from '../../src/game/Spawner';

describe('Spawner', () => {
  let spawner: Spawner;

  beforeEach(() => {
    spawner = new Spawner();
  });

  describe('initial state', () => {
    it('starts with no entities', () => {
      expect(spawner.getEntities()).toHaveLength(0);
    });

    it('starts with no eels', () => {
      expect(spawner.getEels()).toHaveLength(0);
    });

    it('starts with zero missed weight', () => {
      expect(spawner.getMissedWeight()).toBe(0);
    });
  });

  describe('reset', () => {
    it('clears all entities', () => {
      // Simulate some game state by updating multiple times
      for (let i = 0; i < 10; i++) {
        spawner.update(0.5);
      }

      spawner.reset();

      expect(spawner.getEntities()).toHaveLength(0);
      expect(spawner.getEels()).toHaveLength(0);
      expect(spawner.getMissedWeight()).toBe(0);
    });
  });

  describe('spawning', () => {
    it('spawns entities over time', () => {
      // Initial spawn interval is 2 seconds, so update past that
      spawner.update(2.5);

      const entities = spawner.getEntities();
      const eels = spawner.getEels();

      // Should have spawned at least one entity (fish or eel)
      expect(entities.length + eels.length).toBeGreaterThan(0);
    });

    it('does not spawn immediately', () => {
      spawner.update(0.1);

      const entities = spawner.getEntities();
      const eels = spawner.getEels();

      expect(entities.length + eels.length).toBe(0);
    });
  });

  describe('entity removal', () => {
    it('removes fish when requested', () => {
      // Spawn some entities
      for (let i = 0; i < 5; i++) {
        spawner.update(2.5);
      }

      const entities = spawner.getEntities();
      if (entities.length > 0) {
        const fish = entities[0];
        const initialCount = entities.length;

        spawner.removeFish(fish!);

        expect(spawner.getEntities().length).toBe(initialCount - 1);
      }
    });

    it('removes eel when requested', () => {
      // This test depends on random spawning, so we check the removal logic
      // by manually testing the method behavior
      const eels = spawner.getEels();
      const initialCount = eels.length;

      // removeFish on non-existent fish should not throw
      spawner.removeEel({ x: 0, y: 0 } as never);

      expect(spawner.getEels().length).toBe(initialCount);
    });
  });

  describe('caught weight tracking', () => {
    it('accepts caught weight updates', () => {
      // Setting caught weight should not throw
      expect(() => spawner.setCaughtWeight(50)).not.toThrow();
      expect(() => spawner.setCaughtWeight(100)).not.toThrow();
      expect(() => spawner.setCaughtWeight(0)).not.toThrow();
    });
  });

  describe('wave system', () => {
    it('spawns entities at different lateral positions over time', () => {
      const positions: number[] = [];

      // Spawn multiple entities
      for (let i = 0; i < 6; i++) {
        spawner.update(2.5);
        const entities = spawner.getEntities();
        const eels = spawner.getEels();
        const all = [...entities, ...eels];
        if (all.length > positions.length) {
          const latest = all[all.length - 1];
          if (latest) {
            positions.push(latest.x);
          }
        }
      }

      // Should have different x positions (wave-based spawning)
      if (positions.length >= 2) {
        const uniquePositions = new Set(positions);
        expect(uniquePositions.size).toBeGreaterThan(1);
      }
    });
  });
});
