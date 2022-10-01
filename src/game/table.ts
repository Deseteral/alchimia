import { Stage } from 'src/engine/stage';

export abstract class Table extends Stage {
  onNextTableCb: () => void;
  onPreviousTableCb: () => void;
  openBook: () => void;

  constructor(onNextTableCb: () => void, onPreviousTableCb: () => void, openBook: () => void) {
    super();
    this.onNextTableCb = onNextTableCb;
    this.onPreviousTableCb = onPreviousTableCb;
    this.openBook = openBook;
  }
}
