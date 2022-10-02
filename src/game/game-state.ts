import { PreparedIngredient } from 'src/game/ingredients';
import { MessageBoard } from 'src/game/message-board';
import { Recipe } from 'src/game/recipes';

export interface GameState {
  preparedIngredients: PreparedIngredient[],
  recipes: Recipe[],
  orders: Recipe[],
  gold: number,
  completedOrders: number,
  messageBoard: MessageBoard,
  day: number,
}
