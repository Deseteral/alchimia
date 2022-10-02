import { PreparedIngredient } from 'src/game/ingredients';
import { MessageBoard } from 'src/game/message-board';
import { Recipe } from 'src/game/recipes';

export interface GameState {
  preparedIngredients: PreparedIngredient[],
  recipes: Recipe[],

  day: number,

  gold: number,
  goldLastDay: number,
  completedOrders: number,

  orders: Recipe[],
  messageBoard: MessageBoard,

  debtPaid: boolean,
}
