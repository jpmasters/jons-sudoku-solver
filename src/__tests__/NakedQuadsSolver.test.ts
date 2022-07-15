import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { CellValueChange, ValueComboType } from '../ValueTypes';
import { SolverHelpers } from '../solvers/SolverHelpers';
import { NakedQuadsSolver } from '../solvers/NakedQuadsSolver';

/**
 * see https://sudoku.org.uk/SolvingTechniques/NakedQuads.asp
 */
test('Naked Quads Solver - solve for a (1234) (1234) (123) (134) row', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 8, column: 1 }, [1, 5, 6, 8]),
    new Cell({ row: 8, column: 2 }, [5, 6, 7, 8, 9]),
    new Cell({ row: 8, column: 3 }, [1, 5, 6, 7]),
    new Cell({ row: 8, column: 4 }, [1, 3, 8]),
    new Cell({ row: 8, column: 5 }, [1, 3, 4, 8]),
    new Cell({ row: 8, column: 6 }, [2]),
    new Cell({ row: 8, column: 7 }, [1, 3, 4]),
    new Cell({ row: 8, column: 8 }, [4, 7, 8, 9]),
    new Cell({ row: 8, column: 9 }, [1, 3, 4, 8]),
  ]);

  const expected: CellValueChange[] = [
    { location: { row: 8, column: 1 }, source: 'NakedQuadsSolver', valuesToRemove: [1, 8] },
    { location: { row: 8, column: 2 }, source: 'NakedQuadsSolver', valuesToRemove: [8] },
    { location: { row: 8, column: 3 }, source: 'NakedQuadsSolver', valuesToRemove: [1] },
    { location: { row: 8, column: 8 }, source: 'NakedQuadsSolver', valuesToRemove: [4, 8] },
  ];

  expect(SolverHelpers.processNakedCellsInBlock(cc, ValueComboType.Quad, NakedQuadsSolver.source)).toEqual(expected);
});
