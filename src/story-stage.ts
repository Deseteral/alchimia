import { Engine } from 'src/engine/engine';
import { Font } from 'src/engine/font';
import { Input } from 'src/engine/input';
import { playSound, Sound } from 'src/engine/sounds';
import { Stage } from 'src/engine/stage';
import { Textures } from 'src/engine/textures';
import { WorkshopStage } from 'src/game/workshop-stage';

export class StoryStage extends Stage {
  pageNumber = 0;

  pages: (string[])[] = [
    [
      "You've just graduated",
      'from The Magic School.',
      '',
      'Congratulations!',
    ],
    [
      'After 10 long years',
      "of studying. You're",
      'finally free!',
    ],
    [
      "At the School you've",
      'learned everything',
      'about magic.',
    ],
    [
      'You studied spell cas-',
      '-ting, history, making',
      'potions, physics and',
      'engineering.',
    ],
    [
      'When you were study-',
      '-ing late at the',
      "school library, you've",
      'often dreamed about',
      'seeing the world...',
    ],
    [
      '...and living in',
      'Oakville.',
    ],
    [
      'Now finally free from',
      'the burden of school',
      "life, you've decided",
      'to fulfill your dream.',
    ],
    [
      'Running away from',
      'the school gate with',
      'just one small bag',
      'of your personal',
      'belongings you head',
      'to the Royal port.',
    ],
    [
      "You've barely managed",
      'to catch the sky ship',
      'to Oakville, and after',
      'a couple of days of',
      'traveling you arrive',
      'at your destination.',
    ],
    [
      'There you take a loan',
      'for 500 gold and open',
      'your own potion store.',
    ],
    [
      "You're living the",
      'dream. Good luck and',
      'have fun!',
    ],
    [
      '',
      '',
      '',
      '',
      'Press Enter to begin',
    ],
  ];

  onActivate(): void {
  }

  update(): void {
    if (Input.getKeyDown('left')) {
      this.pageNumber -= 1;
      playSound(Sound.BOOK);
    }
    if (Input.getKeyDown('right')) {
      this.pageNumber += 1;
      playSound(Sound.BOOK);
    }
    this.pageNumber = Math.clamp(this.pageNumber, 0, Math.ceil(this.pages.length / 2) - 1);

    if (this.pageNumber === 5 && Input.getKeyDown('a')) {
      Engine.changeStage(new WorkshopStage());
      playSound(Sound.MENU_CONFIRM);
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(Textures.bookTexture.normal, 0, 0);

    const t1: string[] = this.pages[this.pageNumber * 2];
    const t2: string[] = this.pages[this.pageNumber * 2 + 1];

    if (t1) {
      t1.forEach((line, idx) => {
        Font.draw(line, 47, 24 + idx * (Font.charHeightSmall + 2), ctx, true);
      });

      Font.draw(`${this.pageNumber * 2 + 1}`, 50, 200, ctx);
    }

    if (t2) {
      t2.forEach((line, idx) => {
        Font.draw(line, 212, 24 + idx * (Font.charHeightSmall + 2), ctx, true);
      });

      Font.draw(`${(this.pageNumber * 2 + 2).toString().padStart(2, ' ')}`, 340, 200, ctx);
    }
  }

  onDestroy(): void {
  }
}
