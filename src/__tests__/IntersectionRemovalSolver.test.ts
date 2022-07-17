import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { IntersectionRemovalSolver } from '../solvers/IntersectionRemovalSolver';
import { CellValueChange } from '../ValueTypes';

//https://sudoku.org.uk/SolvingTechniques/IntersectionRemoval.asp
test('Solve the intersection removal example (Fig 10.2) in Sudoku.org.uk', () => {
  const block: CellCollection = new CellCollection([
    new Cell({ row: 7, column: 7 }, [3, 4, 5, 8]),
    new Cell({ row: 7, column: 8 }, [1, 3, 4, 5, 6, 8]),
    new Cell({ row: 7, column: 9 }, [1, 3, 5, 8]),
    new Cell({ row: 8, column: 7 }, [2]),
    new Cell({ row: 8, column: 8 }, [1, 3, 4, 5, 6]),
    new Cell({ row: 8, column: 9 }, [7]),
    new Cell({ row: 9, column: 7 }, [3, 4]),
    new Cell({ row: 9, column: 8 }, [1, 3, 4]),
    new Cell({ row: 9, column: 9 }, [9]),
  ]);

  const row: CellCollection = new CellCollection([
    new Cell({ row: 7, column: 1 }, [1, 6]),
    new Cell({ row: 7, column: 2 }, [9]),
    new Cell({ row: 7, column: 3 }, [4, 5]),
    new Cell({ row: 7, column: 4 }, [7]),
    new Cell({ row: 7, column: 5 }, [1, 4]),
    new Cell({ row: 7, column: 6 }, [2]),
    new Cell({ row: 7, column: 7 }, [3, 4, 5, 8]),
    new Cell({ row: 7, column: 8 }, [1, 3, 4, 5, 6, 8]),
    new Cell({ row: 7, column: 9 }, [1, 3, 5, 8]),
  ]);

  const expected: CellValueChange[] = [
    { source: 'IntersectionRemovalSolver', location: { row: 8, column: 8 }, valuesToRemove: [3] },
    { source: 'IntersectionRemovalSolver', location: { row: 9, column: 7 }, valuesToRemove: [3] },
    { source: 'IntersectionRemovalSolver', location: { row: 9, column: 8 }, valuesToRemove: [3] },
  ];

  const diffs = IntersectionRemovalSolver.solveForBlockAndRow(block, row);
  expect(diffs).toEqual(expected);
});
