import { CELL_CSS_CLASS, CELL_STATE } from '../data/cell-state.data.js';

export function parseCellState(className) {
  const classes = className.split(/\s+/);
  const has = (cssClass) => classes.includes(cssClass);

  if (has(CELL_CSS_CLASS.SUNK)) return CELL_STATE.SUNK;
  if (has(CELL_CSS_CLASS.HIT)) return CELL_STATE.HIT;
  if (has(CELL_CSS_CLASS.MISS)) return CELL_STATE.MISS;
  if (has(CELL_CSS_CLASS.EMPTY)) return CELL_STATE.EMPTY;

  throw new Error(`Unknown battlefield cell state, class="${className}"`);
}