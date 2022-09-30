import { Stage } from 'src/engine/stage';

export class GameStage extends Stage {
  update(): void {
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillRect(100, 100, 20, 20);
  }
}
