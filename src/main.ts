import { Engine } from 'src/engine/engine';
import { Font } from 'src/engine/font';
import { Input } from 'src/engine/input';
import { Textures } from 'src/engine/textures';
import { Ingredient, IngredientAction } from 'src/game/ingredients';
import { generateRecipes } from 'src/game/recipes';
import { WorkshopStage } from 'src/game/workshop-stage';

const canvas = document.querySelector('canvas')!;
const context = canvas.getContext('2d')!;

function tick(): void {
  context.fillStyle = Engine.secondaryColor;
  context.fillRect(0, 0, Engine.width, Engine.height);
  context.fillStyle = Engine.primaryColor;
  context.strokeStyle = Engine.primaryColor;

  const stage = Engine.activeStage!;
  stage.update();
  stage.render(context);

  Input.update();

  Engine.ticks += 1;
  requestAnimationFrame(tick);
}

(async function main(): Promise<void> {
  Input.initialize(canvas);

  canvas.width = Engine.width;
  canvas.height = Engine.height;
  context.imageSmoothingEnabled = false;

  Font.initialize();
  await Textures.loadTextures();

  Engine.state = { // TODO: Add save/load functionality
    preparedIngredients: [
      { action: IngredientAction.CUTTING, ingredient: Ingredient.MUSHROOM },
      { action: IngredientAction.ENCHANTING, ingredient: Ingredient.FLOWER },
      { action: IngredientAction.BURNING, ingredient: Ingredient.GOLD },
      { action: IngredientAction.CUTTING, ingredient: Ingredient.HERB },
      { action: IngredientAction.GRIDING, ingredient: Ingredient.STONE },
      { action: IngredientAction.GRIDING, ingredient: Ingredient.MUSHROOM },
      { ingredient: Ingredient.HERB, action: IngredientAction.CUTTING },
      { ingredient: Ingredient.STONE, action: IngredientAction.GRIDING },
      { ingredient: Ingredient.MUSHROOM, action: IngredientAction.BURNING },
      { ingredient: Ingredient.GOLD, action: IngredientAction.ENCHANTING },
      { ingredient: Ingredient.FLOWER, action: IngredientAction.ENCHANTING },
    ],
    recipes: generateRecipes(),
  };

  const initialStage = new WorkshopStage();
  Engine.changeStage(initialStage);

  tick();
}());
