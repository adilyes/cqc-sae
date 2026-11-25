import { BOARD_SIZE } from '../data/board.data.js';

export class Battlefield {
  constructor(root) {
    this.root = root;
  }

  cell(row, col) {
    this.#assertInBounds(row, col);
    return this.root
      .locator('tbody tr')
      .nth(row)
      .locator('td')
      .nth(col)
      .locator('.battlefield-cell-content');
  }

  async fire(row, col) {
    await this.cell(row, col).click();
  }

  #assertInBounds(row, col) {
    const isValid = (value) => Number.isInteger(value) && value >= 0 && value < BOARD_SIZE;
    if (!isValid(row) || !isValid(col)) {
      throw new RangeError(`Cell (${row}, ${col}) is outside the ${BOARD_SIZE}x${BOARD_SIZE} board`);
    }
  }
}