import { Font } from 'src/engine/font';
import { Textures } from 'src/engine/textures';
import { Ingredient, IngredientAction, PreparedIngredient } from 'src/game/ingredients';

export interface Recipe {
  name: string,
  ingredients: PreparedIngredient[],
}

export const RECIPES: Recipe[] = [
  {
    name: 'Potion 1',
    ingredients: [
      { ingredient: Ingredient.HERB, action: IngredientAction.CUTTING },
      { ingredient: Ingredient.STONE, action: IngredientAction.GRIDING },
      { ingredient: Ingredient.MUSHROOM, action: IngredientAction.BURNING },
      { ingredient: Ingredient.GOLD, action: IngredientAction.ENCHANTING },
      { ingredient: Ingredient.FLOWER, action: IngredientAction.ENCHANTING },
    ],
  }, {
    name: 'Potion 2',
    ingredients: [
      { ingredient: Ingredient.HERB, action: IngredientAction.CUTTING },
      { ingredient: Ingredient.STONE, action: IngredientAction.GRIDING },
      { ingredient: Ingredient.MUSHROOM, action: IngredientAction.BURNING },
      { ingredient: Ingredient.GOLD, action: IngredientAction.ENCHANTING },
      { ingredient: Ingredient.FLOWER, action: IngredientAction.ENCHANTING },
    ],
  }, {
    name: 'Potion 3',
    ingredients: [
      { ingredient: Ingredient.HERB, action: IngredientAction.CUTTING },
      { ingredient: Ingredient.STONE, action: IngredientAction.GRIDING },
      { ingredient: Ingredient.MUSHROOM, action: IngredientAction.BURNING },
      { ingredient: Ingredient.GOLD, action: IngredientAction.ENCHANTING },
      { ingredient: Ingredient.FLOWER, action: IngredientAction.ENCHANTING },
    ],
  }, {
    name: 'Potion 4',
    ingredients: [
      { ingredient: Ingredient.HERB, action: IngredientAction.CUTTING },
      { ingredient: Ingredient.STONE, action: IngredientAction.GRIDING },
      { ingredient: Ingredient.MUSHROOM, action: IngredientAction.BURNING },
      { ingredient: Ingredient.GOLD, action: IngredientAction.ENCHANTING },
      { ingredient: Ingredient.FLOWER, action: IngredientAction.ENCHANTING },
    ],
  },
];

function getIngredientIcon(ingredient: Ingredient): HTMLCanvasElement {
  switch (ingredient) {
    case Ingredient.HERB: return Textures.herbTexture.normal;
    case Ingredient.MUSHROOM: return Textures.mushroomTexture.normal;
    case Ingredient.STONE: return Textures.stoneTexture.normal;
    case Ingredient.GOLD: return Textures.stoneTexture.inverted;
    case Ingredient.FLOWER: return Textures.flowerTexture.normal;
    default: return Textures.xTexture.normal;
  }
}

function getIngredientActionIcon(action: IngredientAction): HTMLCanvasElement {
  switch (action) {
    case IngredientAction.CUTTING: return Textures.knifeTexture.normal;
    case IngredientAction.GRIDING: return Textures.mortarTexture.normal;
    case IngredientAction.BURNING: return Textures.fireTexture.normal;
    case IngredientAction.ENCHANTING: return Textures.spellTexture.normal;
    default: return Textures.xTexture.normal;
  }
}

export function drawRecipe(recipe: Recipe, x: number, y: number, ctx: CanvasRenderingContext2D): void {
  Font.draw(recipe.name, x, y, ctx);

  recipe.ingredients.forEach((ing, idx) => {
    const xx: number = x + 5;
    const yy: number = y + 40 + (16 + 5) * idx;
    ctx.drawImage(getIngredientIcon(ing.ingredient), xx, yy);
    ctx.drawImage(Textures.xTexture.normal, xx + 16, yy);
    ctx.drawImage(getIngredientActionIcon(ing.action), xx + 16 * 2, yy);
  });
}
