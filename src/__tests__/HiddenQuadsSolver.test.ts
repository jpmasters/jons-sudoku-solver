import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { CellValueChange, ValueComboType } from '../ValueTypes';
import { SolverHelpers } from '../solvers/SolverHelpers';
import { HiddenQuadsSolver } from '../solvers/HiddenQuadsSolver';

/**
 * Test data from https://sudoku.org.uk/SolvingTechniques/HiddenTriples.asp
 */
test('Hidden Quads Solver - solve for a (1234) (234) (124) (23) column', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 1, column: 8 }, [1]),
    new Cell({ row: 2, column: 8 }, [4, 5, 6]),
    new Cell({ row: 3, column: 8 }, [4, 9]),
    new Cell({ row: 4, column: 8 }, [3, 5, 6]),
    new Cell({ row: 5, column: 8 }, [3, 5, 6, 7]),
    new Cell({ row: 6, column: 8 }, [3, 5, 7]),
    new Cell({ row: 7, column: 8 }, [2, 4, 8, 9]),
    new Cell({ row: 8, column: 8 }, [2, 4]),
    new Cell({ row: 9, column: 8 }, [2, 8, 9]),
  ]);

  const expected: CellValueChange[] = [
    { source: 'HiddenQuadsSolver', location: { row: 2, column: 8 }, valuesToRemove: [4] },
  ];

  expect(SolverHelpers.processHiddenCellsInBlock(cc, ValueComboType.Quad, HiddenQuadsSolver.source)).toEqual(expected);
});
