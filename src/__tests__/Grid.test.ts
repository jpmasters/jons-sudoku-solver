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
  const g = Grid.fromGrid(testPuzzle1);

  expect(g).toBeInstanceOf(Grid);
});

test('Grid has a 9x9 cell array', () => {
  const g = Grid.fromGrid(testPuzzle1);

  expect(g.values).not.toBeNull();
  expect(g.values.length).toBe(81);
});

test('Grid cannot be created with invalid arrays', () => {
  const errGrid1 = [[1]];
  const errGrid2 = [[0, 0, 0, 0, 0, 0, 0, 0, 0]];
  const errGrid3 = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
  const errGrid4 = [[0], [0], [0], [0], [0], [0], [0], [0], [0]];

  expect(() => {
    const g = Grid.fromGrid(errGrid1);
  }).toThrow();

  expect(() => {
    const g = Grid.fromGrid(errGrid2);
  }).toThrow();

  expect(() => {
    const g = Grid.fromGrid(errGrid3);
  }).toThrow();

  expect(() => {
    const g = Grid.fromGrid(errGrid4);
  }).toThrow();
});

test('Grid is created in the correct state', () => {
  const g = Grid.fromGrid(testPuzzle1);

  expect(g.values.length).toBe(81);

  g.values.forEach((c) => {
    if (testPuzzle1[c.location.y - 1][c.location.x - 1]) {
      expect(c.value.hasKnownValue).toBeTruthy();
      expect(c.value.value).toBe(testPuzzle1[c.location.y - 1][c.location.x - 1]);
    } else {
      expect(c.value.hasKnownValue).not.toBeTruthy();
    }
  });
});

test('Grid errors when it doesnt have 81 values', () => {
  const errGrid2 = [[0, 0, 0, 0, 0, 0, 0, 0, 0]];
  expect(() => {
    const g = Grid.fromGrid(errGrid2);
  }).toThrow();

  expect(() => {
    const g = new Grid([new Cell({ x: 1, y: 1 }), new Cell({ x: 2, y: 1 }), new Cell({ x: 3, y: 1 })]);
  }).toThrow();
});
