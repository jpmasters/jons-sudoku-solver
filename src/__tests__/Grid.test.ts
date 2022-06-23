import { Cell } from '../Cell';
import { Grid, GridColumns } from '../Grid';

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

test('Grid block from location returns wrong block number', () => {
  const testData = [
    [1, 1, 1],
    [4, 6, 5],
    [8, 3, 3],
    [1, 9, 7],
    [8, 9, 9],
  ];
  testData.forEach((vals) => {
    expect(Grid.gridBlockFromLocation({ x: vals[0], y: vals[1] })).toBe(vals[2] as GridColumns);
  });
});

test('Grid returns correct cell collection for a column', () => {
  const g = Grid.fromGrid(testPuzzle1);
  const col2 = [0, 8, 0, 7, 0, 0, 0, 9, 0];
  const col7 = [2, 0, 5, 0, 0, 0, 6, 0, 0];

  expect(g.values.length).toBe(81);

  expect(g.column(1).values.length).toBe(9);

  g.column(2).values.forEach((c, i) => {
    if (c.value.hasKnownValue) {
      expect(c.value.value).toBe(col2[i]);
    } else {
      expect(col2[i]).toBe(0);
    }
  });

  g.column(7).values.forEach((c, i) => {
    if (c.value.hasKnownValue) {
      expect(c.value.value).toBe(col7[i]);
    } else {
      expect(col7[i]).toBe(0);
    }
  });
});

test('Grid returns correct cell collection for a column', () => {
  const g = Grid.fromGrid(testPuzzle1);
  const row3 = [6, 0, 2, 0, 0, 0, 5, 0, 0];
  const row7 = [0, 0, 5, 0, 0, 0, 6, 0, 3];

  expect(g.values.length).toBe(81);

  expect(g.row(1).values.length).toBe(9);

  g.row(3).values.forEach((c, i) => {
    if (c.value.hasKnownValue) {
      expect(c.value.value).toBe(row3[i]);
    } else {
      expect(row3[i]).toBe(0);
    }
  });

  g.row(7).values.forEach((c, i) => {
    if (c.value.hasKnownValue) {
      expect(c.value.value).toBe(row7[i]);
    } else {
      expect(row7[i]).toBe(0);
    }
  });
});

test('Grid returns correct cell collection for a block', () => {
  const g = Grid.fromGrid(testPuzzle1);
  const block3 = [2, 0, 0, 0, 9, 0, 5, 0, 0];
  const block9 = [6, 0, 3, 0, 7, 0, 0, 0, 0];

  expect(g.values.length).toBe(81);

  expect(g.block(4).values.length).toBe(9);

  g.block(3).values.forEach((c, i) => {
    if (c.value.hasKnownValue) {
      expect(c.value.value).toBe(block3[i]);
    } else {
      expect(block3[i]).toBe(0);
    }
  });

  g.block(9).values.forEach((c, i) => {
    if (c.value.hasKnownValue) {
      expect(c.value.value).toBe(block9[i]);
    } else {
      expect(block9[i]).toBe(0);
    }
  });
});
