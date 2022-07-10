import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { CellValue } from '../CellValue';
import { CellValueChange } from '../Grid';
import { NakedSinglesSolver } from '../solvers/NakedSinglesSolver';

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

  const expected: CellValueChange[] = [
    { location: { row: 5, column: 3 }, valuesToRemove: [7] },
    { location: { row: 6, column: 3 }, valuesToRemove: [7] },
  ];

  const diffs = NakedSinglesSolver.solveForBlock(cc);
  expect(diffs).toEqual(expected);
});
