import { NOTIFICATION_CSS_CLASS_TO_STATUS } from '../data/game-status.data.js';

export function parseGameStatus(classNames) {
  const statuses = classNames
    .flatMap((className) => className.split(/\s+/))
    .filter((cssClass) => cssClass in NOTIFICATION_CSS_CLASS_TO_STATUS)
    .map((cssClass) => NOTIFICATION_CSS_CLASS_TO_STATUS[cssClass]);

  const unique = [...new Set(statuses)];
  if (unique.length > 1) {
    throw new Error(`Ambiguous game status, several notifications are visible: ${unique.join(', ')}`);
  }
  return unique[0] ?? null;
}