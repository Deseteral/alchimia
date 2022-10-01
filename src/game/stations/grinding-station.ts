import { Engine } from 'src/engine/engine';
import { Input } from 'src/engine/input';
import { IngredientAction } from 'src/game/ingredients';
import { Station } from 'src/game/stations/station';

export class GrindingStation extends Station {
  positionX = 200;
  positionY = 75;
  radius = this.positionY - 5;
  targets = [0, 45, 90, 135, 180, 90];
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
    }

    if (this.progress >= 1) this.onStationCompleteCallback(true, IngredientAction.GRIDING);
    if (Input.getKeyDown('b')) this.onStationCompleteCallback(false, IngredientAction.GRIDING);
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Frame
    ctx.beginPath();
    ctx.fillStyle = Engine.primaryColor;
    ctx.arc(this.positionX, this.positionY, this.radius + 2, 0, Math.PI * 2, false);
    ctx.fill();

    // Background
    ctx.beginPath();
    ctx.fillStyle = Engine.secondaryColor;
    ctx.arc(this.positionX, this.positionY, this.radius, 0, Math.PI * 2, false);
    ctx.fill();

    // Progress fill
    this.progressDrawRadius += ((this.progress * this.radius) - this.progressDrawRadius) * 0.1;

    ctx.beginPath();
    ctx.fillStyle = Engine.primaryColor;
    ctx.arc(this.positionX, this.positionY, this.progressDrawRadius, 0, Math.PI * 2, false);
    ctx.fill();
  }
}
