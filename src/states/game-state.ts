import { Engine } from 'src/engine/engine';
import { State } from 'src/engine/state';

export class GameState extends State {
  update(): void {
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = Engine.instance.primaryColor;
    ctx.fillRect(100, 100, 20, 20);
  }
}
