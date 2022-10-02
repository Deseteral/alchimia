import { IngredientAction } from 'src/game/ingredients';

export type StationCompleteCallback = (success: boolean, action: IngredientAction) => void

export abstract class Station {
  onStationCompleteCallback: StationCompleteCallback;

  constructor(cb: StationCompleteCallback) {
    this.onStationCompleteCallback = cb;
  }

  abstract update(): void;
  abstract render(ctx: CanvasRenderingContext2D): void;
}
