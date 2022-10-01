import { Stage } from 'src/engine/stage';

export class Engine {
  activeStage: (Stage | null) = null;

  width = 400;
  height = 240;
  primaryColor: string = '#363636';
  secondaryColor: string = '#ffda9e';

  changeStage(nextStage: Stage): void {
    this.activeStage = nextStage;
  }

  static instance = new Engine();
}
