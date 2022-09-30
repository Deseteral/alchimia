export abstract class State {
  abstract update(): void;
  abstract render(ctx: CanvasRenderingContext2D): void;
}
