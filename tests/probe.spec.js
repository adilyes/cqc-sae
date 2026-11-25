import { test } from '@playwright/test';
import { BattleshipPage } from '../src/pages/battleship.page.js';
import { RANDOM_SHUFFLE_CLICKS } from '../src/data/scenario.data.js';
import { randomInt } from '../src/utils/random.js';

test('test game start', async ({ page }) => {
  const game = new BattleshipPage(page);
  await game.open();
  await game.shuffleShips(randomInt(RANDOM_SHUFFLE_CLICKS.MIN, RANDOM_SHUFFLE_CLICKS.MAX));
  await game.startGame();

  await page.pause();
});