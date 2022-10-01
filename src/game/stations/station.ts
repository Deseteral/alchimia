import { Stage } from 'src/engine/stage';
import { IngredientAction } from 'src/game/ingredients';

export type StationCompleteCallback = (success: boolean, action: IngredientAction) => void

export abstract class Station extends Stage {
  onStationCompleteCallback: StationCompleteCallback;

  constructor(cb: StationCompleteCallback) {
    super();
    this.onStationCompleteCallback = cb;
  }
}
