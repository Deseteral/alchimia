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
// @ts-ignore
import cauldronUrl from 'url:../../assets/cauldron.png';
// @ts-ignore
import frameUrl from 'url:../../assets/frame.png';
// @ts-ignore
import bubbleSmallUrl from 'url:../../assets/bubble_small.png';
// @ts-ignore
import bubbleLargeUrl from 'url:../../assets/bubble_large.png';
// @ts-ignore
import fireUrl from 'url:../../assets/fire.png';
// @ts-ignore
import flowerUrl from 'url:../../assets/flower.png';
// @ts-ignore
import herbUrl from 'url:../../assets/herb.png';
// @ts-ignore
import knifeUrl from 'url:../../assets/knife.png';
// @ts-ignore
import mortarUrl from 'url:../../assets/mortar.png';
// @ts-ignore
import mushroomUrl from 'url:../../assets/mushroom.png';
// @ts-ignore
import spellUrl from 'url:../../assets/spell.png';
// @ts-ignore
import stoneUrl from 'url:../../assets/stone.png';
// @ts-ignore
import xUrl from 'url:../../assets/x.png';
// @ts-ignore
import bookUrl from 'url:../../assets/book.png';
// @ts-ignore
import listPointerRightUrl from 'url:../../assets/list_pointer_right.png';
// @ts-ignore
import coinUrl from 'url:../../assets/coin.png';
// @ts-ignore
import circleUrl from 'url:../../assets/circle.png';
// @ts-ignore
import menuLogoUrl from 'url:../../assets/menu_logo.png';
// @ts-ignore
import fontUrl from 'url:../../assets/font.png';
// @ts-ignore
import fontSmallUrl from 'url:../../assets/font_small.png';

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
  static cauldronTexture: Texture;
  static frameTexture: Texture;
  static bubbleSmallTexture: Texture;
  static bubbleLargeTexture: Texture;
  static fireTexture: Texture;
  static flowerTexture: Texture;
  static herbTexture: Texture;
  static knifeTexture: Texture;
  static mortarTexture: Texture;
  static mushroomTexture: Texture;
  static spellTexture: Texture;
  static stoneTexture: Texture;
  static xTexture: Texture;
  static bookTexture: Texture;
  static listPointerRightTexture: Texture;
  static coinTexture: Texture;
  static circleTexture: Texture;
  static menuLogoTexture: Texture;
  static fontTexture: Texture;
  static fontSmallTexture: Texture;

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
    Textures.cauldronTexture = await Textures.load(cauldronUrl);
    Textures.frameTexture = await Textures.load(frameUrl);
    Textures.bubbleSmallTexture = await Textures.load(bubbleSmallUrl);
    Textures.bubbleLargeTexture = await Textures.load(bubbleLargeUrl);
    Textures.fireTexture = await Textures.load(fireUrl);
    Textures.flowerTexture = await Textures.load(flowerUrl);
    Textures.herbTexture = await Textures.load(herbUrl);
    Textures.knifeTexture = await Textures.load(knifeUrl);
    Textures.mortarTexture = await Textures.load(mortarUrl);
    Textures.mushroomTexture = await Textures.load(mushroomUrl);
    Textures.spellTexture = await Textures.load(spellUrl);
    Textures.stoneTexture = await Textures.load(stoneUrl);
    Textures.xTexture = await Textures.load(xUrl);
    Textures.bookTexture = await Textures.load(bookUrl);
    Textures.listPointerRightTexture = await Textures.load(listPointerRightUrl);
    Textures.coinTexture = await Textures.load(coinUrl);
    Textures.circleTexture = await Textures.load(circleUrl);
    Textures.menuLogoTexture = await Textures.load(menuLogoUrl);
    Textures.fontTexture = await Textures.load(fontUrl);
    Textures.fontSmallTexture = await Textures.load(fontSmallUrl);
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
