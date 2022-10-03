import { Engine } from 'src/engine/engine';
import { Font } from 'src/engine/font';
import { drawFrame } from 'src/engine/frame';
import { Input } from 'src/engine/input';
import { IngredientAction } from 'src/game/ingredients';
import { Station } from 'src/game/stations/station';

export class BurningStation extends Station {
  readonly barHeight = 150;
  readonly cursorHeight = 30;
  cursorY = 0;

  targetY = this.randomNextTargetY();
  nextTargetY = this.randomNextTargetY();
  ticksToNextTarget = 50;

  progress = 0;

  randomNextTargetY(): number {
    return Math.randomRange(0, this.barHeight) | 0;
  }

  update(): void {
    const cursorSpeed = 2;
    const gravity = 1;
    const progressSpeed = 0.004;
    const progressDrain = (progressSpeed / 2);

    this.ticksToNextTarget -= 1;

    // Move cursor
    if (Input.getKey('up')) this.cursorY += cursorSpeed;
    this.cursorY -= gravity;
    this.cursorY = Math.clamp(this.cursorY, 0, (this.barHeight - this.cursorHeight));

    // Move target to it's next position
    this.targetY += (this.nextTargetY - this.targetY) * 0.1;

    // Check if target is within cursor's range
    if (this.targetY >= this.cursorY && this.targetY <= (this.cursorY + this.cursorHeight)) {
      this.progress += progressSpeed;
    } else {
      this.progress -= progressDrain;
    }

    this.progress = Math.clamp(this.progress, 0, 1);

    // Determine target's next position
    if (this.ticksToNextTarget <= 0) {
      this.nextTargetY = this.randomNextTargetY();
      this.ticksToNextTarget = Math.randomRange(60, 4 * 60);
    }

    // Winning condition
    if (this.progress >= 1) this.onStationCompleteCallback(true, IngredientAction.BURNING);
    if (Input.getKeyDown('b')) this.onStationCompleteCallback(false, IngredientAction.BURNING);
  }

  render(ctx: CanvasRenderingContext2D): void {
    const x = 140;
    const y = 28;
    const w = 20;

    drawFrame(x, y, w * 3, this.barHeight, ctx, () => {
      // Frame
      ctx.drawRect(x, y, w, this.barHeight);

      // Cursor
      const drawCursorY = (y + (this.barHeight - this.cursorY - this.cursorHeight)) | 0;
      ctx.fillRect(x, drawCursorY, w, this.cursorHeight);

      // Target
      const drawTargetY = (y + (this.barHeight - this.targetY));
      ctx.fillRect(x + w + 1, drawTargetY, 5, 1);

      // Progress bar
      const progressPx = (this.progress * this.barHeight) | 0;
      ctx.drawRect(x + (w * 2), y, (w / 3) | 0, this.barHeight);
      ctx.fillRect(x + (w * 2), (y + this.barHeight - progressPx), (w / 3) | 0, progressPx);
    });

    // Help
    const helpWidth = 170;
    const helpX = Engine.width - helpWidth - 9 - 2;
    drawFrame(helpX, y, helpWidth, 50, ctx, () => {
      Font.draw('Press the up key to move', helpX, y, ctx, true);
      Font.draw('burning zone up. Keep', helpX, y + 12, ctx, true);
      Font.draw('the cursor in the zone', helpX, y + 12 * 2, ctx, true);
      Font.draw('to burn the ingredient.', helpX, y + 12 * 3, ctx, true);
    });
  }
}
