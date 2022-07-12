import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { CellValue } from '../CellValue';
import { CellValueChange } from '../Grid';
import { ValueComboType } from '../ValueTypes';
import { SolverHelpers } from '../solvers/SolverHelpers';

/**
 * Test data from https://sudoku.org.uk/SolvingTechniques/HiddenTriples.asp
 */
test('Hidden Quads Solver - solve for a (1234) (234) (124) (23) column', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 1, column: 8 }, new CellValue([1])),
    new Cell({ row: 2, column: 8 }, new CellValue([4, 5, 6])),
    new Cell({ row: 3, column: 8 }, new CellValue([4, 9])),
    new Cell({ row: 4, column: 8 }, new CellValue([3, 5, 6])),
    new Cell({ row: 5, column: 8 }, new CellValue([3, 5, 6, 7])),
    new Cell({ row: 6, column: 8 }, new CellValue([3, 5, 7])),
    new Cell({ row: 7, column: 8 }, new CellValue([2, 4, 8, 9])),
    new Cell({ row: 8, column: 8 }, new CellValue([2, 4])),
    new Cell({ row: 9, column: 8 }, new CellValue([2, 8, 9])),
  ]);

  const expected: CellValueChange[] = [{ location: { row: 2, column: 8 }, valuesToRemove: [4] }];

  expect(SolverHelpers.processHiddenCellsInBlock(cc, ValueComboType.Quad)).toEqual(expected);
});
