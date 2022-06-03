import { Cell } from '../Cell';
import { Grid } from '../Grid';

const testPuzzle1 = [
  [0, 0, 0, 0, 0, 0, 2, 0, 0],
  [0, 8, 0, 0, 0, 7, 0, 9, 0],
  [6, 0, 2, 0, 0, 0, 5, 0, 0],
  [0, 7, 0, 0, 6, 0, 0, 0, 0],
  [0, 0, 0, 9, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 2, 0, 0, 4, 0],
  [0, 0, 5, 0, 0, 0, 6, 0, 3],
  [0, 9, 0, 4, 0, 0, 0, 7, 0],
  [0, 0, 6, 0, 0, 0, 0, 0, 0],
];

test('Can create a grid from a 2D puzzle array', () => {
  const g = new Grid(testPuzzle1);

  expect(g).toBeInstanceOf(Grid);
});

test('Grid has a 9x9 cell array', () => {
  const g = new Grid(testPuzzle1);

  expect(g.values).not.toBeNull();
  expect(g.values.length).toBe(9);
  g.values.forEach((row) => {
    expect(row.length).toBe(9);
  });
});

test('Grid cannot be created with invalid arrays', () => {
  const errGrid1 = [[1]];
  const errGrid2 = [[0, 0, 0, 0, 0, 0, 0, 0, 0]];
  const errGrid3 = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
  const errGrid4 = [[0], [0], [0], [0], [0], [0], [0], [0], [0]];

  expect(() => {
    const g = new Grid(errGrid1);
  }).toThrow();

  expect(() => {
    const g = new Grid(errGrid2);
  }).toThrow();

  expect(() => {
    const g = new Grid(errGrid3);
  }).toThrow();

  expect(() => {
    const g = new Grid(errGrid4);
  }).toThrow();
});

test('Grid is created in the correct state', () => {
  const g = new Grid(testPuzzle1);

  expect(g.values[0].length).toBe(9);

  g.values.forEach((row, y) => {
    row.forEach((val, x) => {
      if (testPuzzle1[y][x]) {
        expect(val.value.hasKnownValue).toBeTruthy();
        expect(val.value.value).toBe(testPuzzle1[y][x]);
      } else {
        expect(val.value.hasKnownValue).not.toBeTruthy();
      }
    });
  });
});
