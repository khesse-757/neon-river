/**
 * Water - S-curve river flowing through the ravine
 *
 * The creek emerges from between the hills and flows toward the viewer.
 * - SOURCE: Emerges from between hills at top-center (y: 25%, x: 45-55%)
 * - BEND: Curves to the right around (y: 40%, x: 60%)
 * - FLOW: Sweeps left and widens toward viewer
 * - MOUTH: Wide at bottom (x: 20-80%, y: 100%)
 *
 * Features:
 * - Soft grassy banks with reeds
 * - Moon reflection in upper portion
 * - City light reflections on right side
 * - Animated flow lines and sparkles
 */

import { GAME_WIDTH, GAME_HEIGHT } from '../utils/constants';

interface Sparkle {
  t: number;
  offset: number;
  phase: number;
  speed: number;
}

interface Reed {
  x: number;
  y: number;
  height: number;
  side: 'left' | 'right';
}

interface GrassTuft {
  x: number;
  y: number;
  width: number;
  side: 'left' | 'right';
}

// River path control points (cubic bezier)
// t=0 is source (between hills), t=1 is bottom (viewer)
const RIVER_PATH = {
  start: { x: GAME_WIDTH * 0.5, y: GAME_HEIGHT * 0.25 },
  cp1: { x: GAME_WIDTH * 0.58, y: GAME_HEIGHT * 0.35 },
  cp2: { x: GAME_WIDTH * 0.42, y: GAME_HEIGHT * 0.65 },
  end: { x: GAME_WIDTH * 0.5, y: GAME_HEIGHT * 1.05 },
};

// River width: narrow at source, wide at viewer
const RIVER_WIDTH_START = 35;
const RIVER_WIDTH_END = 200;

export class Water {
  private time: number = 0;
  private sparkles: Sparkle[] = [];
  private reeds: Reed[] = [];
  private grassTufts: GrassTuft[] = [];

  constructor() {
    this.generateSparkles();
    this.generateReeds();
    this.generateGrassTufts();
  }

  /**
   * Get a point on the river center line at parameter t (0-1)
   */
  getRiverPoint(t: number): { x: number; y: number } {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;

    return {
      x:
        mt3 * RIVER_PATH.start.x +
        3 * mt2 * t * RIVER_PATH.cp1.x +
        3 * mt * t2 * RIVER_PATH.cp2.x +
        t3 * RIVER_PATH.end.x,
      y:
        mt3 * RIVER_PATH.start.y +
        3 * mt2 * t * RIVER_PATH.cp1.y +
        3 * mt * t2 * RIVER_PATH.cp2.y +
        t3 * RIVER_PATH.end.y,
    };
  }

  /**
   * Get river width at parameter t
   */
  getRiverWidth(t: number): number {
    // Ease-in curve for more natural widening
    const eased = t * t;
    return RIVER_WIDTH_START + (RIVER_WIDTH_END - RIVER_WIDTH_START) * eased;
  }

  private generateSparkles(): void {
    for (let i = 0; i < 25; i++) {
      this.sparkles.push({
        t: Math.random(),
        offset: (Math.random() - 0.5) * 0.8,
        phase: Math.random() * Math.PI * 2,
        speed: 1 + Math.random() * 2,
      });
    }
  }

  private generateReeds(): void {
    // Reeds along both banks
    const reedPositions = [
      // Left bank reeds
      { t: 0.15, side: 'left' as const },
      { t: 0.25, side: 'left' as const },
      { t: 0.35, side: 'left' as const },
      { t: 0.5, side: 'left' as const },
      { t: 0.65, side: 'left' as const },
      // Right bank reeds
      { t: 0.2, side: 'right' as const },
      { t: 0.3, side: 'right' as const },
      { t: 0.45, side: 'right' as const },
      { t: 0.55, side: 'right' as const },
      { t: 0.7, side: 'right' as const },
    ];

    for (const pos of reedPositions) {
      const point = this.getRiverPoint(pos.t);
      const width = this.getRiverWidth(pos.t);
      const bankOffset = width / 2 + 3 + Math.random() * 8;

      this.reeds.push({
        x: point.x + (pos.side === 'left' ? -bankOffset : bankOffset),
        y: point.y,
        height: 12 + Math.random() * 10,
        side: pos.side,
      });

      // Add 1-2 more reeds in cluster
      if (Math.random() < 0.7) {
        this.reeds.push({
          x: point.x + (pos.side === 'left' ? -bankOffset - 4 : bankOffset + 4),
          y: point.y + (Math.random() - 0.5) * 6,
          height: 8 + Math.random() * 8,
          side: pos.side,
        });
      }
    }
  }

  private generateGrassTufts(): void {
    // Small grass tufts breaking up bank line
    for (let i = 0; i < 20; i++) {
      const t = Math.random() * 0.85 + 0.05;
      const point = this.getRiverPoint(t);
      const width = this.getRiverWidth(t);
      const side = Math.random() < 0.5 ? 'left' : 'right';
      const bankOffset = width / 2 - 2 + Math.random() * 6;

      this.grassTufts.push({
        x: point.x + (side === 'left' ? -bankOffset : bankOffset),
        y: point.y,
        width: 4 + Math.random() * 6,
        side,
      });
    }
  }

  update(delta: number): void {
    this.time += delta;
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.renderRiverBase(ctx);
    this.renderFlowLines(ctx);
    this.renderMoonReflection(ctx);
    this.renderCityReflections(ctx);
    this.renderSparkles(ctx);
    this.renderBanks(ctx);
    this.renderReeds(ctx);
  }

  /**
   * Draw the river as a curved shape with gradient
   */
  private renderRiverBase(ctx: CanvasRenderingContext2D): void {
    // Water gradient (dark blue-green)
    const gradient = ctx.createLinearGradient(
      0,
      RIVER_PATH.start.y,
      0,
      GAME_HEIGHT
    );
    gradient.addColorStop(0, '#0a1822');
    gradient.addColorStop(0.4, '#0c1a26');
    gradient.addColorStop(1, '#081418');

    ctx.fillStyle = gradient;
    ctx.beginPath();

    // Draw left bank
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const point = this.getRiverPoint(t);
      const width = this.getRiverWidth(t);

      if (i === 0) {
        ctx.moveTo(point.x - width / 2, point.y);
      } else {
        ctx.lineTo(point.x - width / 2, point.y);
      }
    }

    // Draw right bank (reverse direction)
    for (let i = steps; i >= 0; i--) {
      const t = i / steps;
      const point = this.getRiverPoint(t);
      const width = this.getRiverWidth(t);
      ctx.lineTo(point.x + width / 2, point.y);
    }

    ctx.closePath();
    ctx.fill();
  }

  /**
   * Subtle horizontal flow lines following the river
   */
  private renderFlowLines(ctx: CanvasRenderingContext2D): void {
    const lineCount = 12;

    for (let i = 0; i < lineCount; i++) {
      // Lines flow down the river
      const baseT = (i / lineCount + this.time * 0.06) % 1;

      if (baseT < 0.05 || baseT > 0.95) continue;

      const point = this.getRiverPoint(baseT);
      const width = this.getRiverWidth(baseT);

      // Fade based on position
      const fade = Math.sin(baseT * Math.PI);
      ctx.strokeStyle = `rgba(40, 70, 90, ${0.2 * fade})`;
      ctx.lineWidth = 1;

      // Draw wavy line
      ctx.beginPath();
      const lineWidth = width * 0.6;
      const startX = point.x - lineWidth / 2;

      for (let x = 0; x <= lineWidth; x += 4) {
        const waveY =
          point.y + Math.sin(x * 0.08 + this.time * 1.5 + i) * (1.5 + baseT);

        if (x === 0) {
          ctx.moveTo(startX + x, waveY);
        } else {
          ctx.lineTo(startX + x, waveY);
        }
      }
      ctx.stroke();
    }
  }

  /**
   * Moon reflection - soft vertical streak in upper portion
   */
  private renderMoonReflection(ctx: CanvasRenderingContext2D): void {
    // Moon is at upper-left (15%, 10%), reflection appears in upper river
    const reflectionT = 0.15; // Near source
    const point = this.getRiverPoint(reflectionT);
    const width = this.getRiverWidth(reflectionT);

    // Offset toward left side where moon is
    const reflectionX = point.x - width * 0.15;

    // Wobble effect
    const wobble = Math.sin(this.time * 0.8) * 2;

    // Soft glow
    const glowGradient = ctx.createRadialGradient(
      reflectionX + wobble,
      point.y,
      0,
      reflectionX + wobble,
      point.y,
      20
    );
    glowGradient.addColorStop(0, 'rgba(255, 255, 220, 0.12)');
    glowGradient.addColorStop(0.5, 'rgba(255, 255, 200, 0.05)');
    glowGradient.addColorStop(1, 'rgba(255, 255, 180, 0)');

    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(reflectionX + wobble, point.y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Vertical streak
    ctx.fillStyle = 'rgba(255, 255, 230, 0.08)';
    const streakHeight = 30;
    for (let y = 0; y < streakHeight; y += 3) {
      const streakWobble = Math.sin(this.time * 1.2 + y * 0.2) * 1.5;
      const alpha = 0.08 * (1 - y / streakHeight);
      ctx.fillStyle = `rgba(255, 255, 230, ${alpha})`;
      ctx.fillRect(reflectionX + streakWobble - 2, point.y + y - 5, 4, 2);
    }
  }

  /**
   * City light reflections - purple/teal streaks on right side
   */
  private renderCityReflections(ctx: CanvasRenderingContext2D): void {
    const colors = [
      { color: '#9b4dca', t: 0.12, offset: 0.3 }, // Purple
      { color: '#00d4aa', t: 0.18, offset: 0.35 }, // Teal
      { color: '#9b4dca', t: 0.25, offset: 0.25 }, // Purple
      { color: '#00d4aa', t: 0.3, offset: 0.4 }, // Teal
    ];

    for (const ref of colors) {
      const point = this.getRiverPoint(ref.t);
      const width = this.getRiverWidth(ref.t);

      // Right side of river (toward city)
      const x = point.x + width * ref.offset;
      const wobble = Math.sin(this.time * 1.1 + ref.t * 10) * 0.3 + 0.7;

      // Soft glow
      ctx.fillStyle = ref.color;
      ctx.globalAlpha = 0.06 * wobble;
      ctx.fillRect(x - 6, point.y - 2, 12, 4);
      ctx.globalAlpha = 0.12 * wobble;
      ctx.fillRect(x - 3, point.y - 1, 6, 2);
    }
    ctx.globalAlpha = 1;
  }

  /**
   * Sparkle/shimmer effect on water surface
   */
  private renderSparkles(ctx: CanvasRenderingContext2D): void {
    for (const sparkle of this.sparkles) {
      const point = this.getRiverPoint(sparkle.t);
      const width = this.getRiverWidth(sparkle.t);
      const x = point.x + sparkle.offset * width * 0.4;

      const brightness = Math.sin(this.time * sparkle.speed + sparkle.phase);
      if (brightness > 0.7) {
        const alpha = (brightness - 0.7) / 0.3;
        ctx.fillStyle = `rgba(180, 220, 240, ${alpha * 0.4})`;
        ctx.fillRect(x, point.y, 1, 1);
      }
    }
  }

  /**
   * Soft grassy bank edges
   */
  private renderBanks(ctx: CanvasRenderingContext2D): void {
    // Draw soft grass edge along banks
    const steps = 50;
    ctx.fillStyle = '#1a3328';

    for (let i = 0; i < steps; i++) {
      const t = i / steps;
      const point = this.getRiverPoint(t);
      const width = this.getRiverWidth(t);

      // Left bank grass tufts
      const leftX = point.x - width / 2;
      this.drawGrassEdge(ctx, leftX - 3, point.y, true);

      // Right bank grass tufts
      const rightX = point.x + width / 2;
      this.drawGrassEdge(ctx, rightX + 1, point.y, false);
    }

    // Render stored grass tufts
    for (const tuft of this.grassTufts) {
      ctx.fillStyle = '#1a3328';
      this.drawSmallTuft(ctx, tuft.x, tuft.y, tuft.width, tuft.side === 'left');
    }
  }

  private drawGrassEdge(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    isLeft: boolean
  ): void {
    // Small irregular grass shapes
    const variation = Math.sin(y * 0.1) * 2;
    ctx.fillRect(x + variation, y - 1, isLeft ? 4 : 4, 2);
  }

  private drawSmallTuft(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    isLeft: boolean
  ): void {
    // Triangle-ish grass tuft pointing toward water
    ctx.beginPath();
    if (isLeft) {
      ctx.moveTo(x - width, y);
      ctx.lineTo(x, y - 2);
      ctx.lineTo(x, y + 2);
    } else {
      ctx.moveTo(x + width, y);
      ctx.lineTo(x, y - 2);
      ctx.lineTo(x, y + 2);
    }
    ctx.closePath();
    ctx.fill();
  }

  /**
   * Reed/cattail silhouettes along banks
   */
  private renderReeds(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#152a22';

    for (const reed of this.reeds) {
      // Gentle sway animation
      const sway = Math.sin(this.time * 1.5 + reed.x * 0.05) * 2;

      // Stem
      ctx.fillRect(reed.x, reed.y - reed.height, 1, reed.height);

      // Cattail head (oval at top)
      ctx.beginPath();
      ctx.ellipse(
        reed.x + sway * 0.5,
        reed.y - reed.height - 3,
        2,
        4,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }
}
