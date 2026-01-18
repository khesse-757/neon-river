/**
 * InputManager - Unified mouse/touch input handling
 *
 * Tracks pointer X position normalized to 0-1 range.
 */

export class InputManager {
  private canvas: HTMLCanvasElement;
  private normalizedX: number = 0.5; // Start centered
  private active: boolean = false;

  // Bound handlers for cleanup
  private handleMouseMove: (e: MouseEvent) => void;
  private handleTouchStart: (e: TouchEvent) => void;
  private handleTouchMove: (e: TouchEvent) => void;
  private handleMouseLeave: () => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    // Bind handlers
    this.handleMouseMove = this.onMouseMove.bind(this);
    this.handleTouchStart = this.onTouchStart.bind(this);
    this.handleTouchMove = this.onTouchMove.bind(this);
    this.handleMouseLeave = this.onMouseLeave.bind(this);

    // Attach listeners
    canvas.addEventListener('mousemove', this.handleMouseMove);
    canvas.addEventListener('touchstart', this.handleTouchStart, {
      passive: false, // Need to call preventDefault
    });
    canvas.addEventListener('touchmove', this.handleTouchMove, {
      passive: false, // Need to call preventDefault to stop scrolling
    });
    canvas.addEventListener('mouseleave', this.handleMouseLeave);
  }

  private onMouseMove(e: MouseEvent): void {
    this.active = true;
    this.updatePosition(e.clientX);
  }

  private onTouchStart(e: TouchEvent): void {
    e.preventDefault(); // Prevent scrolling
    this.active = true;
    const touch = e.touches[0];
    if (touch) {
      this.updatePosition(touch.clientX);
    }
  }

  private onTouchMove(e: TouchEvent): void {
    e.preventDefault(); // Prevent scrolling/rubber-banding
    const touch = e.touches[0];
    if (touch) {
      this.updatePosition(touch.clientX);
    }
  }

  private onMouseLeave(): void {
    // Keep last position, just mark inactive
    this.active = false;
  }

  private updatePosition(clientX: number): void {
    const rect = this.canvas.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    this.normalizedX = Math.max(0, Math.min(1, relativeX / rect.width));
  }

  /**
   * Get normalized X position (0 = left, 1 = right)
   */
  getX(): number {
    return this.normalizedX;
  }

  /**
   * Get X position mapped to world coordinates
   */
  getWorldX(minX: number, maxX: number): number {
    return minX + this.normalizedX * (maxX - minX);
  }

  /**
   * Check if input is currently active (pointer over canvas)
   */
  isActive(): boolean {
    return this.active;
  }

  /**
   * Clean up event listeners
   */
  dispose(): void {
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('touchstart', this.handleTouchStart);
    this.canvas.removeEventListener('touchmove', this.handleTouchMove);
    this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
  }
}
