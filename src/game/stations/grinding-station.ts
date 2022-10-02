import { Engine } from 'src/engine/engine';
import { Font } from 'src/engine/font';
import { drawFrame } from 'src/engine/frame';
import { Input } from 'src/engine/input';
import { Textures } from 'src/engine/textures';
import { IngredientAction } from 'src/game/ingredients';
import { Station } from 'src/game/stations/station';

export class GrindingStation extends Station {
  positionX = 130;
  positionY = 80;
  radius = this.positionY - 5;
  targets = [0, 45, 90, 135, 180, 135, 90, 45];
  progress = 0;

  progressDrawRadius = 0;

  update(): void {
    const x = Input.pointerX - this.positionX;
    const y = -(Input.pointerY - this.positionY);
    const deg = Math.atan2(y, x) * (180 / Math.PI);
    const value = Math.abs(deg | 0);

    const target = this.targets[0];
    const offsetDeg = 5;
    const targetHit = (value >= (target - offsetDeg) && value <= (target + offsetDeg));

    // TODO: Check if pointer is within circle

    if (targetHit) {
      // Move current target to the back of array
      const firstElement = this.targets.shift()!;
      this.targets.push(firstElement);

      this.progress += 0.03; // TODO: Randomize progress value
      console.log('hit, next target', this.targets[0]);
    }

    if (this.progress >= 1) this.onStationCompleteCallback(true, IngredientAction.GRIDING);
    if (Input.getKeyDown('b')) this.onStationCompleteCallback(false, IngredientAction.GRIDING);
  }

  render(ctx: CanvasRenderingContext2D): void {
    const xx = this.positionX - 70;
    const yy = this.positionY - 70;

    drawFrame(xx, yy, 140, 140, ctx, () => {
      ctx.drawImage(Textures.circleTexture.inverted, xx, yy);
      ctx.drawImage(Textures.circleTexture.normal, xx, yy);

      // Progress fill
      this.progressDrawRadius += ((this.progress * this.radius) - this.progressDrawRadius) * 0.1;

      ctx.drawImage(
        Textures.circleTexture.inverted,
        this.positionX - this.progressDrawRadius,
        this.positionY - this.progressDrawRadius,
        this.progressDrawRadius * 2,
        this.progressDrawRadius * 2,
      );
    });

    const helpWidth = 170;
    const helpX = Engine.width - helpWidth - 9 - 2;
    drawFrame(helpX, yy, helpWidth, 42, ctx, () => {
      Font.draw('Move the mouse cursor', helpX, yy, ctx, true);
      Font.draw('around the circle to', helpX, yy + 12, ctx, true);
      Font.draw('grind the ingredient', helpX, yy + 12 * 2, ctx, true);
    });
  }
}
