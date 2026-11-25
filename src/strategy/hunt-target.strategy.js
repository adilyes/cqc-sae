import { STRATEGY_MODE } from '../data/strategy.data.js';
import { StrategyError } from '../errors/strategy.error.js';
import { pickRandom } from '../utils/random.js';
import { huntCandidates } from './hunt-mode.js';
import { targetCandidates } from './target-mode.js';

export class HuntTargetStrategy {
  #rng;

  constructor({ rng = Math.random } = {}) {
    this.#rng = rng;
  }

  nextShot(board) {
    const targets = targetCandidates(board);
    if (targets.length > 0) return this.#shot(targets, STRATEGY_MODE.TARGET);

    const searchCells = huntCandidates(board);
    if (searchCells.length === 0) {
      throw new StrategyError('No empty cells left to fire at');
    }
    return this.#shot(searchCells, STRATEGY_MODE.HUNT);
  }

  #shot(candidates, mode) {
    const { row, col } = pickRandom(candidates, this.#rng);
    return { row, col, mode };
  }
}