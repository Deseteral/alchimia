CanvasRenderingContext2D.prototype.drawRect = function drawRect(x: number, y: number, w: number, h: number): void {
  this.fillRect(x, y, w, 1);
  this.fillRect(x, y + h - 1, w, 1);
  this.fillRect(x, y, 1, h);
  this.fillRect(x + w - 1, y, 1, h);
};

// eslint-disable-next-line no-extend-native
Math.clamp = function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
};

Math.randomRange = function randomRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

declare global {
  interface CanvasRenderingContext2D {
    drawRect(x: number, y: number, w: number, h: number): void;
  }

  interface Math {
    clamp(num: number, min: number, max: number): number;
    randomRange(min: number, max: number): number;
  }
}

export {};
