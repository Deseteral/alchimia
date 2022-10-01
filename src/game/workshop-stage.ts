import { Engine } from 'src/engine/engine';
import { Font } from 'src/engine/font';
import { drawFrame } from 'src/engine/frame';
import { Input, Keys } from 'src/engine/input';
import { Stage } from 'src/engine/stage';
import { Texture, Textures } from 'src/engine/textures';
import { Ingredient, IngredientAction, PreparedIngredient } from 'src/game/ingredients';
import { drawRecipe, RECIPES } from 'src/game/recipes';
import { Table } from 'src/game/table';

class ClientTable extends Table {
  isInBookView: boolean = true;
  pageNumber = 0;

  update(): void {
    if (this.isInBookView) {
      if (Input.getKeyDown('up')) this.isInBookView = false;
      if (Input.getKeyDown('left')) this.pageNumber -= 1;
      if (Input.getKeyDown('right')) this.pageNumber += 1;

      this.pageNumber = Math.clamp(this.pageNumber, 0, Math.ceil(RECIPES.length / 2) - 1);
    } else {
      if (Input.getKeyDown('right')) this.onNextTableCb();
      if (Input.getKeyDown('down')) this.isInBookView = true;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.isInBookView) {
      ctx.drawImage(Textures.bookTexture.normal, 0, 0);

      const r1 = RECIPES[this.pageNumber * 2];
      const r2 = RECIPES[this.pageNumber * 2 + 1];
      if (r1) drawRecipe(r1, 60, 20, ctx);
      if (r2) drawRecipe(r2, 225, 20, ctx);

      Font.draw(`${this.pageNumber * 2 + 1}`, 50, 200, ctx);
      Font.draw(`${this.pageNumber * 2 + 2}`, 350, 200, ctx);
    }
  }
}

type StationCompleteCallback = (success: boolean, action: IngredientAction) => void

abstract class Station extends Stage {
  onStationCompleteCallback: StationCompleteCallback;

  constructor(cb: StationCompleteCallback) {
    super();
    this.onStationCompleteCallback = cb;
  }
}

class CuttingStation extends Station {
  progress: number = 0;
  left: boolean = true;

  update(): void {
    if (Input.getKeyDown('left') && this.left) {
      this.left = false;
      this.progress += 0.01;
    }

    if (Input.getKeyDown('right') && !this.left) {
      this.left = true;
      this.progress += 0.05;
    }

    this.progress -= 0.002;
    this.progress = Math.clamp(this.progress, 0, 1);

    if (this.progress >= 1) this.onStationCompleteCallback(true, IngredientAction.CUTTING);
    if (Input.getKeyDown('b')) this.onStationCompleteCallback(false, IngredientAction.CUTTING);
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.drawRect(5, 5, 100, 20);
    ctx.fillRect(5, 5, (100 * this.progress) | 0, 20);

    if (this.left) {
      ctx.drawImage(Textures.enchantingKeyLeftTexture.normal, 5, 30);
      ctx.drawImage(Textures.enchantingKeyRightTexture.inverted, 40, 30);
    } else {
      ctx.drawImage(Textures.enchantingKeyLeftTexture.inverted, 5, 30);
      ctx.drawImage(Textures.enchantingKeyRightTexture.normal, 40, 30);
    }
  }
}

class GrindingStation extends Station {
  positionX = 200;
  positionY = 75;
  radius = this.positionY - 5;
  targets = [0, 45, 90, 135, 180, 90];
  progress = 0;

  progressDrawRadius = 0;

  update(): void {
    const x = Input.pointerX - this.positionX;
    const y = -(Input.pointerY - this.positionY);
    const deg = Math.atan2(y, x) * (180 / Math.PI);
    const value = Math.abs(deg | 0);

    const target = this.targets[0];
    const offsetDeg = 5;
    const targetHit = (value >= (target - offsetDeg) && value <= (target + offsetDeg));

    // TODO: Check if pointer is within circle

    if (targetHit) {
      // Move current target to the back of array
      const firstElement = this.targets.shift()!;
      this.targets.push(firstElement);

      this.progress += 0.03; // TODO: Randomize progress value
    }

    if (this.progress >= 1) this.onStationCompleteCallback(true, IngredientAction.GRIDING);
    if (Input.getKeyDown('b')) this.onStationCompleteCallback(false, IngredientAction.GRIDING);
  }

  render(ctx: CanvasRenderingContext2D): void {
    // Frame
    ctx.beginPath();
    ctx.fillStyle = Engine.primaryColor;
    ctx.arc(this.positionX, this.positionY, this.radius + 2, 0, Math.PI * 2, false);
    ctx.fill();

    // Background
    ctx.beginPath();
    ctx.fillStyle = Engine.secondaryColor;
    ctx.arc(this.positionX, this.positionY, this.radius, 0, Math.PI * 2, false);
    ctx.fill();

    // Progress fill
    this.progressDrawRadius += ((this.progress * this.radius) - this.progressDrawRadius) * 0.1;

    ctx.beginPath();
    ctx.fillStyle = Engine.primaryColor;
    ctx.arc(this.positionX, this.positionY, this.progressDrawRadius, 0, Math.PI * 2, false);
    ctx.fill();
  }
}

class BurningStation extends Station {
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
    const x = 5;
    const y = 5;
    const w = 20;

    // Fill background
    ctx.fillStyle = Engine.secondaryColor;
    ctx.fillRect(x, y, w * 3, this.barHeight);

    // Frame
    ctx.fillStyle = Engine.primaryColor;
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
  }
}

interface Note {
  dir: number,
  pos: number,
  hit: boolean,
  counted: boolean,
}

class EnchantmentStation extends Station {
  readonly noteSize = 32;
  readonly hitLineX = 30 + ((this.noteSize / 2) | 0);

  noteSpeed: number = 3;
  notes: Note[] = [];

  ticksToNextNote: number = 0;

  progress: number = 0;

  update(): void {
    this.ticksToNextNote -= 1;

    // Move notes
    for (let idx = 0; idx < this.notes.length; idx += 1) {
      this.notes[idx].pos -= this.noteSpeed;
    }

    // Check if note is hit
    ['up', 'right', 'down', 'left'].forEach((kp, ki) => {
      if (Input.getKeyDown(kp as Keys)) {
        let noteWasHit: boolean = false;

        for (let idx = 0; idx < this.notes.length; idx += 1) {
          const note = this.notes[idx];

          if (note.dir !== ki) continue;

          if (this.hitLineX >= note.pos && this.hitLineX <= (note.pos + this.noteSize)) {
            this.notes[idx].hit = true;
            this.notes[idx].counted = true;
            noteWasHit = true;
            this.progress += 0.1;
          }
        }

        // When the key was pressed but the note was not hit
        if (!noteWasHit) this.progress -= 0.1;
      }
    });

    // Check for missed notes
    for (let idx = 0; idx < this.notes.length; idx += 1) {
      const note = this.notes[idx];

      if ((note.pos + this.noteSize + 5) < (this.hitLineX - 10) && !note.hit && !note.counted) {
        this.progress -= 0.1;
        note.counted = true;
      }
    }

    // Normalize progress value
    this.progress = Math.clamp(this.progress, 0, 1);

    // Add new notes
    if (this.ticksToNextNote <= 0) {
      this.notes.push({ dir: Math.randomRange(0, 3), pos: (Engine.width + this.noteSize), hit: false, counted: false });
      this.ticksToNextNote = Math.randomRange(30, 80);
    }

    // Removed old notes
    this.notes = this.notes.filter((note) => (note.pos > -this.noteSize || !note.counted));

    // Check for winning condition
    if (this.progress >= 1) this.onStationCompleteCallback(true, IngredientAction.ENCHANTING);
    if (Input.getKeyDown('b')) this.onStationCompleteCallback(false, IngredientAction.ENCHANTING);
  }

  render(ctx: CanvasRenderingContext2D): void {
    const noteBarX = this.hitLineX - ((this.noteSize / 2) | 0);
    const noteBarY = 15;

    // Clear background
    const clearHeight = noteBarY + (4 * (this.noteSize + 5));

    ctx.fillStyle = Engine.secondaryColor;
    ctx.fillRect(0, 0, Engine.width, clearHeight);

    ctx.fillStyle = Engine.primaryColor;
    ctx.fillRect(0, clearHeight, Engine.width, 1);

    // Progress bar
    const progressBarY = 5;
    const progressBarHeight = 5;

    ctx.drawRect(5, progressBarY, 100, progressBarHeight);
    ctx.fillRect(5, progressBarY, (100 * this.progress) | 0, progressBarHeight);

    // Hit line
    const hitLineY = (progressBarY + progressBarHeight + 1);
    ctx.fillRect(this.hitLineX, hitLineY, 1, (clearHeight - hitLineY - 1));

    // Notes
    this.notes.forEach((note) => {
      if (note.hit) return;

      const nx = (note.pos | 0);
      const ny = noteBarY + (note.dir * (this.noteSize + 5));

      if (note.dir === 0) {
        ctx.drawImage(Textures.enchantingKeyUpTexture.inverted, nx, ny);
      } else if (note.dir === 1) {
        ctx.drawImage(Textures.enchantingKeyRightTexture.inverted, nx, ny);
      } else if (note.dir === 2) {
        ctx.drawImage(Textures.enchantingKeyDownTexture.inverted, nx, ny);
      } else if (note.dir === 3) {
        ctx.drawImage(Textures.enchantingKeyLeftTexture.inverted, nx, ny);
      }
    });

    // Note bar
    ctx.drawImage(Textures.enchantingKeyUpTexture.normal, noteBarX, noteBarY + (0 * (this.noteSize + 5)));
    ctx.drawImage(Textures.enchantingKeyRightTexture.normal, noteBarX, noteBarY + (1 * (this.noteSize + 5)));
    ctx.drawImage(Textures.enchantingKeyDownTexture.normal, noteBarX, noteBarY + (2 * (this.noteSize + 5)));
    ctx.drawImage(Textures.enchantingKeyLeftTexture.normal, noteBarX, noteBarY + (3 * (this.noteSize + 5)));
  }
}

class IngredientsTable extends Table {
  selectedStation = 0;
  activeStation: (Station | null) = null;

  update(): void {
    if (this.activeStation) {
      this.activeStation.update();
      return;
    }

    if (Input.getKeyDown('a')) {
      const cb: StationCompleteCallback = (success: boolean, action: IngredientAction) => {
        if (success) {
          Engine.state.preparedIngredients.push({ ingredient: Ingredient.HERB, action });
        }
        this.exitStation();
      };

      if (this.selectedStation === 0) {
        this.activeStation = new CuttingStation(cb);
      } else if (this.selectedStation === 1) {
        this.activeStation = new GrindingStation(cb);
      } else if (this.selectedStation === 2) {
        this.activeStation = new BurningStation(cb);
      } else if (this.selectedStation === 3) {
        this.activeStation = new EnchantmentStation(cb);
      }
    }

    if (Input.getKeyDown('right')) this.selectedStation += 1;
    if (Input.getKeyDown('left')) this.selectedStation -= 1;

    if (this.selectedStation < 0) this.onPreviousTableCb();
    if (this.selectedStation > 3) this.onNextTableCb();

    this.selectedStation = Math.clamp(this.selectedStation, 0, 3);
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(Textures.tableTexture.normal, 0, 0);

    this.drawStation(Textures.cuttingTexture, 50, 110, this.selectedStation === 0, ctx);
    this.drawStation(Textures.grindingTexture, 120, 110, this.selectedStation === 1, ctx);
    this.drawStation(Textures.burningTexture, 185, 110, this.selectedStation === 2, ctx);
    this.drawStation(Textures.enchantingTexture, 260, 110, this.selectedStation === 3, ctx);

    if (this.activeStation) this.activeStation.render(ctx);
  }

  private drawStation(texture: Texture, x: number, y: number, isSelected: boolean, ctx: CanvasRenderingContext2D): void {
    if (isSelected) ctx.drawRect(x, y, texture.normal.width, texture.normal.height);
    ctx.drawImage(texture.normal, x, y);
  }

  private exitStation(): void {
    this.activeStation = null;
  }
}

class BrewingTable extends Table {
  ingredientCursor = 0;
  showList = false;
  ingridiendsInside: PreparedIngredient[] = [];
  ticksUntilBrewingDone = 0;

  bubbleParticles: ({ x: number, y: number, velocity: number, isSmall: boolean, offset: number })[] = [];
  ticksUntilNextBubble = 0;

  update(): void {
    this.ticksUntilBrewingDone -= 1;

    if (this.showList) {
      if (Input.getKeyDown('up')) this.ingredientCursor -= 1;
      if (Input.getKeyDown('down')) this.ingredientCursor += 1;
      if (Input.getKeyDown('b')) {
        Engine.state.preparedIngredients.push(...this.ingridiendsInside);
        this.resetListState();
        this.showList = false;
      }

      if (Input.getKeyDown('a')) {
        const [ing] = Engine.state.preparedIngredients.splice(this.ingredientCursor, 1);
        this.ingridiendsInside.push(ing);
        this.ingredientCursor -= 1;
      }

      this.ingredientCursor = Math.clamp(this.ingredientCursor, 0, Engine.state.preparedIngredients.length - 1);
    } else {
      this.ticksUntilNextBubble -= 1;

      if (Input.getKeyDown('left')) this.onPreviousTableCb();
      if (Input.getKeyDown('a')) {
        this.resetListState();
        this.showList = true;
      }

      if (this.ticksUntilNextBubble <= 0 && this.ticksUntilBrewingDone > 0) {
        this.bubbleParticles.push({
          x: Math.randomRange(280, 330),
          y: Math.randomRange(80, 100),
          velocity: 0,
          isSmall: Math.random() > 0.5,
          offset: Math.randomRange(0, 1000),
        });
        this.ticksUntilNextBubble = Math.randomRange(10, 30);
      }

      for (let i = 0; i < this.bubbleParticles.length; i += 1) {
        this.bubbleParticles[i].velocity += 0.01;
        this.bubbleParticles[i].y -= this.bubbleParticles[i].velocity;
      }
    }

    this.bubbleParticles = this.bubbleParticles.filter((b) => b.y > -10);
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(Textures.tableTexture.normal, 0, 0);
    ctx.drawImage(Textures.cauldronTexture.normal, 250, 70);

    if (this.showList) {
      drawFrame(11, 11, 100, 218, ctx, () => {
        Engine.state.preparedIngredients.forEach((pi, idx) => {
          Font.draw(`${idx === this.ingredientCursor ? '>' : ' '}${pi.ingredient}`, 11, 4 + idx * (Font.glyphSizeV / 2), ctx);
        });
      });
    }

    this.bubbleParticles.forEach((bubble) => {
      const t = bubble.isSmall ? Textures.bubbleSmallTexture : Textures.bubbleLargeTexture;
      ctx.drawImage(t.normal, bubble.x + (Math.sin((Engine.ticks + bubble.offset) / 25) * 3) | 0, bubble.y);
    });
  }

  private resetListState(): void {
    this.ingredientCursor = 0;
    this.ingridiendsInside = [];
  }
}

export class WorkshopStage extends Stage {
  selectedTable = 0;
  tables = [
    new ClientTable(() => this.nextTable(), () => this.prevTable()),
    new IngredientsTable(() => this.nextTable(), () => this.prevTable()),
    new BrewingTable(() => this.nextTable(), () => this.prevTable()),
  ];

  update(): void {
    this.tables[this.selectedTable].update();
  }

  render(ctx: CanvasRenderingContext2D): void {
    // TODO: Add sliding between tables
    this.tables[this.selectedTable].render(ctx);

    ctx.drawRect(0, 0, Engine.width, Engine.height);
  }

  nextTable(): void {
    this.selectedTable += 1;
    this.selectedTable = Math.clamp(this.selectedTable, 0, 2);
  }

  prevTable(): void {
    this.selectedTable -= 1;
    this.selectedTable = Math.clamp(this.selectedTable, 0, 2);
  }
}
