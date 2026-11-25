import { BOARD_SIZE } from '../data/board.data.js';
import { parseCellState } from '../domain/cell-state.js';

const CELL_SELECTOR = 'td.battlefield-cell';

export class Battlefield {
  constructor(root) {
    this.root = root;
  }

  cell(row, col) {
    this.#assertInBounds(row, col);
    return this.root.locator(`.battlefield-cell-content[data-y="${row}"][data-x="${col}"]`);
  }

  async fire(row, col) {
    await this.cell(row, col).click();
  }

  async stateOf(row, col) {
    const className = await this.cell(row, col).locator('xpath=ancestor::td').getAttribute('class');
    return parseCellState(className);
  }

  async readStates() {
    const rawCells = await this.root.locator(CELL_SELECTOR).evaluateAll((cells) =>
      cells.map((td) => {
        const content = td.querySelector('.battlefield-cell-content');
        return {
          row: Number(content.dataset.y),
          col: Number(content.dataset.x),
          className: td.className,
        };
      }),
    );

    const expected = BOARD_SIZE * BOARD_SIZE;
    if (rawCells.length !== expected) {
      throw new Error(`Expected ${expected} battlefield cells, found ${rawCells.length}`);
    }

    const grid = Array.from({ length: BOARD_SIZE }, () => new Array(BOARD_SIZE));
    for (const { row, col, className } of rawCells) {
      grid[row][col] = parseCellState(className);
    }
    return grid;
  }

  #assertInBounds(row, col) {
    const isValid = (value) => Number.isInteger(value) && value >= 0 && value < BOARD_SIZE;
    if (!isValid(row) || !isValid(col)) {
      throw new RangeError(`Cell (${row}, ${col}) is outside the ${BOARD_SIZE}x${BOARD_SIZE} board`);
    }
  }
}