import { Engine } from 'src/engine/engine';
import { Font } from 'src/engine/font';
import { drawFrame } from 'src/engine/frame';
import { Input } from 'src/engine/input';
import { playSound, Sound } from 'src/engine/sounds';
import { Stage } from 'src/engine/stage';
import { Textures } from 'src/engine/textures';
import { WorkshopStage } from 'src/game/workshop-stage';
import { HowToPlayStage } from 'src/how-to-play-stage';
import { StoryStage } from 'src/story-stage';

export class MainMenuStage extends Stage {
  cursor = 0;
  hasSaveData = Engine.hasSavedData();

  onActivate(): void {
  }

  update(): void {
    if (Input.getKeyDown('up')) {
      this.cursor -= 1;
      playSound(Sound.MENU_PICK);
    }
    if (Input.getKeyDown('down')) {
      this.cursor += 1;
      playSound(Sound.MENU_PICK);
    }

    this.cursor = Math.clamp(this.cursor, 0, this.hasSaveData ? 2 : 1);

    if (Input.getKeyDown('a')) {
      if (this.cursor === 0) {
        Engine.newGame();
        Engine.changeStage(new StoryStage());
      } else if (this.hasSaveData && this.cursor === 1) {
        Engine.loadGame();
        Engine.changeStage(new WorkshopStage());
      } else if ((this.hasSaveData && this.cursor === 2) || (!this.hasSaveData && this.cursor === 1)) {
        Engine.changeStage(new HowToPlayStage());
      }

      playSound(Sound.MENU_CONFIRM);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.drawRect(0, 0, Engine.width, Engine.height);

    ctx.drawImage(Textures.menuLogoTexture.normal, 0, 0);

    const w = 132;
    const h = 82;
    const x = (Engine.width - w) / 2;
    const y = 90;

    drawFrame(x, y, w, h, ctx, () => {
      const mx = x + 16 + 2;

      ctx.drawImage(Textures.listPointerRightTexture.normal, x, y + 2 + (30 * this.cursor));

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
