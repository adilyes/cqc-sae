import { test as base } from '@playwright/test';
import { BattleshipBot } from '../src/game/battleship-bot.js';
import { BattleshipPage } from '../src/pages/battleship.page.js';
import { HuntTargetStrategy } from '../src/strategy/hunt-target.strategy.js';

export const test = base.extend({
  game: async ({ page }, use) => {
    await use(new BattleshipPage(page));
  },
  bot: async ({ game }, use) => {
    await use(new BattleshipBot({ game, strategy: new HuntTargetStrategy() }));
  },
});

export { expect } from '@playwright/test';