export class GameError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = new.target.name;
  }
}

export class DefeatError extends GameError {}
export class RivalLeftError extends GameError {}
export class ServerUnavailableError extends GameError {}
export class SiteReportedError extends GameError {}

export class RivalConnectTimeoutError extends GameError {}
export class MoveTimeoutError extends GameError {}
export class GameDurationExceededError extends GameError {}
export class ShotNotRegisteredError extends GameError {}
export class VictoryNotConfirmedError extends GameError {}