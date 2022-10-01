import { Input } from 'src/engine/input';
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
    }

    if (Input.getKeyDown('right') && !this.left) {
      this.left = true;
      this.progress += 0.05;
    }

    this.progress -= 0.002;
    this.progress = Math.clamp(this.progress, 0, 1);

    if (this.progress >= 1) this.onStationCompleteCallback(true, IngredientAction.CUTTING);
    if (Input.getKeyDown('b')) this.onStationCompleteCallback(false, IngredientAction.CUTTING);
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.drawRect(5, 5, 100, 20);
    ctx.fillRect(5, 5, (100 * this.progress) | 0, 20);

    if (this.left) {
      ctx.drawImage(Textures.enchantingKeyLeftTexture.normal, 5, 30);
      ctx.drawImage(Textures.enchantingKeyRightTexture.inverted, 40, 30);
    } else {
      ctx.drawImage(Textures.enchantingKeyLeftTexture.inverted, 5, 30);
      ctx.drawImage(Textures.enchantingKeyRightTexture.normal, 40, 30);
    }
  }
}
