import { Stage } from 'src/engine/stage';
import { Table } from 'src/game/table';

class ClientTable extends Table {
  update(): void {
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillRect(0, 0, 20, 20);
  }
}

class IngridientsTable extends Table {
  update(): void {
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillRect(0, 0, 40, 40);
  }
}

class BrewingTable extends Table {
  update(): void {
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillRect(0, 0, 60, 60);
  }
}

export class GameStage extends Stage {
  selectedTable = 0;
  tables = [
    new ClientTable(),
    new IngridientsTable(),
    new BrewingTable(),
  ];

  update(): void {
    this.tables.forEach((table) => table.update());
  }

  render(ctx: CanvasRenderingContext2D): void {
    // TODO: Add sliding between tables
    this.tables[this.selectedTable].render(ctx);
  }
}
