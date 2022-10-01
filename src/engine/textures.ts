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
// @ts-ignore
import enchantingKeyUpUrl from 'url:../../assets/enchanting_keyup.png';
// @ts-ignore
import enchantingKeyRightUrl from 'url:../../assets/enchanting_keyright.png';
// @ts-ignore
import enchantingKeyDownUrl from 'url:../../assets/enchanting_keydown.png';
// @ts-ignore
import enchantingKeyLeftUrl from 'url:../../assets/enchanting_keyleft.png';

export interface Texture {
  normal: HTMLCanvasElement,
  inverted: HTMLCanvasElement,
}

export abstract class Textures {
  static burningTexture: Texture;
  static cuttingTexture: Texture;
  static enchantingTexture: Texture;
  static grindingTexture: Texture;
  static tableTexture: Texture;
  static enchantingKeyUpTexture: Texture;
  static enchantingKeyRightTexture: Texture;
  static enchantingKeyDownTexture: Texture;
  static enchantingKeyLeftTexture: Texture;

  static async loadTextures(): Promise<void> {
    Textures.burningTexture = await Textures.load(burningUrl);
    Textures.cuttingTexture = await Textures.load(cuttingUrl);
    Textures.enchantingTexture = await Textures.load(enchantingUrl);
    Textures.grindingTexture = await Textures.load(grindingUrl);
    Textures.tableTexture = await Textures.load(tableUrl);
    Textures.enchantingKeyUpTexture = await Textures.load(enchantingKeyUpUrl);
    Textures.enchantingKeyRightTexture = await Textures.load(enchantingKeyRightUrl);
    Textures.enchantingKeyDownTexture = await Textures.load(enchantingKeyDownUrl);
    Textures.enchantingKeyLeftTexture = await Textures.load(enchantingKeyLeftUrl);
  }

  private static async load(url: string): Promise<Texture> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(Textures.processTexture(img));
      img.src = url;
    });
  }

  private static processTexture(img: HTMLImageElement): Texture {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    const invertedCanvas = document.createElement('canvas');
    const ictx = invertedCanvas.getContext('2d')!;

    const w = img.width;
    const h = img.height;

    invertedCanvas.width = canvas.width = w;
    invertedCanvas.height = canvas.height = h;

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

      ictx.fillStyle = (!isBlack) ? Engine.primaryColor : Engine.secondaryColor;
      ictx.fillRect(x, y, 1, 1);
    }

    return { normal: canvas, inverted: invertedCanvas };
  }
}
