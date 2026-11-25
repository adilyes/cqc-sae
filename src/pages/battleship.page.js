import { expect } from '@playwright/test';
import { Battlefield } from '../components/battlefield.component.js';
import { UI_TEXT } from '../data/ui-text.data.js';
import { Notifications } from '../components/notifications.component.js';

const ACTIVE_OPPONENT_CLASS = /battlefield-start-choose_rival-variant__active/;

export class BattleshipPage {
  constructor(page) {
    this.page = page;
    this.shuffleButton = page.getByText(UI_TEXT.SHUFFLE_BUTTON);
    this.playButton = page.getByText(UI_TEXT.PLAY_BUTTON, { exact: true });
    this.rivalBoard = new Battlefield(page.locator('.battlefield.battlefield__rival'));
    this.ownBoard = new Battlefield(page.locator('.battlefield:not(.battlefield__rival)'));
    this.notifications = new Notifications(page.locator('.notification'));
    this.randomOpponent = page.locator('.battlefield-start-choose_rival-variant', {
      hasText: UI_TEXT.RANDOM_OPPONENT,
    });
  }

  async open() {
    await this.page.goto('/ru/');
  }

  async shuffleShips(times) {
    for (let i = 0; i < times; i++) {
      await this.shuffleButton.click();
    }
  }

  async startGame() {
    await this.playButton.click();
  }

  async selectRandomOpponent() {
    await this.randomOpponent.click();
    await expect(
      this.randomOpponent,
      'Random opponent option should be active after selection',
    ).toHaveClass(ACTIVE_OPPONENT_CLASS);
  }
}