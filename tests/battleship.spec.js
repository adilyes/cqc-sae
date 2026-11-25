import { RANDOM_SHUFFLE_CLICKS } from '../src/data/scenario.data.js';
import { GAME_STATUS } from '../src/data/game-status.data.js';
import { randomInt } from '../src/utils/random.js';
import { expect, test } from './fixtures.js';

test('wins a game of Battleship against a random opponent', async ({ game, bot }) => {
  const shuffleClicks = randomInt(RANDOM_SHUFFLE_CLICKS.MIN, RANDOM_SHUFFLE_CLICKS.MAX);

  await test.step('Navigate to the game', () => game.open());
  
  await test.step('Select a random opponent', () => game.selectRandomOpponent());
  
  await test.step(`Arrange ships randomly (${shuffleClicks} clicks)`, () =>
    game.shuffleShips(shuffleClicks));
  
  await test.step('Click "Play"', () => game.startGame());

  const { shots } = await test.step('Wait for the rival and play the game', () => bot.play());
  test.info().annotations.push({ type: 'shots', description: String(shots) });

  expect(await game.notifications.currentStatus(), 'Game should end with a victory').toBe(
    GAME_STATUS.WON,
  );
});