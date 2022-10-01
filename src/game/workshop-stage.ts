import { Input } from 'src/engine/input';
import { Stage } from 'src/engine/stage';
import { Texture, Textures } from 'src/engine/textures';
import { Table } from 'src/game/table';

class ClientTable extends Table {
  update(): void {
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillRect(0, 0, 20, 20);
  }
}

abstract class Station extends Stage {}

class CuttingStation extends Station {
  progress: number = 0;
  left: boolean = true;
  onStationCompleteCallback: () => void;

  constructor(onStationCompleteCallback: () => void) {
    super();
    this.onStationCompleteCallback = onStationCompleteCallback;
  }

  update(): void {
    if (Input.getKeyDown('left') && this.left) {
      this.left = false;
      this.progress += 0.01;
    }

    if (Input.getKeyDown('right') && !this.left) {
      this.left = true;
      this.progress += 0.05;
    }

    if (this.progress >= 1) this.onStationCompleteCallback();
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.drawRect(5, 5, 100, 20);
    ctx.fillRect(5, 5, (100 * this.progress) | 0, 20);

    if (this.left) {
      ctx.fillRect(5, 30, 30, 30);
      ctx.drawRect(40, 30, 30, 30);
    } else {
      ctx.drawRect(5, 30, 30, 30);
      ctx.fillRect(40, 30, 30, 30);
    }
  }
}

class GrindingStation extends Station {
  positionX = 200;
  positionY = 75;
  radius = this.positionY - 5;
  targets = [0, 90, 180, 90];
  progress = 0;

  onStationCompleteCallback: () => void;

  constructor(onStationCompleteCallback: () => void) {
    super();
    this.onStationCompleteCallback = onStationCompleteCallback;
  }

  update(): void {
    const x = Input.pointerX - this.positionX;
    const y = -(Input.pointerY - this.positionY);
    const deg = Math.atan2(y, x) * (180 / Math.PI);
    const value = Math.abs(deg | 0);

    const target = this.targets[0];
    const offsetDeg = 5;
    const targetHit = (value >= (target - offsetDeg) && value <= (target + offsetDeg));

    if (targetHit) {
      // Move current target to the back of array
      const firstElement = this.targets.shift()!;
      this.targets.push(firstElement);

      this.progress += 0.05; // TODO: Randomize progress value
    }

    if (this.progress >= 1) this.onStationCompleteCallback();
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.positionX, this.positionY, this.radius, 0, Math.PI * 2, false);
    ctx.fill();

    ctx.drawRect(5, 5, 100, 20);
    ctx.fillRect(5, 5, (100 * this.progress) | 0, 20);
  }
}

class IngridientsTable extends Table {
  selectedStation = 0;
  activeStation: (Station | null) = null;

  update(): void {
    if (this.activeStation) {
      this.activeStation.update();
      return;
    }

    if (Input.getKeyDown('a')) {
      if (this.selectedStation === 0) {
        this.activeStation = new CuttingStation(() => this.exitStation());
      } else if (this.selectedStation === 1) {
        this.activeStation = new GrindingStation(() => this.exitStation());
      }
    }

    if (Input.getKeyDown('right')) this.selectedStation += 1;
    if (Input.getKeyDown('left')) this.selectedStation -= 1;
    this.selectedStation = Math.clamp(this.selectedStation, 0, 3);
  }

  render(ctx: CanvasRenderingContext2D): void {
    // ctx.fillRect(0, 0, 50, 50);

    ctx.drawImage(Textures.tableTexture, 0, 0);

    this.drawStation(Textures.cuttingTexture, 50, 110, this.selectedStation === 0, ctx);
    this.drawStation(Textures.grindingTexture, 120, 110, this.selectedStation === 1, ctx);
    this.drawStation(Textures.burningTexture, 185, 110, this.selectedStation === 2, ctx);
    this.drawStation(Textures.enchantingTexture, 260, 110, this.selectedStation === 3, ctx);

    if (this.activeStation) this.activeStation.render(ctx);
  }

  private drawStation(texture: Texture, x: number, y: number, isSelected: boolean, ctx: CanvasRenderingContext2D): void {
    if (isSelected) ctx.drawRect(x, y, texture.width, texture.height);
    ctx.drawImage(texture, x, y);
  }

  private exitStation(): void {
    this.activeStation = null;
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
