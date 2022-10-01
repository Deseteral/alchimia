export enum Ingredient {
  HERB,
  MUSHROOM,
  STONE,
  GOLD,
  FLOWER,
}

export enum IngredientAction {
  CUTTING,
  GRIDING,
  BURNING,
  ENCHANTING,
}

export interface PreparedIngredient {
  ingredient: Ingredient,
  action: IngredientAction,
}
