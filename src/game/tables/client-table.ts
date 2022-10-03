import { Engine } from 'src/engine/engine';
import { Font } from 'src/engine/font';
import { drawFrame } from 'src/engine/frame';
import { Input } from 'src/engine/input';
import { playSound, Sound } from 'src/engine/sounds';
import { Textures } from 'src/engine/textures';
import { newClientMessage } from 'src/game/messages';
import { Recipe } from 'src/game/recipes';
import { Table } from 'src/game/tables/table';

export class ClientTable extends Table {
  nextClientAtTicks: number = Engine.ticks + (10 * 60);

  update(isSelected: boolean, ticksUntilDayOver: number): void {
    if (Engine.ticks >= this.nextClientAtTicks && ticksUntilDayOver >= 0) {
      const recipeRange: number = (Engine.state.completedOrders <= 3) ? 5 : (Engine.state.recipes.length - 1);
      const recipeIdx: number = Math.randomRange(0, recipeRange);
      const recipe = Engine.state.recipes[recipeIdx];
      Engine.state.orders.push(recipe);

      this.nextClientAtTicks = Engine.ticks + (60 * 10); // I assume the game is running at 60 fps so we can use that to measure time, it's stupid but will be easier to implement pause.

      Engine.state.messageBoard.messages.unshift(newClientMessage(recipe));

      playSound(Sound.NEW_CLIENT);

      console.log('new client with order', recipe);
    }

    if (Input.getKeyDown('right') && isSelected) this.onNextTableCb();
    if (Input.getKeyDown('down') && isSelected) this.openBook();
  }

  render(ctx: CanvasRenderingContext2D): void {
    drawFrame(11, 11, 100, 218, ctx, () => {
      Font.draw('Orders', 12, 8, ctx);

      for (let idx = 0; idx < Engine.state.orders.length; idx += 1) {
        const orderRecipe: Recipe = Engine.state.orders[idx];

        const yy: number = 8 + Font.charHeight + 10 + (idx * (Font.charHeight + 4));
        Font.draw(`-${orderRecipe.name}`, 11, yy, ctx);
      }
    });

    const infoFrameX = 11 + 118;
    drawFrame(infoFrameX, 11, 260, 16, ctx, () => {
      // Day counter
      const dayMessage = `Day ${Engine.state.day}`;
      Font.draw(dayMessage, infoFrameX, 7, ctx);

      // Time counter
      const secondsUnitlNextClient: number = 10 - Math.round((this.nextClientAtTicks - Engine.ticks) / 60);

      for (let tidx = 0; tidx < 10; tidx += 1) {
        const size = 5;
        const xx = infoFrameX + Font.lineLengthPx(dayMessage, false) + 5 + (tidx * (size + 2));
        const yy = 16;
        if (tidx < secondsUnitlNextClient) {
          ctx.fillRect(xx, yy, size, size);
        } else {
          ctx.drawRect(xx, yy, size, size);
        }
      }

      // Gold
      // TODO: Make text right-aligned
      ctx.drawImage(Textures.coinTexture.normal, 300, 11);
      Font.draw(Engine.state.gold.toString(), 300 + 16 + 2, 7, ctx);
    });

    const messageFrameWidth: number = 260;
    drawFrame(11 + 118, 11 + 34, messageFrameWidth, 184, ctx, () => {
      let line = 0;
      Engine.state.messageBoard.messages.forEach((message, msgIdx) => {
        const basexx: number = 11 + 118;

        [...message.text].reverse().forEach((txt) => {
          const xx: number = message.rightSide ? (basexx + messageFrameWidth - Font.lineLengthPx(txt, true)) : basexx;
          const yy: number = 215 - (line * Font.charHeightSmall) - (msgIdx * 7);
          Font.draw(txt, xx, yy, ctx, true);

          line += 1;
        });
      });
    });
  }
}
