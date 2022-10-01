import { Stage } from 'src/engine/stage';

export abstract class Engine {
  static activeStage: (Stage | null) = null;

  static readonly width = 400;
  static readonly height = 240;
  static readonly primaryColor: string = '#363636';
  static readonly secondaryColor: string = '#ffda9e';

  static changeStage(nextStage: Stage): void {
    this.activeStage = nextStage;
  }
}
