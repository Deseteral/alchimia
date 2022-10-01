import { Stage } from 'src/engine/stage';

export abstract class Table extends Stage {
  onNextTableCb: () => void;
  onPreviousTableCb: () => void;

  constructor(onNextTableCb: () => void, onPreviousTableCb: () => void) {
    super();
    this.onNextTableCb = onNextTableCb;
    this.onPreviousTableCb = onPreviousTableCb;
  }
}
