import 'src/engine/utils';
import { Stage } from 'src/engine/stage';
import { GameState } from 'src/game/game-state';
import { generateRecipes } from 'src/game/recipes';

export abstract class Engine {
  static activeStage: (Stage | null) = null;

  static readonly width = 400;
  static readonly height = 240;
  static readonly primaryColor: string = '#363636';
  static readonly secondaryColor: string = '#ffda9e';

  static state: GameState;

  static ticks: number = 0;
  static shouldCountTicks: boolean = true;

  static changeStage(nextStage: Stage): void {
    this.activeStage?.onDestroy();
    this.activeStage = nextStage;
    this.activeStage.onActivate();
  }

  static saveGame(): void {
    try {
      window.localStorage.setItem('save', JSON.stringify(Engine.state));
      console.log('saved game');
    } catch (e) {
      console.log('cannot save game');
    }
  }

  static hasSavedData(): boolean {
    try {
      const data = window.localStorage.getItem('save');
      return !!data;
    } catch (e) {
      return false;
    }
  }

  static loadGame(): void {
    try {
      const data = window.localStorage.getItem('save');
      if (!data) throw new Error('no save data');

      Engine.state = JSON.parse(data);
      console.log('loaded game');
    } catch (e) {
      console.log('cannot load game game');
    }
  }

  static newGame(): void {
    Engine.state = {
      preparedIngredients: [],
      recipes: generateRecipes(),
      orders: [],
      gold: 0,
      completedOrders: 0,
      messageBoard: { messages: [] },
      day: 0,
      goldLastDay: 0,
      debtPaid: false,
    };
  }
}
