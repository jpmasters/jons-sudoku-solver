import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { CellValue } from '../CellValue';
import { CellValueChange } from '../Grid';
import { PointingPairsSolver } from '../solvers/PointingPairsSolver';

test('Pointing Pairs found in a row', () => {
  const block: CellCollection = new CellCollection([
    new Cell({ row: 7, column: 7 }, new CellValue([9])),
    new Cell({ row: 7, column: 8 }, new CellValue([1])),
    new Cell({ row: 7, column: 9 }, new CellValue([3, 4, 8])),
    new Cell({ row: 8, column: 7 }, new CellValue([2, 4, 6, 7, 8])),
    new Cell({ row: 8, column: 8 }, new CellValue([2, 5, 6, 7, 8])),
    new Cell({ row: 8, column: 9 }, new CellValue([4, 7, 8])),
    new Cell({ row: 9, column: 7 }, new CellValue([2, 4, 7, 8])),
    new Cell({ row: 9, column: 8 }, new CellValue([2, 3, 5, 7, 8])),
    new Cell({ row: 9, column: 9 }, new CellValue([3, 4, 7, 8])),
  ]);

  const row: CellCollection = new CellCollection([
    new Cell({ row: 8, column: 1 }, new CellValue([9])),
    new Cell({ row: 8, column: 2 }, new CellValue([1, 4, 5, 8])),
    new Cell({ row: 8, column: 3 }, new CellValue([1, 2, 8])),
    new Cell({ row: 8, column: 4 }, new CellValue([3])),
    new Cell({ row: 8, column: 5 }, new CellValue([2, 4, 6, 7, 8])),
    new Cell({ row: 8, column: 6 }, new CellValue([4, 5, 6])),
    new Cell({ row: 8, column: 7 }, new CellValue([2, 4, 6, 7, 8])),
    new Cell({ row: 8, column: 8 }, new CellValue([2, 5, 6, 7, 8])),
    new Cell({ row: 8, column: 9 }, new CellValue([4, 7, 8])),
  ]);

  const expected: CellValueChange[] = [
    { location: { row: 8, column: 5 }, valuesToRemove: [6] },
    { location: { row: 8, column: 6 }, valuesToRemove: [6] },
  ];

  const diffs = PointingPairsSolver.solveForBlockAndRow(block, row, 'row');
  expect(diffs).toEqual(expected);
});

test('Pointing Pairs found in a column', () => {
  const block: CellCollection = new CellCollection([
    new Cell({ row: 4, column: 4 }, new CellValue([9, 6])),
    new Cell({ row: 4, column: 5 }, new CellValue([1])),
    new Cell({ row: 4, column: 6 }, new CellValue([3, 4, 8])),
    new Cell({ row: 5, column: 4 }, new CellValue([2, 4, 7, 8])),
    new Cell({ row: 5, column: 5 }, new CellValue([2, 5, 7, 8])),
    new Cell({ row: 5, column: 6 }, new CellValue([4, 7, 8])),
    new Cell({ row: 6, column: 4 }, new CellValue([2, 6, 8])),
    new Cell({ row: 6, column: 5 }, new CellValue([9])),
    new Cell({ row: 6, column: 6 }, new CellValue([3, 4, 7, 8])),
  ]);

  const column: CellCollection = new CellCollection([
    new Cell({ row: 1, column: 4 }, new CellValue([9])),
    new Cell({ row: 2, column: 4 }, new CellValue([1, 6, 5, 8])),
    new Cell({ row: 3, column: 4 }, new CellValue([1, 2, 8])),
    new Cell({ row: 4, column: 4 }, new CellValue([9, 6])),
    new Cell({ row: 5, column: 4 }, new CellValue([2, 4, 7, 8])),
    new Cell({ row: 6, column: 4 }, new CellValue([2, 6, 8])),
    new Cell({ row: 7, column: 4 }, new CellValue([2, 4, 7, 8])),
    new Cell({ row: 8, column: 4 }, new CellValue([2, 6, 7, 8])),
    new Cell({ row: 9, column: 4 }, new CellValue([2, 4, 8])),
  ]);

  const expected: CellValueChange[] = [
    { location: { row: 2, column: 4 }, valuesToRemove: [6] },
    { location: { row: 8, column: 4 }, valuesToRemove: [6] },
  ];

  const diffs = PointingPairsSolver.solveForBlockAndRow(block, column, 'column');
  expect(diffs).toEqual(expected);
});
