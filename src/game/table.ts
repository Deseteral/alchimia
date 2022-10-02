export abstract class Table {
  onNextTableCb: () => void;
  onPreviousTableCb: () => void;
  openBook: () => void;

  constructor(onNextTableCb: () => void, onPreviousTableCb: () => void, openBook: () => void) {
    this.onNextTableCb = onNextTableCb;
    this.onPreviousTableCb = onPreviousTableCb;
    this.openBook = openBook;
  }

  abstract update(isSelected: boolean): void;
  abstract render(ctx: CanvasRenderingContext2D): void;
}
