import { Battlefield } from '../components/battlefield.component.js';
import { UI_TEXT } from '../data/ui-text.data.js';

export class BattleshipPage {
  constructor(page) {
    this.page = page;
    this.shuffleButton = page.getByText(UI_TEXT.SHUFFLE_BUTTON);
    this.playButton = page.getByText(UI_TEXT.PLAY_BUTTON, { exact: true });
    this.rivalBoard = new Battlefield(page.locator('.battlefield.battlefield__rival'));
    this.ownBoard = new Battlefield(page.locator('.battlefield:not(.battlefield__rival)'));
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
}