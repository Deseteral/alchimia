export interface GameState {
  preparedIngridients: PreparedIngridient[],
}

export type Ingridient = string;

export enum IngridientAction {
  CUTTING,
  GRIDING,
  BURNING,
  ENCHANTING,
}

export interface PreparedIngridient {
  ingridient: Ingridient
  action: IngridientAction,
  amount: number,
}
