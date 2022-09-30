import { State } from 'src/engine/state';

export class Engine {
  activeState: (State | null) = null;

  primaryColor: string = '#363636';
  secondaryColor: string = '#ffda9e';

  changeState(nextState: State): void {
    this.activeState = nextState;
  }

  static instance = new Engine();
}
