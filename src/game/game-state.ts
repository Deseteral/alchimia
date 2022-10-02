import { PreparedIngredient } from 'src/game/ingredients';
import { Recipe } from 'src/game/recipes';

export interface GameState {
  preparedIngredients: PreparedIngredient[],
  recipes: Recipe[],
}
