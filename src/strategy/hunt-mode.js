import { BOARD_SIZE } from '../data/board.data.js';
import { CELL_STATE } from '../data/cell-state.data.js';
import { EVERY_CELL_STEP, MIN_PARITY_SHIP_SIZE } from '../data/strategy.data.js';
import { remainingShipSizes } from '../domain/fleet.js';

const BOARD_CENTER = (BOARD_SIZE - 1) / 2;

const ringOf = ({ row, col }) =>
  Math.max(Math.abs(row - BOARD_CENTER), Math.abs(col - BOARD_CENTER));

function searchStep(board) {
  const remaining = remainingShipSizes(board.sunkShipSizes());
  const parityShips = remaining.filter((size) => size >= MIN_PARITY_SHIP_SIZE);
  return parityShips.length > 0 ? Math.min(...parityShips) : EVERY_CELL_STEP;
}

function innermost(cells) {
  const innerRing = Math.min(...cells.map(ringOf));
  return cells.filter((cell) => ringOf(cell) === innerRing);
}

export function huntCandidates(board) {
  const emptyCells = [...board.cells()].filter(({ state }) => state === CELL_STATE.EMPTY);

  for (let step = searchStep(board); step >= EVERY_CELL_STEP; step--) {
    const onGrid = emptyCells.filter(({ row, col }) => (row + col) % step === 0);
    if (onGrid.length > 0) {
      return innermost(onGrid).map(({ row, col }) => ({ row, col }));
    }
  }
  return [];
}