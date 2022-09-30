export abstract class Stage {
  abstract update(): void;
  abstract render(ctx: CanvasRenderingContext2D): void;
}
