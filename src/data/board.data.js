export const BOARD_SIZE = 10;

export const FLEET_SHIP_SIZES = Object.freeze([4, 3, 3, 2, 2, 2, 1, 1, 1, 1]);

export const ORTHOGONAL_OFFSETS = Object.freeze([
  { dRow: -1, dCol: 0 },
  { dRow: 1, dCol: 0 },
  { dRow: 0, dCol: -1 },
  { dRow: 0, dCol: 1 },
]);

export const ALL_OFFSETS = Object.freeze(
  [-1, 0, 1]
    .flatMap((dRow) => [-1, 0, 1].map((dCol) => ({ dRow, dCol })))
    .filter(({ dRow, dCol }) => dRow !== 0 || dCol !== 0),
);