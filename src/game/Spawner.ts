/**
 * Spawner - Manages fish and hazard spawning and lifecycle
 *
 * Spawns fish/eels at the river source, tracks missed fish, removes off-screen entities.
 * Entities follow the river path as they swim downstream.
 */

import type { FishEntity, HazardEntity } from '../utils/types';
import {
  INITIAL_SPAWN_INTERVAL,
  MIN_SPAWN_INTERVAL,
  SPAWN_ACCELERATION,
  SPAWN_WEIGHTS,
  BOUNDS,
} from '../utils/constants';
import { Bluegill } from '../entities/Bluegill';
import { GoldenKoi } from '../entities/GoldenKoi';
import { ElectricEel } from '../entities/ElectricEel';

export class Spawner {
  private entities: FishEntity[] = [];
  private eels: HazardEntity[] = [];
  private spawnInterval: number = INITIAL_SPAWN_INTERVAL;
  private spawnTimer: number = 0;
  private missedWeight: number = 0;

  // Wave-based spawning system
  private waveDirection: number = 1; // 1 = sweeping right, -1 = sweeping left
  private fishInCurrentWave: number = 0;
  private fishPerWave: number = 4; // Fish per sweep before reversing

  /**
   * Update spawner - spawn fish, update existing fish, remove off-screen
   */
  update(delta: number): void {
    // Increment spawn timer
    this.spawnTimer += delta;

    // Spawn fish when timer exceeds interval
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnEntity();
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

    // Update all eels
    for (const eel of this.eels) {
      eel.update(delta);
    }

    // Remove off-screen entities
    this.removeOffScreenFish();
    this.removeOffScreenEels();
  }

  /**
   * Get spawn lane based on wave position
   */
  private getNextSpawnLane(): number {
    const progress = this.fishInCurrentWave / this.fishPerWave;

    if (this.waveDirection > 0) {
      // Sweeping left to right: -0.35 to +0.35
      return -0.35 + progress * 0.7;
    } else {
      // Sweeping right to left: +0.35 to -0.35
      return 0.35 - progress * 0.7;
    }
  }

  /**
   * Advance wave state after spawning
   */
  private advanceWave(): void {
    this.fishInCurrentWave++;

    // When wave is complete, reverse direction
    if (this.fishInCurrentWave >= this.fishPerWave) {
      this.fishInCurrentWave = 0;
      this.waveDirection *= -1;

      // Slight variation in next wave size (3-5 fish)
      this.fishPerWave = 3 + Math.floor(Math.random() * 3);
    }
  }

  /**
   * Spawn a new entity at the river source with wave coordination
   */
  private spawnEntity(): void {
    // Get coordinated spawn lane and movement direction
    const spawnLane = this.getNextSpawnLane();
    const moveDirection = this.waveDirection;

    // Weighted random selection
    const roll = Math.random();
    const bluegillThreshold = SPAWN_WEIGHTS.BLUEGILL;
    const koiThreshold = bluegillThreshold + SPAWN_WEIGHTS.GOLDEN_KOI;

    if (roll < bluegillThreshold) {
      this.entities.push(new Bluegill(spawnLane, moveDirection));
    } else if (roll < koiThreshold) {
      this.entities.push(new GoldenKoi(spawnLane, moveDirection));
    } else {
      // Electric eel - add to separate hazards array
      this.eels.push(new ElectricEel(spawnLane, moveDirection));
    }

    // Advance wave for next spawn
    this.advanceWave();
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
   * Remove eels that have left the screen (no penalty for missed eels)
   */
  private removeOffScreenEels(): void {
    this.eels = this.eels.filter((eel) => eel.y <= BOUNDS.DESPAWN_Y);
  }

  /**
   * Render all entities (fish and eels)
   */
  render(ctx: CanvasRenderingContext2D): void {
    for (const fish of this.entities) {
      fish.render(ctx);
    }
    for (const eel of this.eels) {
      eel.render(ctx);
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
   * Get active eel hazards (for collision detection)
   */
  getEels(): HazardEntity[] {
    return this.eels;
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
   * Remove a specific eel (when shocked)
   */
  removeEel(eel: HazardEntity): void {
    const index = this.eels.indexOf(eel);
    if (index !== -1) {
      this.eels.splice(index, 1);
    }
  }

  /**
   * Reset spawner to initial state
   */
  reset(): void {
    this.entities = [];
    this.eels = [];
    this.spawnInterval = INITIAL_SPAWN_INTERVAL;
    this.spawnTimer = 0;
    this.missedWeight = 0;

    // Reset wave state
    this.waveDirection = 1;
    this.fishInCurrentWave = 0;
    this.fishPerWave = 4;
  }
}
