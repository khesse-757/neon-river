/**
 * Background - Layered scene matching concept art
 *
 * Layers (back to front):
 * 1. Sky (dark navy gradient)
 * 2. Moon (upper-left with soft halo)
 * 3. Stars (sparse dots)
 * 4. City skyline (upper-right, behind right hill)
 * 5. Hills (left large, right smaller with trees)
 */

import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants';

interface Star {
  x: number;
  y: number;
  brightness: number;
  size: number;
}

interface Window {
  x: number;
  y: number;
}

interface Building {
  x: number;
  width: number;
  height: number;
  hasNeon: boolean;
  neonColor: string;
  neonY: number;
  windows: Window[];
}

interface Tree {
  x: number;
  y: number;
  radius: number;
  color: string;
}

export class Background {
  private stars: Star[] = [];
  private buildings: Building[] = [];
  private leftHillTrees: Tree[] = [];
  private rightHillTrees: Tree[] = [];

  constructor() {
    this.generateStars();
    this.generateBuildings();
    this.generateTrees();
  }

  private generateStars(): void {
    // Sparse stars across the sky
    for (let i = 0; i < 35; i++) {
      this.stars.push({
        x: Math.random() * GAME_WIDTH,
        y: Math.random() * (GAME_HEIGHT * 0.35),
        brightness: 0.3 + Math.random() * 0.7,
        size: Math.random() < 0.2 ? 2 : 1,
      });
    }
  }

  private generateBuildings(): void {
    const neonColors = ['#9b4dca', '#00d4aa', '#9b4dca', '#00d4aa'];
    let x = GAME_WIDTH * 0.68;

    while (x < GAME_WIDTH + 10) {
      const width = 6 + Math.random() * 14;
      const height = 20 + Math.random() * 50;
      const hasNeon = Math.random() < 0.6;
      const colorIndex = Math.floor(Math.random() * neonColors.length);

      // Pre-generate static window positions
      const windows: Window[] = [];
      if (hasNeon) {
        const windowCount = Math.floor(width / 4);
        for (let w = 0; w < windowCount; w++) {
          if (Math.random() < 0.3) {
            windows.push({
              x: w * 4 + 1,
              y: Math.random() * (height - 8) + 4,
            });
          }
        }
      }

      this.buildings.push({
        x,
        width,
        height,
        hasNeon,
        neonColor: neonColors[colorIndex] ?? '#9b4dca',
        neonY: Math.random() * (height - 10) + 5,
        windows,
      });

      x += width + 2 + Math.random() * 6;
    }
  }

  private generateTrees(): void {
    // Left hill trees (Ghibli-style rounded clusters)
    const leftHillTreePositions = [
      { x: 0.05, y: 0.32 },
      { x: 0.1, y: 0.28 },
      { x: 0.15, y: 0.25 },
      { x: 0.18, y: 0.27 },
      { x: 0.22, y: 0.3 },
      { x: 0.08, y: 0.35 },
      { x: 0.12, y: 0.33 },
      { x: 0.25, y: 0.34 },
    ];

    for (const pos of leftHillTreePositions) {
      // Main tree
      this.leftHillTrees.push({
        x: GAME_WIDTH * pos.x,
        y: GAME_HEIGHT * pos.y,
        radius: 12 + Math.random() * 8,
        color: '#1a3328',
      });
      // Overlapping smaller trees for cluster effect
      if (Math.random() < 0.7) {
        this.leftHillTrees.push({
          x: GAME_WIDTH * pos.x + (Math.random() - 0.5) * 15,
          y: GAME_HEIGHT * pos.y + Math.random() * 5,
          radius: 8 + Math.random() * 6,
          color: '#152a22',
        });
      }
    }

    // Right hill trees (fewer, smaller - more distant)
    const rightHillTreePositions = [
      { x: 0.72, y: 0.36 },
      { x: 0.78, y: 0.33 },
      { x: 0.82, y: 0.35 },
      { x: 0.88, y: 0.38 },
    ];

    for (const pos of rightHillTreePositions) {
      this.rightHillTrees.push({
        x: GAME_WIDTH * pos.x,
        y: GAME_HEIGHT * pos.y,
        radius: 8 + Math.random() * 5,
        color: '#2d4a3e',
      });
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.renderSky(ctx);
    this.renderMoon(ctx);
    this.renderStars(ctx);
    this.renderCity(ctx);
    this.renderHills(ctx);
    this.renderTrees(ctx);
  }

  private renderSky(ctx: CanvasRenderingContext2D): void {
    // Dark navy gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    gradient.addColorStop(0, '#0d1b2a');
    gradient.addColorStop(0.4, '#1b263b');
    gradient.addColorStop(1, '#0d1b2a');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  }

  private renderMoon(ctx: CanvasRenderingContext2D): void {
    const moonX = GAME_WIDTH * 0.15;
    const moonY = GAME_HEIGHT * 0.1;
    const moonRadius = 22;

    // Simple soft glow - single radial gradient, no rings
    const glowGradient = ctx.createRadialGradient(
      moonX,
      moonY,
      moonRadius * 0.8,
      moonX,
      moonY,
      moonRadius * 2
    );
    glowGradient.addColorStop(0, 'rgba(255, 255, 230, 0.15)');
    glowGradient.addColorStop(1, 'rgba(255, 255, 200, 0)');
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius * 2, 0, Math.PI * 2);
    ctx.fill();

    // Moon body - solid circle
    ctx.fillStyle = '#fffde7';
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fill();

    // Subtle crater markings
    ctx.fillStyle = 'rgba(200, 200, 180, 0.15)';
    ctx.beginPath();
    ctx.arc(moonX - 6, moonY - 3, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(moonX + 5, moonY + 5, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  private renderStars(ctx: CanvasRenderingContext2D): void {
    for (const star of this.stars) {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }
  }

  /**
   * City skyline in upper-right, behind the right hill
   * Completely static - no animation, distant photograph feel
   */
  private renderCity(ctx: CanvasRenderingContext2D): void {
    const horizonY = GAME_HEIGHT * 0.25;

    for (const building of this.buildings) {
      const buildingTop = horizonY - building.height;

      // Building silhouette (slightly blue for distance)
      ctx.fillStyle = '#0a1520';
      ctx.fillRect(building.x, buildingTop, building.width, building.height);

      // Static neon accent strip
      if (building.hasNeon) {
        // Soft glow (static)
        ctx.fillStyle = building.neonColor;
        ctx.globalAlpha = 0.12;
        ctx.fillRect(
          building.x - 1,
          buildingTop + building.neonY - 1,
          building.width + 2,
          4
        );
        // Neon line (static)
        ctx.globalAlpha = 0.35;
        ctx.fillRect(
          building.x,
          buildingTop + building.neonY,
          building.width,
          2
        );

        // Pre-generated static windows
        ctx.globalAlpha = 0.4;
        for (const win of building.windows) {
          ctx.fillRect(building.x + win.x, buildingTop + win.y, 2, 2);
        }
      }
      ctx.globalAlpha = 1;
    }
  }

  /**
   * Hills with valley/ravine between them
   * Left hill is larger and darker, right hill is smaller
   */
  private renderHills(ctx: CanvasRenderingContext2D): void {
    // RIGHT HILL (behind, drawn first so left overlaps)
    // Smaller, medium green, city peeks over
    ctx.fillStyle = '#2d4a3e';
    ctx.beginPath();
    ctx.moveTo(GAME_WIDTH * 0.55, GAME_HEIGHT);
    ctx.quadraticCurveTo(
      GAME_WIDTH * 0.6,
      GAME_HEIGHT * 0.5,
      GAME_WIDTH * 0.7,
      GAME_HEIGHT * 0.38
    );
    ctx.quadraticCurveTo(
      GAME_WIDTH * 0.8,
      GAME_HEIGHT * 0.3,
      GAME_WIDTH * 0.9,
      GAME_HEIGHT * 0.35
    );
    ctx.lineTo(GAME_WIDTH, GAME_HEIGHT * 0.4);
    ctx.lineTo(GAME_WIDTH, GAME_HEIGHT);
    ctx.closePath();
    ctx.fill();

    // LEFT HILL (foreground, larger)
    // Darker green with atmospheric perspective
    ctx.fillStyle = '#1a2f23';
    ctx.beginPath();
    ctx.moveTo(0, GAME_HEIGHT);
    ctx.lineTo(0, GAME_HEIGHT * 0.3);
    ctx.quadraticCurveTo(
      GAME_WIDTH * 0.1,
      GAME_HEIGHT * 0.22,
      GAME_WIDTH * 0.2,
      GAME_HEIGHT * 0.28
    );
    ctx.quadraticCurveTo(
      GAME_WIDTH * 0.3,
      GAME_HEIGHT * 0.35,
      GAME_WIDTH * 0.4,
      GAME_HEIGHT * 0.5
    );
    ctx.quadraticCurveTo(
      GAME_WIDTH * 0.45,
      GAME_HEIGHT * 0.65,
      GAME_WIDTH * 0.48,
      GAME_HEIGHT
    );
    ctx.closePath();
    ctx.fill();

    // Valley floor gradient (transition zone)
    const valleyGradient = ctx.createLinearGradient(
      GAME_WIDTH * 0.35,
      0,
      GAME_WIDTH * 0.65,
      0
    );
    valleyGradient.addColorStop(0, 'rgba(26, 47, 35, 0.5)');
    valleyGradient.addColorStop(0.5, 'rgba(13, 27, 42, 0)');
    valleyGradient.addColorStop(1, 'rgba(45, 74, 62, 0.3)');

    ctx.fillStyle = valleyGradient;
    ctx.fillRect(
      GAME_WIDTH * 0.35,
      GAME_HEIGHT * 0.25,
      GAME_WIDTH * 0.3,
      GAME_HEIGHT * 0.2
    );
  }

  /**
   * Ghibli-style rounded tree clusters on hilltops
   */
  private renderTrees(ctx: CanvasRenderingContext2D): void {
    // Right hill trees first (behind)
    for (const tree of this.rightHillTrees) {
      ctx.fillStyle = tree.color;
      ctx.beginPath();
      ctx.arc(tree.x, tree.y, tree.radius, 0, Math.PI * 2);
      ctx.fill();

      // Highlight on top
      ctx.fillStyle = '#3d5a4e';
      ctx.beginPath();
      ctx.arc(tree.x - 2, tree.y - 2, tree.radius * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Left hill trees (foreground)
    for (const tree of this.leftHillTrees) {
      ctx.fillStyle = tree.color;
      ctx.beginPath();
      ctx.arc(tree.x, tree.y, tree.radius, 0, Math.PI * 2);
      ctx.fill();

      // Highlight on top
      ctx.fillStyle = '#254035';
      ctx.beginPath();
      ctx.arc(tree.x - 2, tree.y - 3, tree.radius * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
