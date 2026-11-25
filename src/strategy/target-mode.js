import { CELL_STATE } from '../data/cell-state.data.js';
import { StrategyError } from '../errors/strategy.error.js';

const formatCells = (cells) => cells.map(({ row, col }) => `(${row}, ${col})`).join(' ');

const isHorizontal = (cluster) => cluster.every(({ row }) => row === cluster[0].row);
const isVertical = (cluster) => cluster.every(({ col }) => col === cluster[0].col);

function lineEnds(cluster) {
  if (isHorizontal(cluster)) {
    const { row } = cluster[0];
    const cols = cluster.map((cell) => cell.col);
    return [
      { row, col: Math.min(...cols) - 1 },
      { row, col: Math.max(...cols) + 1 },
    ];
  }
  if (isVertical(cluster)) {
    const { col } = cluster[0];
    const rows = cluster.map((cell) => cell.row);
    return [
      { row: Math.min(...rows) - 1, col },
      { row: Math.max(...rows) + 1, col },
    ];
  }
  throw new StrategyError(`Wounded ship is not a straight line: ${formatCells(cluster)}`);
}

function continuationsOf(board, cluster) {
  const [first] = cluster;
  const adjacent = cluster.length === 1 ? board.neighbors(first.row, first.col) : lineEnds(cluster);
  return adjacent.filter(
    ({ row, col }) => board.isInBounds(row, col) && board.stateAt(row, col) === CELL_STATE.EMPTY,
  );
}

export function targetCandidates(board) {
  const clusters = board.findClusters(CELL_STATE.HIT);
  if (clusters.length === 0) return [];

  const [woundedShip] = clusters.sort((a, b) => b.length - a.length);
  const candidates = continuationsOf(board, woundedShip);
  if (candidates.length === 0) {
    throw new StrategyError(
      `Wounded ship has no free adjacent cell to continue: ${formatCells(woundedShip)}`,
    );
  }
  return candidates;
}