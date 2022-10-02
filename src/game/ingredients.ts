export enum Ingredient {
  HERB,
  MUSHROOM,
  STONE,
  GOLD,
  FLOWER,
}

export const Ingredients = [
  Ingredient.HERB,
  Ingredient.MUSHROOM,
  Ingredient.STONE,
  Ingredient.GOLD,
  Ingredient.FLOWER,
];

export enum IngredientAction {
  CUTTING,
  GRIDING,
  BURNING,
  ENCHANTING,
}

export const IngredientActions = [
  IngredientAction.CUTTING,
  IngredientAction.GRIDING,
  IngredientAction.BURNING,
  IngredientAction.ENCHANTING,
];

export interface PreparedIngredient {
  ingredient: Ingredient,
  action: IngredientAction,
}

export function ingredientDisplayName(ingredient: Ingredient): string {
  switch (ingredient) {
    case Ingredient.HERB: return 'Herb';
    case Ingredient.MUSHROOM: return 'Mushroom';
    case Ingredient.STONE: return 'Stone';
    case Ingredient.GOLD: return 'Gold';
    case Ingredient.FLOWER: return 'Flower';
    default: return 'bleh';
  }
}
