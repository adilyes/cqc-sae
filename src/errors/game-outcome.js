import { GAME_STATUS } from '../data/game-status.data.js';
import {
  DefeatError,
  RivalLeftError,
  ServerUnavailableError,
  SiteReportedError,
} from './game.error.js';

const FAILURES = Object.freeze({
  [GAME_STATUS.LOST]: {
    ErrorClass: DefeatError,
    reason: 'Defeat: the rival sank all our ships',
  },
  [GAME_STATUS.RIVAL_LEFT]: {
    ErrorClass: RivalLeftError,
    reason: 'Opponent disconnected before the game ended',
  },
  [GAME_STATUS.SERVER_ERROR]: {
    ErrorClass: ServerUnavailableError,
    reason: 'Connection lost: the game server is unavailable',
  },
  [GAME_STATUS.GAME_ERROR]: {
    ErrorClass: SiteReportedError,
    reason: 'The site reported an unexpected game error',
  },
});

export function failureFor(status, details) {
  const failure = FAILURES[status];
  if (!failure) {
    throw new Error(`No failure mapping for game status "${status}"`);
  }
  return new failure.ErrorClass(`${failure.reason}. ${details}`);
}