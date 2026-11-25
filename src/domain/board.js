import { ALL_OFFSETS, BOARD_SIZE, ORTHOGONAL_OFFSETS } from '../data/board.data.js';
import { CELL_STATE } from '../data/cell-state.data.js';

const keyOf = ({ row, col }) => `${row}:${col}`;

export class Board {
  #grid;

  constructor(grid) {
    const isValidSize = grid.length === BOARD_SIZE && grid.every((r) => r.length === BOARD_SIZE);
    if (!isValidSize) {
      throw new RangeError(`Board grid must be ${BOARD_SIZE}x${BOARD_SIZE}`);
    }
    this.#grid = grid.map((row) => [...row]);
  }

  isInBounds(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  }

  stateAt(row, col) {
    if (!this.isInBounds(row, col)) {
      throw new RangeError(`Cell (${row}, ${col}) is outside the board`);
    }
    return this.#grid[row][col];
  }

  *cells() {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        yield { row, col, state: this.#grid[row][col] };
      }
    }
  }

  neighbors(row, col, offsets = ORTHOGONAL_OFFSETS) {
    return offsets
      .map(({ dRow, dCol }) => ({ row: row + dRow, col: col + dCol }))
      .filter((cell) => this.isInBounds(cell.row, cell.col));
  }

  surroundings(row, col) {
    return this.neighbors(row, col, ALL_OFFSETS);
  }

  findClusters(state) {
    const visited = new Set();
    const clusters = [];
    for (const cell of this.cells()) {
      if (cell.state === state && !visited.has(keyOf(cell))) {
        clusters.push(this.#collectCluster(cell, state, visited));
      }
    }
    return clusters;
  }

  sunkShipSizes() {
    return this.findClusters(CELL_STATE.SUNK).map((cluster) => cluster.length);
  }

  #collectCluster(start, state, visited) {
    const cluster = [];
    const stack = [{ row: start.row, col: start.col }];
    visited.add(keyOf(start));

    while (stack.length > 0) {
      const current = stack.pop();
      cluster.push(current);
      for (const next of this.neighbors(current.row, current.col)) {
        if (this.#grid[next.row][next.col] === state && !visited.has(keyOf(next))) {
          visited.add(keyOf(next));
          stack.push(next);
        }
      }
    }
    return cluster;
  }
}