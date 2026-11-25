import { COLUMN_LABELS } from '../data/board.data.js';

export const formatCell = (row, col) => `${row + 1}${COLUMN_LABELS[col]}`;