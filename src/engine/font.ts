import { Engine } from 'src/engine/engine';

export abstract class Font {
  private static readonly fontSize = 100;
  private static readonly fontGlyphSize = this.fontSize * 2;

  static readonly glyphSizeH = this.fontGlyphSize / 6;
  static readonly glyphSizeV = this.fontGlyphSize / 5;

  private static glyphs: {[key: string]: HTMLCanvasElement} = {};

  static initialize(): void {
    for (let ci = 32; ci <= 126; ci += 1) {
      const letter = String.fromCharCode(ci);

      const c = document.createElement('canvas');
      c.width = this.fontGlyphSize;
      c.height = this.fontGlyphSize;
      const ctx = c.getContext('2d')!;

      ctx.font = `${this.fontSize}px monospace`;

      ctx.fillStyle = Engine.primaryColor;
      ctx.fillText(letter, 0, this.fontSize);

      // Clear antialiasing
      const pixels = ctx.getImageData(0, 0, this.fontGlyphSize, this.fontGlyphSize).data;
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i] !== 0 || pixels[i + 1] !== 0 || pixels[i + 2] !== 0) {
          const idx = (i / 4) | 0;
          const x = (idx % this.fontGlyphSize) | 0;
          const y = (idx / this.fontGlyphSize) | 0;
          ctx.fillRect(x, y, 1, 1);
        }
      }

      Font.glyphs[letter] = c;
    }
  }

  static draw(text: string, x: number, y: number, ctx: CanvasRenderingContext2D, small: boolean = false): void {
    text.split('').forEach((letter, idx) => {
      const w: number = small ? (this.glyphSizeH / 1.4) : this.glyphSizeH;
      const h: number = small ? (this.glyphSizeV / 1.4) : this.glyphSizeV;
      const spacing: number = small ? 93 : 90;
      ctx.drawImage(Font.glyphs[letter], (x + (idx * (this.fontSize - spacing))), y, w, h);
    });
  }

  static lineLengthPx(text: string, small: boolean): number {
    const w: number = small ? (this.glyphSizeH / 1.4) : this.glyphSizeH;
    const spacing: number = small ? 93 : 90;
    return (((text.length - 1) * (this.fontSize - spacing)) + w) | 0;
  }
}
