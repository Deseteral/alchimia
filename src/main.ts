import { Engine } from 'src/engine/engine';
import { WorkshopStage } from 'src/game/workshop-stage';

const canvas = document.querySelector('canvas')!;
const context = canvas.getContext('2d')!;

function tick(): void {
  context.fillStyle = Engine.secondaryColor;
  context.fillRect(0, 0, Engine.width, Engine.height);
  context.fillStyle = Engine.primaryColor;

  const stage = Engine.activeStage!;
  stage.update();
  stage.render(context);

  requestAnimationFrame(tick);
}

(function main(): void {
  Engine.state = { // TODO: Add save/load functionality
    preparedIngridients: [],
  };

  const initialStage = new WorkshopStage();
  Engine.changeStage(initialStage);

  tick();
}());
