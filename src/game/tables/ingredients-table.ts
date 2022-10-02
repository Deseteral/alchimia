import { Engine } from 'src/engine/engine';
import { Font } from 'src/engine/font';
import { drawFrame } from 'src/engine/frame';
import { Input } from 'src/engine/input';
import { Textures, Texture } from 'src/engine/textures';
import { Ingredient, Ingredients, IngredientAction, ingredientDisplayName } from 'src/game/ingredients';
import { getIngredientIcon } from 'src/game/recipes';
import { BurningStation } from 'src/game/stations/burning-station';
import { CuttingStation } from 'src/game/stations/cutting-station';
import { EnchantmentStation } from 'src/game/stations/enchantment-station';
import { GrindingStation } from 'src/game/stations/grinding-station';
import { Station, StationCompleteCallback } from 'src/game/stations/station';
import { Table } from 'src/game/tables/table';

export class IngredientsTable extends Table {
  selectedStation: number = 0;
  activeStation: (Station | null) = null;

  isIndredientPickerOpen: boolean = false;
  ingredientCursor: number = 0;

  ignoringInputTicks = 0;

  update(isSelected: boolean): void {
    Engine.shouldCountTicks = !this.activeStation;

    if (this.activeStation && isSelected) {
      this.activeStation.update();
      return;
    }

    this.ignoringInputTicks -= 1;

    if (!this.isIndredientPickerOpen && Input.getKeyDown('a') && this.canUseInput(isSelected)) {
      this.isIndredientPickerOpen = true;
      return;
    }

    if (this.isIndredientPickerOpen && isSelected) {
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

    if (Input.getKeyDown('right') && this.canUseInput(isSelected)) this.selectedStation += 1;
    if (Input.getKeyDown('left') && this.canUseInput(isSelected)) this.selectedStation -= 1;

    if (this.selectedStation < 0) {
      this.onPreviousTableCb();
    } else if (this.selectedStation > 3) {
      this.onNextTableCb();
    } else if (Input.getKeyDown('down') && this.canUseInput(isSelected)) {
      this.openBook();
    }

    this.selectedStation = Math.clamp(this.selectedStation, 0, 3);
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.drawImage(Textures.tableTexture.normal, 0, 0);

    this.drawStation(Textures.cuttingTexture, 10, 40, this.selectedStation === 0, ctx);
    this.drawStation(Textures.grindingTexture, 106, 93, this.selectedStation === 1, ctx);
    this.drawStation(Textures.burningTexture, 193, 25, this.selectedStation === 2, ctx);
    this.drawStation(Textures.enchantingTexture, 305, 100, this.selectedStation === 3, ctx);

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
    const frameOffset = 4;
    if (isSelected) ctx.drawRect(x - frameOffset, y - frameOffset, texture.normal.width + frameOffset * 2, texture.normal.height + frameOffset * 2);
    ctx.drawImage(texture.normal, x, y);
  }

  private exitStation(): void {
    this.activeStation = null;
    this.ignoringInputTicks = (1.5 * 60) | 0;
  }

  private canUseInput(isSelected: boolean): boolean {
    return this.ignoringInputTicks <= 0 && isSelected;
  }
}
