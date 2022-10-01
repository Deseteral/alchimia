import { Engine } from 'src/engine/engine';
import { Font } from 'src/engine/font';
import { drawFrame } from 'src/engine/frame';
import { Input } from 'src/engine/input';
import { Stage } from 'src/engine/stage';
import { Texture, Textures } from 'src/engine/textures';
import { BurningStation } from 'src/game/stations/burning-station';
import { CuttingStation } from 'src/game/stations/cutting-station';
import { EnchantmentStation } from 'src/game/stations/enchantment-station';
import { GrindingStation } from 'src/game/stations/grinding-station';
import { Ingredient, IngredientAction, ingredientDisplayName, Ingredients, PreparedIngredient } from 'src/game/ingredients';
import { drawPreparedIngredientRow, drawRecipe, getIngredientIcon, RECIPES } from 'src/game/recipes';
import { Station, StationCompleteCallback } from 'src/game/stations/station';
import { Table } from 'src/game/table';
import { findMatchingRecipe } from 'src/game/recipe-logic';

class ClientTable extends Table {
  update(): void {
    if (Input.getKeyDown('right')) this.onNextTableCb();
    if (Input.getKeyDown('down')) this.openBook();
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillRect(10, 10, 50, 50);
  }
}

class IngredientsTable extends Table {
  selectedStation: number = 0;
  activeStation: (Station | null) = null;

  isIndredientPickerOpen: boolean = false;
  ingredientCursor: number = 0;

  update(): void {
    if (this.activeStation) {
      this.activeStation.update();
      return;
    }

    if (!this.isIndredientPickerOpen && Input.getKeyDown('a')) {
      this.isIndredientPickerOpen = true;
      return;
    }

    if (this.isIndredientPickerOpen) {
      if (Input.getKeyDown('up')) this.ingredientCursor -= 1;
      if (Input.getKeyDown('down')) this.ingredientCursor += 1;
      if (Input.getKeyDown('b')) {
        this.isIndredientPickerOpen = false;
        return;
      }
      this.ingredientCursor = Math.clamp(this.ingredientCursor, 0, 5 - 1);

      if (Input.getKeyDown('a')) {
        const selectedIngredient: Ingredient = Ingredients[this.ingredientCursor];
        this.ingredientCursor = 0;
        this.isIndredientPickerOpen = false;

        const cb: StationCompleteCallback = (success: boolean, action: IngredientAction) => {
          if (success) {
            Engine.state.preparedIngredients.push({ ingredient: selectedIngredient, action });
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

      return;
    }

    if (Input.getKeyDown('right')) this.selectedStation += 1;
    if (Input.getKeyDown('left')) this.selectedStation -= 1;

    if (this.selectedStation < 0) {
      this.onPreviousTableCb();
    } else if (this.selectedStation > 3) {
      this.onNextTableCb();
    } else if (Input.getKeyDown('down')) {
      this.openBook();
    }

    this.selectedStation = Math.clamp(this.selectedStation, 0, 3);
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(Textures.tableTexture.normal, 0, 0);

    this.drawStation(Textures.cuttingTexture, 50, 110, this.selectedStation === 0, ctx);
    this.drawStation(Textures.grindingTexture, 120, 110, this.selectedStation === 1, ctx);
    this.drawStation(Textures.burningTexture, 185, 110, this.selectedStation === 2, ctx);
    this.drawStation(Textures.enchantingTexture, 260, 110, this.selectedStation === 3, ctx);

    if (this.isIndredientPickerOpen) {
      drawFrame(11, 11, 120, 97, ctx, () => {
        Ingredients.forEach((ing, idx) => {
          const xx: number = 11;
          const yy: number = 6 + idx * (Font.glyphSizeV / 2);
          if (idx === this.ingredientCursor) ctx.drawImage(Textures.listPointerRightTexture.normal, xx, yy + 5);
          ctx.drawImage(getIngredientIcon(ing), xx + 16, yy + 5);
          Font.draw(`${ingredientDisplayName(ing)}`, xx + 16 + 16 + 2, yy, ctx);
        });
      });
    }

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
  showList = false;

  ingredientCursor = 0;
  selectedIngredientCursor = 0;
  selectedIngredients: PreparedIngredient[] = [];
  leftColumn = true;

  ticksUntilBrewingDone = 0;

  bubbleParticles: ({ x: number, y: number, velocity: number, isSmall: boolean, offset: number })[] = [];
  ticksUntilNextBubble = 0;

  update(): void {
    this.ticksUntilBrewingDone -= 1;

    if (this.showList) {
      if (Input.getKeyDown('up')) {
        if (this.leftColumn) {
          this.ingredientCursor -= 1;
        } else {
          this.selectedIngredientCursor -= 1;
        }
      } else if (Input.getKeyDown('down')) {
        if (this.leftColumn) {
          this.ingredientCursor += 1;
        } else {
          this.selectedIngredientCursor += 1;
        }
      }

      if (Input.getKeyDown('left') && Engine.state.preparedIngredients.length > 0) {
        this.leftColumn = true;
      } else if (Input.getKeyDown('right') && this.selectedIngredients.length > 0) {
        this.selectedIngredientCursor = this.selectedIngredients.length;
        this.leftColumn = false;
      }

      if (Input.getKeyDown('b')) {
        Engine.state.preparedIngredients.push(...this.selectedIngredients);
        this.resetListState();
        this.showList = false;
      }

      if (Input.getKeyDown('a')) {
        if (this.leftColumn) {
          if (Engine.state.preparedIngredients.length > 0) {
            const [ing] = Engine.state.preparedIngredients.splice(this.ingredientCursor, 1);
            this.selectedIngredients.push(ing);
            this.ingredientCursor -= 1;

            if (Engine.state.preparedIngredients.length === 0) {
              this.selectedIngredientCursor = this.selectedIngredients.length;
              this.leftColumn = false;
            }
          }
        } else {
          if (this.selectedIngredientCursor === this.selectedIngredients.length) {
            const r = findMatchingRecipe(this.selectedIngredients);
            if (r) console.log('found recipe', r); else console.log('recipe not found');

            this.resetListState();
            this.showList = false;
          } else {
            const [ing] = this.selectedIngredients.splice(this.selectedIngredientCursor, 1);
            Engine.state.preparedIngredients.push(ing);
            this.selectedIngredientCursor -= 1;

            if (this.selectedIngredients.length === 0) this.leftColumn = true;
          }
        }
      }

      this.ingredientCursor = Math.clamp(this.ingredientCursor, 0, Engine.state.preparedIngredients.length - 1);
      this.selectedIngredientCursor = Math.clamp(this.selectedIngredientCursor, 0, this.selectedIngredients.length);

      return;
    }

    this.ticksUntilNextBubble -= 1;

    if (Input.getKeyDown('left')) {
      this.onPreviousTableCb();
    } else if (Input.getKeyDown('a')) {
      this.resetListState();
      this.showList = true;
    } else if (Input.getKeyDown('down')) {
      this.openBook();
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

    this.bubbleParticles = this.bubbleParticles.filter((b) => b.y > -10);
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(Textures.tableTexture.normal, 0, 0);
    ctx.drawImage(Textures.cauldronTexture.normal, 250, 70);

    if (this.showList) {
      const listWidth: number = 80;
      const maxCountOnPage: number = 9;

      drawFrame(11, 11, listWidth, 218, ctx, () => {
        Font.draw('Storage', 12, 6, ctx);

        const page: number = (this.ingredientCursor / maxCountOnPage) | 0;
        const startIdx: number = page * maxCountOnPage;

        for (let idx = startIdx; idx < Math.min(startIdx + 9, Engine.state.preparedIngredients.length); idx += 1) {
          const pi: PreparedIngredient = Engine.state.preparedIngredients[idx];

          const yy: number = Font.glyphSizeV + (idx % maxCountOnPage) * (16 + 4);
          if (idx === this.ingredientCursor && this.leftColumn) ctx.drawImage(Textures.listPointerRightTexture.normal, 11, yy);
          drawPreparedIngredientRow(pi, 11 + 16 + 4, yy, ctx);
        }
      });

      const rightColumnX: number = 11 + listWidth + 20;
      drawFrame(rightColumnX, 11, listWidth, 218, ctx, () => {
        Font.draw('Selected', rightColumnX + 1, 6, ctx);

        const page: number = (this.selectedIngredientCursor / maxCountOnPage) | 0;
        const startIdx: number = page * maxCountOnPage;
        const pageCount: number = Math.ceil((this.selectedIngredients.length + 1) / maxCountOnPage);

        for (let idx = startIdx; idx < Math.min(startIdx + 9, this.selectedIngredients.length); idx += 1) {
          const pi: PreparedIngredient = this.selectedIngredients[idx];

          const yy: number = Font.glyphSizeV + (idx % maxCountOnPage) * (16 + 4);
          if (idx === this.selectedIngredientCursor && !this.leftColumn) ctx.drawImage(Textures.listPointerRightTexture.normal, rightColumnX, yy);
          drawPreparedIngredientRow(pi, rightColumnX + 16 + 4, yy, ctx);
        }

        if (this.selectedIngredients.length > 0 && page === (pageCount - 1)) {
          const yy: number = Font.glyphSizeV + (this.selectedIngredients.length % maxCountOnPage) * (16 + 4);
          if (this.selectedIngredientCursor === this.selectedIngredients.length && !this.leftColumn) ctx.drawImage(Textures.listPointerRightTexture.normal, rightColumnX, yy + 5);
          Font.draw('Brew!', rightColumnX + 16 + 4, yy, ctx);
        }
      });
    }

    this.bubbleParticles.forEach((bubble) => {
      const t = bubble.isSmall ? Textures.bubbleSmallTexture : Textures.bubbleLargeTexture;
      ctx.drawImage(t.normal, bubble.x + (Math.sin((Engine.ticks + bubble.offset) / 25) * 3) | 0, bubble.y);
    });
  }

  private resetListState(): void {
    this.ingredientCursor = 0;
    this.selectedIngredientCursor = 0;
    this.leftColumn = true;
    this.selectedIngredients = [];
  }
}

export class WorkshopStage extends Stage {
  selectedTable = 0;
  tables = [
    new ClientTable(() => this.nextTable(), () => this.prevTable(), () => this.openBook()),
    new IngredientsTable(() => this.nextTable(), () => this.prevTable(), () => this.openBook()),
    new BrewingTable(() => this.nextTable(), () => this.prevTable(), () => this.openBook()),
  ];

  isInBookView: boolean = false;
  pageNumber = 0;

  update(): void {
    if (this.isInBookView) {
      this.updateBook();
      return;
    }

    this.tables[this.selectedTable].update();
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
  }

  prevTable(): void {
    this.selectedTable -= 1;
    this.selectedTable = Math.clamp(this.selectedTable, 0, 2);
  }

  private updateBook(): void {
    if (Input.getKeyDown('up')) this.isInBookView = false;
    if (Input.getKeyDown('left')) this.pageNumber -= 1;
    if (Input.getKeyDown('right')) this.pageNumber += 1;

    this.pageNumber = Math.clamp(this.pageNumber, 0, Math.ceil(RECIPES.length / 2) - 1);
  }

  private renderBook(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(Textures.bookTexture.normal, 0, 0);

    const r1 = RECIPES[this.pageNumber * 2];
    const r2 = RECIPES[this.pageNumber * 2 + 1];
    if (r1) drawRecipe(r1, 60, 20, ctx);
    if (r2) drawRecipe(r2, 225, 20, ctx);

    Font.draw(`${this.pageNumber * 2 + 1}`, 50, 200, ctx);
    Font.draw(`${this.pageNumber * 2 + 2}`, 350, 200, ctx);
  }

  private openBook(): void {
    this.isInBookView = true;
  }
}
