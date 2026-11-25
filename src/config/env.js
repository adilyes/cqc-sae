const DEFAULT_BASE_URL = 'https://battleship-game.org/ru/';

export const env = Object.freeze({
  baseUrl: process.env.BASE_URL ?? DEFAULT_BASE_URL,
});