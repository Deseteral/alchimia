import { Engine } from 'src/engine/engine';
import { Font } from 'src/engine/font';
import { drawFrame } from 'src/engine/frame';
import { Input } from 'src/engine/input';
import { playSound, Sound } from 'src/engine/sounds';
import { Textures } from 'src/engine/textures';
import { IngredientAction } from 'src/game/ingredients';
import { Station } from 'src/game/stations/station';

export class CuttingStation extends Station {
  progress: number = 0;
  left: boolean = true;

  update(): void {
    if (Input.getKeyDown('left') && this.left) {
      this.left = false;
      this.progress += 0.01;
      playSound(Sound.KNIFE);
    }

    if (Input.getKeyDown('right') && !this.left) {
      this.left = true;
      this.progress += 0.05;
      playSound(Sound.KNIFE);
    }

    this.progress -= 0.002;
    this.progress = Math.clamp(this.progress, 0, 1);

    if (this.progress >= 1) this.onStationCompleteCallback(true, IngredientAction.CUTTING);
    if (Input.getKeyDown('b')) this.onStationCompleteCallback(false, IngredientAction.CUTTING);
  }

  render(ctx: CanvasRenderingContext2D): void {
    const xx = 100;
    const yy = 15;

    drawFrame(xx, yy, 100, 55, ctx, () => {
      // Progress bar
      ctx.drawRect(xx, yy, 100, 5);
      ctx.fillRect(xx, yy, (100 * this.progress) | 0, 5);

      // Keys
      const kxx = xx + 17;
      if (this.left) {
        ctx.drawImage(Textures.enchantingKeyLeftTexture.normal, kxx, 30);
        ctx.drawImage(Textures.enchantingKeyRightTexture.inverted, kxx + 35, 30);
      } else {
        ctx.drawImage(Textures.enchantingKeyLeftTexture.inverted, kxx, 30);
        ctx.drawImage(Textures.enchantingKeyRightTexture.normal, kxx + 35, 30);
      }
    });

    const helpWidth = 170;
    const helpX = Engine.width - helpWidth - 9 - 2;
    drawFrame(helpX, yy, helpWidth, 26, ctx, () => {
      Font.draw('Press left and right key', helpX, yy, ctx, true);
      Font.draw('alternately to cut', helpX, yy + 12, ctx, true);
    });
  }
}
