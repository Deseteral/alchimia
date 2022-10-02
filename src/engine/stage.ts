export abstract class Stage {
  abstract onActivate(): void;
  abstract update(): void;
  abstract render(ctx: CanvasRenderingContext2D): void;
  abstract onDestroy(): void;
}
