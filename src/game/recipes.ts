import { Font } from 'src/engine/font';
import { Textures } from 'src/engine/textures';
import { Ingredient, IngredientAction, IngredientActions, Ingredients, PreparedIngredient } from 'src/game/ingredients';
import { findMatchingRecipe, preparedIngredientEquals } from 'src/game/recipe-logic';
import { POTION_NAMES } from 'src/game/potion-names';

export interface Recipe {
  name: string,
  ingredients: PreparedIngredient[],
}

export function getIngredientIcon(ingredient: Ingredient): HTMLCanvasElement {
  switch (ingredient) {
    case Ingredient.HERB: return Textures.herbTexture.normal;
    case Ingredient.MUSHROOM: return Textures.mushroomTexture.normal;
    case Ingredient.STONE: return Textures.stoneTexture.normal;
    case Ingredient.GOLD: return Textures.stoneTexture.inverted;
    case Ingredient.FLOWER: return Textures.flowerTexture.normal;
    default: return Textures.xTexture.normal;
  }
}

export function getIngredientActionIcon(action: IngredientAction): HTMLCanvasElement {
  switch (action) {
    case IngredientAction.CUTTING: return Textures.knifeTexture.normal;
    case IngredientAction.GRIDING: return Textures.mortarTexture.normal;
    case IngredientAction.BURNING: return Textures.fireTexture.normal;
    case IngredientAction.ENCHANTING: return Textures.spellTexture.normal;
    default: return Textures.xTexture.normal;
  }
}

export function drawPreparedIngredientRow(pi: PreparedIngredient, x: number, y: number, ctx: CanvasRenderingContext2D): void {
  ctx.drawImage(getIngredientIcon(pi.ingredient), x, y);
  ctx.drawImage(Textures.xTexture.normal, x + 16, y);
  ctx.drawImage(getIngredientActionIcon(pi.action), x + 16 * 2, y);
}

export function drawRecipe(recipe: Recipe, x: number, y: number, ctx: CanvasRenderingContext2D): void {
  Font.draw(recipe.name, x, y, ctx);

  recipe.ingredients.forEach((ing, idx) => {
    const xx: number = x + 5;
    const yy: number = y + 40 + (16 + 5) * idx;
    drawPreparedIngredientRow(ing, xx, yy, ctx);
  });
}

export function generateRecipes(): Recipe[] {
  const recipes: Recipe[] = [];
  const namePool: string[] = [...POTION_NAMES];

  for (let recipeIdx = 0; recipeIdx < 15; recipeIdx += 1) {
    let recipeGood = false;
    let recipeTries = 10;

    while (!recipeGood && recipeTries >= 0) {
      const ingredientCount = recipeIdx <= 5 ? Math.randomRange(1, 2) : Math.randomRange(3, 5);
      const ingredients: PreparedIngredient[] = [];

      for (let ingredientIdx = 0; ingredientIdx < ingredientCount; ingredientIdx += 1) {
        let ingredientGood = false;
        let ingredientTries = 10;

        while (!ingredientGood && ingredientTries >= 0) {
          const ingredientId = Math.randomRange(0, (Ingredients.length - 1));
          const actionId = Math.randomRange(0, (IngredientActions.length - 1));
          const pi: PreparedIngredient = { ingredient: Ingredients[ingredientId], action: IngredientActions[actionId] };

          const foundIdx = ingredients.findIndex((pp) => preparedIngredientEquals(pi, pp));

          if (foundIdx === -1) {
            ingredients.push(pi);
            ingredientGood = true;
          }

          ingredientTries -= 1;
        }
      }

      recipeTries -= 1;

      if (findMatchingRecipe(ingredients, recipes) === null) {
        const nameIdx = Math.randomRange(0, (namePool.length - 1));
        const [name] = namePool.splice(nameIdx, 1);

        recipes.push({ name, ingredients });
        recipeGood = true;
      }
    }
  }

  console.log(`generated ${recipes.length} recipes`, recipes);

  return recipes;
}
