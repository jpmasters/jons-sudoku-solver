import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { CellValueChange, ValueComboType } from '../ValueTypes';
import { SolverHelpers } from '../solvers/SolverHelpers';
import { HiddenTriplesSolver } from '../solvers/HiddenTriplesSolver';

/**
 * Test data from https://sudoku.org.uk/SolvingTechniques/HiddenTriples.asp
 */
test('Hidden Triple Solver - solve for a (123) (123) (12) column', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 1, column: 9 }, [7, 8, 9]),
    new Cell({ row: 2, column: 9 }, [5, 7, 8]),
    new Cell({ row: 3, column: 9 }, [2, 5, 7, 8]),
    new Cell({ row: 4, column: 9 }, [1, 2, 4, 5, 6, 7, 8]),
    new Cell({ row: 5, column: 9 }, [1, 2, 3, 4, 5, 7, 8]),
    new Cell({ row: 6, column: 9 }, [1, 3, 4, 5, 6, 7]),
    new Cell({ row: 7, column: 9 }, [3, 5, 7]),
    new Cell({ row: 8, column: 9 }, [3, 7]),
    new Cell({ row: 9, column: 9 }, [2, 9]),
  ]);

  const expected: CellValueChange[] = [
    { source: 'HiddenTriplesSolver', location: { row: 4, column: 9 }, valuesToRemove: [2, 5, 7, 8] },
    { source: 'HiddenTriplesSolver', location: { row: 5, column: 9 }, valuesToRemove: [2, 3, 5, 7, 8] },
    { source: 'HiddenTriplesSolver', location: { row: 6, column: 9 }, valuesToRemove: [3, 5, 7] },
  ];

  expect(SolverHelpers.processHiddenCellsInBlock(cc, ValueComboType.Triple, HiddenTriplesSolver.source)).toEqual(
    expected,
  );
});
