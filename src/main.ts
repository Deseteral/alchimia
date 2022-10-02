import { Engine } from 'src/engine/engine';
import { Font } from 'src/engine/font';
import { Input } from 'src/engine/input';
import { Textures } from 'src/engine/textures';
import { generateRecipes } from 'src/game/recipes';
import { WorkshopStage } from 'src/game/workshop-stage';

const canvas: HTMLCanvasElement = document.querySelector('canvas')!;
const context: CanvasRenderingContext2D = canvas.getContext('2d')!;

function tick(): void {
  context.fillStyle = Engine.secondaryColor;
  context.fillRect(0, 0, Engine.width, Engine.height);
  context.fillStyle = Engine.primaryColor;
  context.strokeStyle = Engine.primaryColor;

  const stage = Engine.activeStage!;
  stage.update();
  stage.render(context);

  Input.update();

  if (Engine.shouldCountTicks) Engine.ticks += 1;

  requestAnimationFrame(tick);
}

(async function main(): Promise<void> {
  canvas.width = Engine.width;
  canvas.height = Engine.height;
  context.imageSmoothingEnabled = false;

  Input.initialize(canvas);

  Font.initialize();
  await Textures.loadTextures();

  Engine.state = { // TODO: Add save/load functionality
    preparedIngredients: [],
    recipes: generateRecipes(),
    orders: [],
    gold: 0,
    completedOrders: 0,
    messageBoard: { messages: [] },
    day: 1,
  };

  const initialStage = new WorkshopStage();
  Engine.changeStage(initialStage);

  tick();
}());
