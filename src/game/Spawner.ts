/**
 * Spawner - Manages fish spawning and lifecycle
 *
 * Spawns fish at intervals, tracks missed fish, removes off-screen fish.
 */

import type { FishEntity } from '../utils/types';
import {
  INITIAL_SPAWN_INTERVAL,
  MIN_SPAWN_INTERVAL,
  SPAWN_ACCELERATION,
  SPAWN_WEIGHTS,
  BOUNDS,
} from '../utils/constants';
import { Bluegill } from '../entities/Bluegill';
import { GoldenKoi } from '../entities/GoldenKoi';

export class Spawner {
  private entities: FishEntity[] = [];
  private spawnInterval: number = INITIAL_SPAWN_INTERVAL;
  private spawnTimer: number = 0;
  private missedWeight: number = 0;

  /**
   * Update spawner - spawn fish, update existing fish, remove off-screen
   */
  update(delta: number): void {
    // Increment spawn timer
    this.spawnTimer += delta;

    // Spawn fish when timer exceeds interval
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnFish();
      this.spawnTimer = 0;

      // Decrease interval (speed up spawning)
      this.spawnInterval = Math.max(
        MIN_SPAWN_INTERVAL,
        this.spawnInterval * SPAWN_ACCELERATION
      );
    }

    // Update all fish
    for (const fish of this.entities) {
      fish.update(delta);
    }

    // Remove off-screen fish and track missed weight
    this.removeOffScreenFish();
  }

  /**
   * Spawn a new fish at random X position above screen
   */
  private spawnFish(): void {
    const spawnWidth = BOUNDS.RIGHT - BOUNDS.LEFT;
    const x = BOUNDS.LEFT + Math.random() * spawnWidth;
    const y = BOUNDS.SPAWN_Y;

    // Weighted random selection (ignore eel for now)
    const roll = Math.random();
    const bluegillThreshold = SPAWN_WEIGHTS.BLUEGILL;
    const koiThreshold = bluegillThreshold + SPAWN_WEIGHTS.GOLDEN_KOI;

    let fish: FishEntity;
    if (roll < bluegillThreshold) {
      fish = new Bluegill(x, y);
    } else if (roll < koiThreshold) {
      fish = new GoldenKoi(x, y);
    } else {
      // Electric eel would go here - for now spawn Bluegill
      fish = new Bluegill(x, y);
    }

    this.entities.push(fish);
  }

  /**
   * Remove fish that have left the screen and track their weight
   */
  private removeOffScreenFish(): void {
    const remaining: FishEntity[] = [];

    for (const fish of this.entities) {
      if (fish.y > BOUNDS.DESPAWN_Y) {
        // Fish escaped - track weight
        this.missedWeight += fish.weight;
      } else {
        remaining.push(fish);
      }
    }

    this.entities = remaining;
  }

  /**
   * Render all fish
   */
  render(ctx: CanvasRenderingContext2D): void {
    for (const fish of this.entities) {
      fish.render(ctx);
    }
  }

  /**
   * Get total weight of fish that escaped
   */
  getMissedWeight(): number {
    return this.missedWeight;
  }

  /**
   * Get active fish entities (for collision detection)
   */
  getEntities(): FishEntity[] {
    return this.entities;
  }

  /**
   * Remove a specific fish (when caught)
   */
  removeFish(fish: FishEntity): void {
    const index = this.entities.indexOf(fish);
    if (index !== -1) {
      this.entities.splice(index, 1);
    }
  }

  /**
   * Reset spawner to initial state
   */
  reset(): void {
    this.entities = [];
    this.spawnInterval = INITIAL_SPAWN_INTERVAL;
    this.spawnTimer = 0;
    this.missedWeight = 0;
  }
}
