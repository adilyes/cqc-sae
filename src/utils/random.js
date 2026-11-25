export function randomInt(min, max) {
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new TypeError(`randomInt expects integers, got min=${min}, max=${max}`);
  }
  if (min > max) {
    throw new RangeError(`randomInt: min (${min}) must not be greater than max (${max})`);
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pickRandom(items, rng = Math.random) {
  if (items.length === 0) {
    throw new RangeError('pickRandom: cannot pick from an empty list');
  }
  return items[Math.floor(rng() * items.length)];
}