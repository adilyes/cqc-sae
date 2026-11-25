import { FLEET_SHIP_SIZES } from '../data/board.data.js';

export function remainingShipSizes(sunkSizes) {
  const remaining = [...FLEET_SHIP_SIZES];
  for (const size of sunkSizes) {
    const index = remaining.indexOf(size);
    if (index === -1) {
      throw new Error(
        `Sunk ship of size ${size} does not fit the fleet [${FLEET_SHIP_SIZES.join(', ')}]`,
      );
    }
    remaining.splice(index, 1);
  }
  return remaining;
}

export function isFleetDestroyed(sunkSizes) {
  return remainingShipSizes(sunkSizes).length === 0;
}