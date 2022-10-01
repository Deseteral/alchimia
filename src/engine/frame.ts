import { Textures } from 'src/engine/textures';

export function drawFrame(x: number, y: number, w: number, h: number, ctx: CanvasRenderingContext2D): void {
  const patchSize = 9;

  // top-left corner
  ctx.drawImage(Textures.frameTexture.normal, 0, 0, patchSize, patchSize, x - patchSize, y - patchSize, patchSize, patchSize);

  // top-right corner
  ctx.drawImage(Textures.frameTexture.normal, patchSize * 2, 0, patchSize, patchSize, w + patchSize + 2, y - patchSize, patchSize, patchSize);

  // bottom-left corner
  ctx.drawImage(Textures.frameTexture.normal, 0, patchSize * 2, patchSize, patchSize, x - patchSize, h + patchSize + 2, patchSize, patchSize);

  // bottom-right corner
  ctx.drawImage(Textures.frameTexture.normal, patchSize * 2, patchSize * 2, patchSize, patchSize, w + patchSize + 2, h + patchSize + 2, patchSize, patchSize);

  // top border
  ctx.drawImage(Textures.frameTexture.normal, patchSize, 0, patchSize, patchSize, x, y - patchSize, w + 2, patchSize);

  // bottom border
  ctx.drawImage(Textures.frameTexture.normal, patchSize, patchSize * 2, patchSize, patchSize, x, h + patchSize + 2, w + 2, patchSize);

  // left border
  ctx.drawImage(Textures.frameTexture.normal, 0, patchSize, patchSize, patchSize, x - patchSize, y, patchSize, h + 2);

  // right border
  ctx.drawImage(Textures.frameTexture.normal, patchSize * 2, patchSize, patchSize, patchSize, w + patchSize + 2, y, patchSize, h + 2);

  // middle
  ctx.drawImage(Textures.frameTexture.normal, patchSize, patchSize, patchSize, patchSize, x, y, w + 2, h + 2);
}
