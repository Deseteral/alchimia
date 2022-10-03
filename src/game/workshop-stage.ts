import { DaySummaryStage } from 'src/day-summary-stage';
import { Engine } from 'src/engine/engine';
import { Font } from 'src/engine/font';
import { Input } from 'src/engine/input';
import { playSound, Sound } from 'src/engine/sounds';
import { Stage } from 'src/engine/stage';
import { Textures } from 'src/engine/textures';
import { dayOverMessage } from 'src/game/messages';
import { drawRecipe, Recipe } from 'src/game/recipes';
import { BrewingTable } from 'src/game/tables/brewing-table';
import { ClientTable } from 'src/game/tables/client-table';
import { IngredientsTable } from 'src/game/tables/ingredients-table';

export class WorkshopStage extends Stage {
  selectedTable = 0;
  tables = [
    new ClientTable(() => this.nextTable(), () => this.prevTable(), () => this.openBook()),
    new IngredientsTable(() => this.nextTable(), () => this.prevTable(), () => this.openBook()),
    new BrewingTable(() => this.nextTable(), () => this.prevTable(), () => this.openBook()),
  ];

  isInBookView: boolean = false;
  pageNumber = 0;

  ticksUntilDayOver = (1 * 60 * 60); // 1 minute day

  goldAtTheStartOfTheDay = 0;

  onActivate(): void {
    Engine.saveGame();

    Engine.state.day += 1;
    this.goldAtTheStartOfTheDay = Engine.state.gold;
  }

  update(): void {
    if (Engine.shouldCountTicks) this.ticksUntilDayOver -= 1;

    // Book view
    if (this.isInBookView) {
      this.updateBook();
      return;
    }

    // Update tables
    const thisFrameSelectedTable = this.selectedTable;
    this.tables.forEach((table, idx) => {
      table.update(thisFrameSelectedTable === idx, this.ticksUntilDayOver);
    });

    // Put day over message
    if (this.ticksUntilDayOver === 0) {
      Engine.state.messageBoard.messages.unshift(dayOverMessage());
    }

    // Transition to day summary screen
    if (this.ticksUntilDayOver < 0 && Engine.state.orders.length === 0) {
      Engine.changeStage(new DaySummaryStage());
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    // TODO: Add sliding between tables
    this.tables[this.selectedTable].render(ctx);

    if (this.isInBookView) {
      this.renderBook(ctx);
    }

    ctx.drawRect(0, 0, Engine.width, Engine.height);
  }

  nextTable(): void {
    this.selectedTable += 1;
    this.selectedTable = Math.clamp(this.selectedTable, 0, 2);
    playSound(Sound.TABLE_MOVE);
  }

  prevTable(): void {
    this.selectedTable -= 1;
    this.selectedTable = Math.clamp(this.selectedTable, 0, 2);
    playSound(Sound.TABLE_MOVE);
  }

  onDestroy(): void {
    Engine.state.messageBoard = { messages: [] };
    Engine.state.orders = [];

    Engine.state.goldLastDay = Engine.state.gold - this.goldAtTheStartOfTheDay;

    if (!Engine.state.debtPaid && Engine.state.gold >= 500) {
      Engine.state.gold -= 500;
      Engine.state.debtPaid = true;
    }
  }

  private updateBook(): void {
    if (Input.getKeyDown('up') || Input.getKeyDown('b')) {
      this.closeBook();
    }
    if (Input.getKeyDown('left')) {
      this.pageNumber -= 1;
      playSound(Sound.BOOK);
    }
    if (Input.getKeyDown('right')) {
      this.pageNumber += 1;
      playSound(Sound.BOOK);
    }

    this.pageNumber = Math.clamp(this.pageNumber, 0, Math.ceil(Engine.state.recipes.length / 2) - 1);
  }

  private renderBook(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(Textures.bookTexture.normal, 0, 0);

    const r1: Recipe = Engine.state.recipes[this.pageNumber * 2];
    const r2: Recipe = Engine.state.recipes[this.pageNumber * 2 + 1];

    if (r1) {
      drawRecipe(r1, 60, 20, ctx);
      Font.draw(`${this.pageNumber * 2 + 1}`, 50, 200, ctx);
    }

    if (r2) {
      drawRecipe(r2, 225, 20, ctx);
      Font.draw(`${(this.pageNumber * 2 + 2).toString().padStart(2, ' ')}`, 340, 200, ctx);
    }

    // TODO: Add animation for changing pages
  }

  private openBook(): void {
    Engine.shouldCountTicks = false;
    this.isInBookView = true;
    playSound(Sound.TABLE_MOVE);
  }

  private closeBook(): void {
    Engine.shouldCountTicks = true;
    this.isInBookView = false;
    playSound(Sound.TABLE_MOVE);
  }
}
