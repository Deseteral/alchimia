import { Engine } from 'src/engine/engine';
import { Font } from 'src/engine/font';
import { Input } from 'src/engine/input';
import { playSound, Sound } from 'src/engine/sounds';
import { Stage } from 'src/engine/stage';
import { MainMenuStage } from 'src/main-menu-stage';

export class HowToPlayStage extends Stage {
  lines = [
    'Use WASD or arrow keys to move',
    'Esc to go back, Enter to confirm/activate',
    '',
    'Every 10 seconds new customer comes in',
    'Press down to pull the recipe book and search for',
    'the recipe for potion that they want',
    '',
    'Use the tools on the middle table to prepare ingredients',
    'Then put those in the cauldron on the right most table',
    '',
    '',
    '',
    'Created in 48 hours for Ludum Dare 51',
    '',
    'Press escape to go back',
  ];

  onActivate(): void {
  }

  update(): void {
    if (Input.getKeyDown('b')) {
      Engine.changeStage(new MainMenuStage());
      playSound(Sound.MENU_CONFIRM);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.drawRect(0, 0, Engine.width, Engine.height);

    this.lines.forEach((line, idx) => {
      Font.draw(line, 3, idx * 15, ctx, true);
    });
  }

  onDestroy(): void {
  }
}
