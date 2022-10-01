CanvasRenderingContext2D.prototype.drawRect = function drawRect(x: number, y: number, w: number, h: number): void {
  this.fillRect(x, y, w, 1);
  this.fillRect(x, y + h - 1, w, 1);
  this.fillRect(x, y, 1, h);
  this.fillRect(x + w - 1, y, 1, h);
};

declare global {
  interface CanvasRenderingContext2D {
    drawRect(x: number, y: number, w: number, h: number): void;
  }
}

export {};
