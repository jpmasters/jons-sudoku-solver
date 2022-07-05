import { Cell } from '../Cell';
import { Grid, GridDifference } from '../Grid';
import { GridColumns, GridRows } from '../ValueTypes';
import { easyTestPuzzle1, easyTestPuzzle3, easyTestPuzzle3Solved } from './puzzles.test';

test('Can create a grid from a 2D puzzle array', () => {
  const g = Grid.fromGrid(easyTestPuzzle1);

  expect(g).toBeInstanceOf(Grid);
});

test('Grid has a 9x9 cell array', () => {
  const g = Grid.fromGrid(easyTestPuzzle1);

  expect(g.cells).not.toBeNull();
  expect(g.cells.length).toBe(81);
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
  const g = Grid.fromGrid(easyTestPuzzle1);

  expect(g.cells.length).toBe(81);

  g.cells.forEach((c) => {
    if (easyTestPuzzle1[c.location.row - 1][c.location.column - 1]) {
      expect(c.value.hasKnownValue).toBeTruthy();
      expect(c.value.value).toBe(easyTestPuzzle1[c.location.row - 1][c.location.column - 1]);
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
    const g = new Grid([
      new Cell({ column: 1, row: 1 }),
      new Cell({ column: 2, row: 1 }),
      new Cell({ column: 3, row: 1 }),
    ]);
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
    expect(Grid.gridBlockFromLocation({ column: vals[0] as GridRows, row: vals[1] as GridColumns })).toBe(
      vals[2] as GridColumns,
    );
  });
});

test('Grid returns correct cell collection for a column', () => {
  const g = Grid.fromGrid(easyTestPuzzle1);
  const col2 = [0, 8, 9, 2, 0, 5, 0, 4, 0];
  const col7 = [7, 0, 5, 0, 9, 0, 0, 0, 0];

  expect(g.cells.length).toBe(81);

  expect(g.column(1).cells.length).toBe(9);

  g.column(2).cells.forEach((c, i) => {
    if (c.value.hasKnownValue) {
      expect(c.value.value).toBe(col2[i]);
    } else {
      expect(col2[i]).toBe(0);
    }
  });

  g.column(7).cells.forEach((c, i) => {
    if (c.value.hasKnownValue) {
      expect(c.value.value).toBe(col7[i]);
    } else {
      expect(col7[i]).toBe(0);
    }
  });
});

test('Grid returns correct cell collection for a column', () => {
  const g = Grid.fromGrid(easyTestPuzzle1);
  const row3 = [1, 9, 0, 0, 0, 4, 5, 0, 0];
  const row7 = [0, 0, 9, 3, 0, 0, 0, 7, 4];

  expect(g.cells.length).toBe(81);

  expect(g.row(1).cells.length).toBe(9);

  g.row(3).cells.forEach((c, i) => {
    if (c.value.hasKnownValue) {
      expect(c.value.value).toBe(row3[i]);
    } else {
      expect(row3[i]).toBe(0);
    }
  });

  g.row(7).cells.forEach((c, i) => {
    if (c.value.hasKnownValue) {
      expect(c.value.value).toBe(row7[i]);
    } else {
      expect(row7[i]).toBe(0);
    }
  });
});

test('Grid returns correct cell collection for a block', () => {
  const g = Grid.fromGrid(easyTestPuzzle1);
  const block3 = [7, 0, 1, 0, 9, 0, 5, 0, 0];
  const block9 = [0, 7, 4, 0, 3, 6, 0, 0, 0];

  expect(g.cells.length).toBe(81);

  expect(g.block(4).cells.length).toBe(9);

  g.block(3).cells.forEach((c, i) => {
    if (c.value.hasKnownValue) {
      expect(c.value.value).toBe(block3[i]);
    } else {
      expect(block3[i]).toBe(0);
    }
  });

  g.block(9).cells.forEach((c, i) => {
    if (c.value.hasKnownValue) {
      expect(c.value.value).toBe(block9[i]);
    } else {
      expect(block9[i]).toBe(0);
    }
  });
});

test('Is solved works', () => {
  const p1 = Grid.fromGrid(easyTestPuzzle3);
  const p2 = Grid.fromGrid(easyTestPuzzle3Solved);
  expect(p1.isSolved).toBeFalsy();
  expect(p2.isSolved).toBeTruthy();
});

test('Difference works', () => {
  const p1 = Grid.fromGrid(easyTestPuzzle3);
  const p2 = Grid.fromGrid(easyTestPuzzle3Solved);

  let diffs: GridDifference[] = p2.differences(p1);
  expect(diffs.length).toBe(51);
  expect(diffs.flatMap((d) => d.valuesToRemove).length).not.toBe(0);

  diffs = p1.differences(p2);
  expect(diffs.length).toBe(0);
  expect(diffs.flatMap((d) => d.valuesToRemove).length).toBe(0);

  const p3 = Grid.fromGrid([
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const p4 = Grid.fromGrid([
    [0, 0, 0, 0, 5, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  diffs = p3.differences(p4);
  expect(diffs.length).toBe(1);
  expect(diffs[0]).toEqual({location: {row: 1, column: 1}, valuesToRemove: [2, 3, 4, 5, 6, 7, 8, 9]});
});

test('Grid to puzzle array works', () => {
  const p1 = Grid.fromGrid(easyTestPuzzle3Solved);
  const res = p1.toPuzzleArray();
  expect(res).toEqual(easyTestPuzzle3Solved);
});
