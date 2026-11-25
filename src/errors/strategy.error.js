export class StrategyError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = 'StrategyError';
  }
}