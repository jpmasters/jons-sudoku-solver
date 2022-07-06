import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { CellValue } from '../CellValue';
import { CellValueChange } from '../Grid';
import { ObviousPairsSolver } from '../solvers/ObviousPairsSolver';

test('findObviousPairs works', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 1, column: 1 }, new CellValue([1, 3, 4])),
    new Cell({ row: 1, column: 2 }, new CellValue([2])),
    new Cell({ row: 1, column: 3 }, new CellValue([1, 3])),
    new Cell({ row: 2, column: 1 }, new CellValue([7])),
    new Cell({ row: 2, column: 2 }, new CellValue([3, 4, 6, 8])),
    new Cell({ row: 2, column: 3 }, new CellValue([6, 9])),
    new Cell({ row: 3, column: 1 }, new CellValue([5])),
    new Cell({ row: 3, column: 2 }, new CellValue([1, 3, 4, 6, 8])),
    new Cell({ row: 3, column: 3 }, new CellValue([6, 9])),
  ]);

  const expected: CellValueChange[] = [
    {
      location: { row: 2, column: 2 },
      valuesToRemove: [6],
    },
    {
      location: { row: 3, column: 2 },
      valuesToRemove: [6],
    },
  ];

  const diffs = ObviousPairsSolver.solveForBlock(cc);
  expect(diffs).toEqual(expected);
});

test('findObviousPairs pairs must match values', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 4, column: 1 }, new CellValue([1, 8])),
    new Cell({ row: 4, column: 2 }, new CellValue([1, 6, 8])),
    new Cell({ row: 4, column: 3 }, new CellValue([7])),
    new Cell({ row: 4, column: 4 }, new CellValue([8, 9])),
    new Cell({ row: 4, column: 5 }, new CellValue([6, 8, 9])),
    new Cell({ row: 4, column: 6 }, new CellValue([2])),
    new Cell({ row: 4, column: 7 }, new CellValue([3])),
    new Cell({ row: 4, column: 8 }, new CellValue([4])),
    new Cell({ row: 4, column: 9 }, new CellValue([5])),
  ]);

  const expected: CellValueChange[] = [];

  const diffs = ObviousPairsSolver.solveForBlock(cc);
  expect(diffs).toEqual(expected);
});

test('findObviousPairs find multiple pairs', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 4, column: 1 }, new CellValue([1, 8])),
    new Cell({ row: 4, column: 2 }, new CellValue([2, 4])),
    new Cell({ row: 4, column: 3 }, new CellValue([7, 4])),
    new Cell({ row: 4, column: 4 }, new CellValue([8, 9])),
    new Cell({ row: 4, column: 5 }, new CellValue([6])),
    new Cell({ row: 4, column: 6 }, new CellValue([2, 4])),
    new Cell({ row: 4, column: 7 }, new CellValue([3, 1])),
    new Cell({ row: 4, column: 8 }, new CellValue([1, 8])),
    new Cell({ row: 4, column: 9 }, new CellValue([5])),
  ]);

  const expected: CellValueChange[] = [
    {
      location: { row: 4, column: 4 },
      valuesToRemove: [8],
    },
    {
      location: { row: 4, column: 7 },
      valuesToRemove: [1],
    },
    {
      location: { row: 4, column: 3 },
      valuesToRemove: [4],
    },
  ];

  const diffs = ObviousPairsSolver.solveForBlock(cc);
  expect(diffs).toEqual(expected);
});
