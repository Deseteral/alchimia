import { Textures } from 'src/engine/textures';

export function drawFrame(x: number, y: number, w: number, h: number, ctx: CanvasRenderingContext2D, clippingRegion: () => void): void {
  const patchSize = 9;

  // top-left corner
  ctx.drawImage(
    Textures.frameTexture.normal,
    0,
    0,
    patchSize,
    patchSize,
    x - patchSize,
    y - patchSize,
    patchSize,
    patchSize,
  );

  // top-right corner
  ctx.drawImage(
    Textures.frameTexture.normal,
    patchSize * 2,
    0,
    patchSize,
    patchSize,
    x + w,
    y - patchSize,
    patchSize,
    patchSize,
  );

  // bottom-left corner
  ctx.drawImage(
    Textures.frameTexture.normal,
    0,
    patchSize * 2,
    patchSize,
    patchSize,
    x - patchSize,
    y + h,
    patchSize,
    patchSize,
  );

  // bottom-right corner
  ctx.drawImage(
    Textures.frameTexture.normal,
    patchSize * 2,
    patchSize * 2,
    patchSize,
    patchSize,
    x + w,
    y + h,
    patchSize,
    patchSize,
  );

  // top border
  ctx.drawImage(
    Textures.frameTexture.normal,
    patchSize,
    0,
    patchSize,
    patchSize,
    x,
    y - patchSize,
    w,
    patchSize,
  );

  // bottom border
  ctx.drawImage(
    Textures.frameTexture.normal,
    patchSize,
    patchSize * 2,
    patchSize,
    patchSize,
    x,
    y + h,
    w,
    patchSize,
  );

  // left border
  ctx.drawImage(
    Textures.frameTexture.normal,
    0,
    patchSize,
    patchSize,
    patchSize,
    x - patchSize,
    y,
    patchSize,
    h,
  );

  // right border
  ctx.drawImage(
    Textures.frameTexture.normal,
    patchSize * 2,
    patchSize,
    patchSize,
    patchSize,
    x + w,
    y,
    patchSize,
    h,
  );

  // middle
  ctx.drawImage(
    Textures.frameTexture.normal,
    patchSize,
    patchSize,
    patchSize,
    patchSize,
    x,
    y,
    w,
    h,
  );

  // Clipping content inside
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  clippingRegion();
  ctx.restore();
}
