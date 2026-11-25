import { CELL_STATE } from '../data/cell-state.data.js';
import { FAILURE_STATUSES, GAME_STATUS } from '../data/game-status.data.js';
import {
  GAME_DURATION_LIMIT_MS,
  OPPONENT_CONNECT_TIMEOUT_MS,
  OPPONENT_MOVE_TIMEOUT_MS,
  SHOT_RESULT_TIMEOUT_MS,
  TURN_SWITCH_POLL_INTERVAL_MS,
} from '../data/scenario.data.js';
import { Board } from '../domain/board.js';
import { formatCell } from '../domain/cell-label.js';
import { isFleetDestroyed } from '../domain/fleet.js';
import { failureFor } from '../errors/game-outcome.js';
import {
  GameDurationExceededError,
  MoveTimeoutError,
  RivalConnectTimeoutError,
  ShotNotRegisteredError,
  VictoryNotConfirmedError,
} from '../errors/game.error.js';
import { pollUntil } from '../utils/poll.js';

const GAME_STARTED = new Set([GAME_STATUS.MY_TURN, GAME_STATUS.RIVAL_TURN]);
const MY_TURN_OR_WON = new Set([GAME_STATUS.MY_TURN, GAME_STATUS.WON]);
const WON_ONLY = new Set([GAME_STATUS.WON]);

export class BattleshipBot {
  #game;
  #strategy;
  #shots = [];
  #gameStartedAt = 0;

  /**
   * @param {{
   *   game: import('../pages/battleship.page.js').BattleshipPage,
   *   strategy: import('../strategy/hunt-target.strategy.js').HuntTargetStrategy
   * }} deps
   */
  constructor({ game, strategy }) {
    this.#game = game;
    this.#strategy = strategy;
  }

  /** Plays until victory. Any other outcome throws a GameError with a descriptive reason. */
  async play() {
    await this.#waitForGameStart();
    this.#gameStartedAt = Date.now();

    while (true) {
      this.#assertWithinTimeLimit();

      const status = await this.#expectStatus(MY_TURN_OR_WON, OPPONENT_MOVE_TIMEOUT_MS, {
        ErrorClass: MoveTimeoutError,
        reason: `Rival did not finish the move within ${OPPONENT_MOVE_TIMEOUT_MS / 1000}s`,
      });
      if (status === GAME_STATUS.WON) break;

      const board = await this.#readRivalBoard();
      if (isFleetDestroyed(board.sunkShipSizes())) {
        await this.#expectStatus(WON_ONLY, SHOT_RESULT_TIMEOUT_MS, {
          ErrorClass: VictoryNotConfirmedError,
          reason: 'All rival ships are sunk, but the site did not show the victory',
        });
        break;
      }

      await this.#fireAt(this.#strategy.nextShot(board));
    }

    return { shots: this.#shots.length };
  }

  async #waitForGameStart() {
    await this.#expectStatus(GAME_STARTED, OPPONENT_CONNECT_TIMEOUT_MS, {
      ErrorClass: RivalConnectTimeoutError,
      reason: `Rival did not connect within ${OPPONENT_CONNECT_TIMEOUT_MS / 1000}s`,
    });
  }

  async #readRivalBoard() {
    return new Board(await this.#game.rivalBoard.readStates());
  }

  async #fireAt({ row, col, mode }) {
    const { rivalBoard, notifications } = this.#game;
    await rivalBoard.fire(row, col);

    const { done, value: result } = await pollUntil(() => rivalBoard.stateOf(row, col), {
      isDone: (state) => state !== CELL_STATE.EMPTY,
      timeoutMs: SHOT_RESULT_TIMEOUT_MS,
    });
    if (!done) {
      await this.#assertNotFailed(await notifications.currentStatus());
      throw new ShotNotRegisteredError(
        `Shot at ${formatCell(row, col)} was not registered within ${SHOT_RESULT_TIMEOUT_MS} ms. ${await this.#details()}`,
      );
    }

    this.#shots.push({ row, col, mode, result });
    if (result === CELL_STATE.MISS) {
      await this.#waitForTurnToPass();
    }
  }

  async #waitForTurnToPass() {
    const { done, value: status } = await pollUntil(
      () => this.#game.notifications.currentStatus(),
      {
        isDone: (current) => current !== GAME_STATUS.MY_TURN,
        timeoutMs: SHOT_RESULT_TIMEOUT_MS,
        intervalMs: TURN_SWITCH_POLL_INTERVAL_MS,
      },
    );
    await this.#assertNotFailed(status);
    if (!done) {
      throw new ShotNotRegisteredError(
        `Turn did not pass to the rival within ${SHOT_RESULT_TIMEOUT_MS} ms after a miss. ${await this.#details()}`,
      );
    }
  }

  /** Waits for one of `accepted` statuses; a failure status always wins and is thrown. */
  async #expectStatus(accepted, timeoutMs, onTimeout) {
    const { done, value: status } = await pollUntil(
      () => this.#game.notifications.currentStatus(),
      {
        isDone: (current) => accepted.has(current) || FAILURE_STATUSES.includes(current),
        timeoutMs,
      },
    );
    await this.#assertNotFailed(status);
    if (!done) {
      throw new onTimeout.ErrorClass(`${onTimeout.reason}. ${await this.#details()}`);
    }
    return status;
  }

  async #assertNotFailed(status) {
    if (FAILURE_STATUSES.includes(status)) {
      throw failureFor(status, await this.#details());
    }
  }

  #assertWithinTimeLimit() {
    if (Date.now() - this.#gameStartedAt > GAME_DURATION_LIMIT_MS) {
      throw new GameDurationExceededError(
        `Game lasted longer than ${GAME_DURATION_LIMIT_MS / 60_000} min. Shots fired: ${this.#shots.length}`,
      );
    }
  }

  async #details() {
    const last = this.#shots.at(-1);
    const lastShot = last
      ? `${formatCell(last.row, last.col)} (${last.result}, ${last.mode})`
      : 'none';
    const siteMessage = await this.#game.notifications.visibleText();
    return `Shots fired: ${this.#shots.length}; last shot: ${lastShot}; site message: "${siteMessage || 'none'}"`;
  }
}