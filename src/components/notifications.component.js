import { HIDDEN_NOTIFICATION_CLASS } from '../data/game-status.data.js';
import { parseGameStatus } from '../domain/game-status.js';

export class Notifications {
  constructor(root) {
    this.root = root;
  }

  async currentStatus() {
    const classNames = await this.root.evaluateAll(
      (elements, hiddenClass) =>
        elements.filter((el) => !el.classList.contains(hiddenClass)).map((el) => el.className),
      HIDDEN_NOTIFICATION_CLASS,
    );
    return parseGameStatus(classNames);
  }

  async visibleText() {
    const texts = await this.root.evaluateAll(
      (elements, hiddenClass) =>
        elements
          .filter((el) => !el.classList.contains(hiddenClass))
          .map((el) => el.textContent.replace(/\s+/g, ' ').trim()),
      HIDDEN_NOTIFICATION_CLASS,
    );
    return texts.join(' | ');
  }
}