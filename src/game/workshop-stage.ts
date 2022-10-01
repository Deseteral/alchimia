import { Engine } from 'src/engine/engine';
import { Stage } from 'src/engine/stage';
import { Textures } from 'src/engine/textures';
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
    ctx.drawImage(Textures.tableTexture, 0, 0);
  }
}

class BrewingTable extends Table {
  update(): void {
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillRect(0, 0, 60, 60);
  }
}

export class WorkshopStage extends Stage {
  selectedTable = 1;
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
