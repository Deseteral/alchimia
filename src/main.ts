import { Engine } from 'src/engine/engine';
import { GameState } from 'src/states/game-state';

const SCREEN_WIDTH = 400;
const SCREEN_HEIGHT = 240;

const canvas = document.querySelector('canvas')!;
const context = canvas.getContext('2d')!;

function tick(): void {
  context.fillStyle = Engine.instance.secondaryColor;
  context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

  const state = Engine.instance.activeState!;
  state.update();
  state.render(context);

  requestAnimationFrame(tick);
}

(function main(): void {
  const initialState = new GameState();
  Engine.instance.changeState(initialState);

  tick();
}());
