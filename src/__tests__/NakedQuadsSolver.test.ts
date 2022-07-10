import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { CellValue } from '../CellValue';
import { CellValueChange } from '../Grid';
import { ValueComboType } from '../ValueTypes';
import { SolverHelpers } from '../solvers/SolverHelpers';

/**
 * see https://sudoku.org.uk/SolvingTechniques/NakedQuads.asp
 */
test('Naked Quads Solver - solve for a (1234) (1234) (123) (134) row', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 8, column: 1 }, new CellValue([1, 5, 6, 8])),
    new Cell({ row: 8, column: 2 }, new CellValue([5, 6, 7, 8, 9])),
    new Cell({ row: 8, column: 3 }, new CellValue([1, 5, 6, 7])),
    new Cell({ row: 8, column: 4 }, new CellValue([1, 3, 8])),
    new Cell({ row: 8, column: 5 }, new CellValue([1, 3, 4, 8])),
    new Cell({ row: 8, column: 6 }, new CellValue([2])),
    new Cell({ row: 8, column: 7 }, new CellValue([1, 3, 4])),
    new Cell({ row: 8, column: 8 }, new CellValue([4, 7, 8, 9])),
    new Cell({ row: 8, column: 9 }, new CellValue([1, 3, 4, 8])),
  ]);

  const expected: CellValueChange[] = [
    { location: { row: 8, column: 1 }, valuesToRemove: [1, 8] },
    { location: { row: 8, column: 2 }, valuesToRemove: [8] },
    { location: { row: 8, column: 3 }, valuesToRemove: [1] },
    { location: { row: 8, column: 8 }, valuesToRemove: [4, 8] },
  ];

  expect(SolverHelpers.processNakedCellsInBlock(cc, ValueComboType.Quad)).toEqual(expected);
});
