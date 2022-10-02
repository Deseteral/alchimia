import { Engine } from 'src/engine/engine';
import { Font } from 'src/engine/font';
import { drawFrame } from 'src/engine/frame';
import { Input } from 'src/engine/input';
import { Stage } from 'src/engine/stage';
import { Textures } from 'src/engine/textures';
import { WorkshopStage } from 'src/game/workshop-stage';
import { HowToPlayStage } from 'src/how-to-play-stage';

export class MainMenuStage extends Stage {
  cursor = 0;
  hasSaveData = Engine.hasSavedData();

  onActivate(): void {
  }

  update(): void {
    if (Input.getKeyDown('up')) this.cursor -= 1;
    if (Input.getKeyDown('down')) this.cursor += 1;

    this.cursor = Math.clamp(this.cursor, 0, this.hasSaveData ? 2 : 1);

    if (Input.getKeyDown('a')) {
      if (this.cursor === 0) {
        Engine.newGame();
        Engine.changeStage(new WorkshopStage());
      } else if (this.hasSaveData && this.cursor === 1) {
        Engine.loadGame();
        Engine.changeStage(new WorkshopStage());
      } else if ((this.hasSaveData && this.cursor === 2) || (!this.hasSaveData && this.cursor === 1)) {
        Engine.changeStage(new HowToPlayStage());
      }
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(Textures.menuLogoTexture.normal, 0, 0);

    const w = 130;
    const h = 150;
    const x = (Engine.width - w) / 2;
    const y = 80;

    drawFrame(x, y, w, h, ctx, () => {
      const mx = x + 16 + 2;

      ctx.drawImage(Textures.listPointerRightTexture.normal, x, y + 5 + 30 * this.cursor);

      Font.draw('New game', mx, y, ctx);

      if (this.hasSaveData) {
        Font.draw('Continue', mx, y + 30, ctx);
        Font.draw('How to play', mx, y + 30 * 2, ctx);
      } else {
        Font.draw('How to play', mx, y + 30, ctx);
      }
    });
  }

  onDestroy(): void {
  }
}
