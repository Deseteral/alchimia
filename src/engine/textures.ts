import { Engine } from 'src/engine/engine';

// @ts-ignore
import tableUrl from 'url:../../assets/table.png';
// @ts-ignore
import burningUrl from 'url:../../assets/burning.png';
// @ts-ignore
import cuttingUrl from 'url:../../assets/cutting.png';
// @ts-ignore
import enchantingUrl from 'url:../../assets/enchanting.png';
// @ts-ignore
import grindingUrl from 'url:../../assets/grinding.png';

export type Texture = HTMLCanvasElement;

export abstract class Textures {
  static burningTexture: Texture;
  static cuttingTexture: Texture;
  static enchantingTexture: Texture;
  static grindingTexture: Texture;
  static tableTexture: Texture;

  static async loadTextures(): Promise<void> {
    Textures.burningTexture = await Textures.load(burningUrl);
    Textures.cuttingTexture = await Textures.load(cuttingUrl);
    Textures.enchantingTexture = await Textures.load(enchantingUrl);
    Textures.grindingTexture = await Textures.load(grindingUrl);
    Textures.tableTexture = await Textures.load(tableUrl);
  }

  private static async load(url: string): Promise<Texture> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(Textures.processTexture(img));
      img.src = url;
    });
  }

  private static processTexture(img: HTMLImageElement): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const w = img.width;
    const h = img.height;

    canvas.width = w;
    canvas.height = h;

    ctx.drawImage(img, 0, 0);

    const pixels = ctx.getImageData(0, 0, w, h).data;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) continue; // Leave transparent pixels alone

      const isBlack = pixels[i] === 0;
      const idx = (i / 4) | 0;
      const x = (idx % w) | 0;
      const y = (idx / w) | 0;

      ctx.fillStyle = isBlack ? Engine.primaryColor : Engine.secondaryColor;
      ctx.fillRect(x, y, 1, 1);
    }

    return canvas;
  }
}
