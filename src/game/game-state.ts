export interface GameState {
  preparedIngredients: PreparedIngredient[],
}

export type Ingredient = string;

export enum IngredientAction {
  CUTTING,
  GRIDING,
  BURNING,
  ENCHANTING,
}

export interface PreparedIngredient {
  ingredient: Ingredient
  action: IngredientAction,
}
