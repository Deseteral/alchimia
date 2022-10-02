import { Stage } from 'src/engine/stage';

export class DaySummaryStage extends Stage {
  update(): void {
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillRect(10, 10, 100, 200);
  }
}
