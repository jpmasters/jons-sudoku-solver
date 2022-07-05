import { Grid, GridDifference } from '../Grid';
import { hardTestPuzzle1 } from './puzzles.test';
import { ChangeResult, SolverHelpers } from '../SolverHelpers';
import { SolverStrategies } from '../SolverStrategies';
import { emptyPuzzle } from '../EmptyPuzzle';
import { CellCollection } from '../CellCollection';
import { Cell } from '../Cell';
import { CellValue } from '../CellValue';

test('findCollapsedValues works', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 1, column: 3 }, new CellValue([1, 3])),
    new Cell({ row: 2, column: 3 }, new CellValue([3, 6, 8, 9])),
    new Cell({ row: 3, column: 3 }, new CellValue([1, 3, 6, 8, 9])),
    new Cell({ row: 4, column: 3 }, new CellValue([7])),
    new Cell({ row: 5, column: 3 }, new CellValue([4, 7, 9])),
    new Cell({ row: 6, column: 3 }, new CellValue([5, 7, 9])),
    new Cell({ row: 7, column: 3 }, new CellValue([2, 3, 8])),
    new Cell({ row: 8, column: 3 }, new CellValue([1, 2, 8])),
    new Cell({ row: 9, column: 3 }, new CellValue([2, 3, 8])),
  ]);

  const expected: GridDifference[] = [
    { location: { row: 5, column: 3 }, valuesToRemove: [7] },
    { location: { row: 6, column: 3 }, valuesToRemove: [7] },
  ];

  const diffs = SolverStrategies.findCollapsedValues(cc);
  expect(diffs).toEqual(expected);
});

test('findSingleValues works', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 1, column: 3 }, new CellValue([1, 3])),
    new Cell({ row: 2, column: 3 }, new CellValue([3, 6, 8, 9])),
    new Cell({ row: 3, column: 3 }, new CellValue([1, 3, 6, 8, 9])),
    new Cell({ row: 4, column: 3 }, new CellValue([7])),
    new Cell({ row: 5, column: 3 }, new CellValue([4])),
    new Cell({ row: 6, column: 3 }, new CellValue([5])),
    new Cell({ row: 7, column: 3 }, new CellValue([3, 8])),
    new Cell({ row: 8, column: 3 }, new CellValue([1, 2, 8])),
    new Cell({ row: 9, column: 3 }, new CellValue([3, 8])),
  ]);

  const expected: GridDifference[] = [
    {
      location: { row: 8, column: 3 },
      valuesToRemove: [1, 8],
    },
  ];

  const diffs = SolverStrategies.findSingleValues(cc);
  expect(diffs.length).toBe(1);
  expect(diffs).toEqual(expected);
});

test('findHiddenPairs works', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 1, column: 3 }, new CellValue([1, 3])),
    new Cell({ row: 2, column: 3 }, new CellValue([3, 6, 8, 9])),
    new Cell({ row: 3, column: 3 }, new CellValue([1, 3, 6, 8, 9])),
    new Cell({ row: 4, column: 3 }, new CellValue([7])),
    new Cell({ row: 5, column: 3 }, new CellValue([4])),
    new Cell({ row: 6, column: 3 }, new CellValue([5])),
    new Cell({ row: 7, column: 3 }, new CellValue([2, 3, 8])),
    new Cell({ row: 8, column: 3 }, new CellValue([1, 2, 8])),
    new Cell({ row: 9, column: 3 }, new CellValue([2, 3, 8])),
  ]);

  const expected: GridDifference[] = [
    {
      location: { row: 2, column: 3 },
      valuesToRemove: [3, 8],
    },
    {
      location: { row: 3, column: 3 },
      valuesToRemove: [1, 3, 8],
    },
  ];

  const diffs = SolverStrategies.findHiddenPairs(cc);
  expect(diffs).toEqual(expected);
});

test('findHiddenPairs only selects pairs in the same cell!', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 1, column: 1 }, new CellValue([1, 3, 4])),
    new Cell({ row: 1, column: 2 }, new CellValue([2])),
    new Cell({ row: 1, column: 3 }, new CellValue([1, 3])),
    new Cell({ row: 1, column: 4 }, new CellValue([6])),
    new Cell({ row: 1, column: 5 }, new CellValue([5])),
    new Cell({ row: 1, column: 6 }, new CellValue([8])),
    new Cell({ row: 1, column: 7 }, new CellValue([1, 4, 7])),
    new Cell({ row: 1, column: 8 }, new CellValue([3, 7])),
    new Cell({ row: 1, column: 9 }, new CellValue([9])),
  ]);

  // should return nothing as their are no hidden pairs
  const expected: GridDifference[] = [];

  const diffs = SolverStrategies.findHiddenPairs(cc);
  expect(diffs).toEqual(expected);
});

test('findHiddenPairs works when there are multiple cells with 2 values', () => {
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

  // should return nothing as their are no hidden pairs
  const expected: GridDifference[] = [];

  const diffs = SolverStrategies.findHiddenPairs(cc);
  expect(diffs).toEqual(expected);
});
