import { Engine } from 'src/engine/engine';
import { GameStage } from 'src/game/game-stage';

const SCREEN_WIDTH = 400;
const SCREEN_HEIGHT = 240;

const canvas = document.querySelector('canvas')!;
const context = canvas.getContext('2d')!;

function tick(): void {
  context.fillStyle = Engine.instance.secondaryColor;
  context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  context.fillStyle = Engine.instance.primaryColor;

  const stage = Engine.instance.activeStage!;
  stage.update();
  stage.render(context);

  requestAnimationFrame(tick);
}

(function main(): void {
  const initialStage = new GameStage();
  Engine.instance.changeStage(initialStage);

  tick();
}());
