import { Engine } from 'src/engine/engine';
import { GameStage } from 'src/game/game-stage';

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
  const initialStage = new GameStage();
  Engine.changeStage(initialStage);

  tick();
}());
