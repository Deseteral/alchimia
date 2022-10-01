import 'src/engine/utils';
import { Stage } from 'src/engine/stage';
import { GameState } from 'src/game/game-state';

export abstract class Engine {
  static activeStage: (Stage | null) = null;

  static readonly width = 400;
  static readonly height = 240;
  static readonly primaryColor: string = '#363636';
  static readonly secondaryColor: string = '#ffda9e';

  static state: GameState;

  static changeStage(nextStage: Stage): void {
    this.activeStage = nextStage;
  }
}
