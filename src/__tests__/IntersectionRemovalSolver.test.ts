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

//https://sudoku.org.uk/SolvingTechniques/BoxLineReduction.asp
test('Solve the box line reduction example (Fig 11.1) in Sudoku.org.uk', () => {
  const block: CellCollection = new CellCollection([
    new Cell({ row: 4, column: 4 }, [1, 3, 7, 9]),
    new Cell({ row: 4, column: 5 }, [3, 6, 7, 9]),
    new Cell({ row: 4, column: 6 }, [1, 5, 6, 9]),
    new Cell({ row: 5, column: 4 }, [1, 4, 9]),
    new Cell({ row: 5, column: 5 }, [8]),
    new Cell({ row: 5, column: 6 }, [1, 5, 9]),
    new Cell({ row: 6, column: 4 }, [1, 4, 7, 9]),
    new Cell({ row: 6, column: 5 }, [2]),
    new Cell({ row: 6, column: 6 }, [1, 6, 9]),
  ]);

  const row: CellCollection = new CellCollection([
    new Cell({ row: 5, column: 1 }, [2]),
    new Cell({ row: 5, column: 2 }, [6]),
    new Cell({ row: 5, column: 3 }, [7]),
    new Cell({ row: 5, column: 4 }, [1, 4, 9]),
    new Cell({ row: 5, column: 5 }, [8]),
    new Cell({ row: 5, column: 6 }, [1, 5, 9]),
    new Cell({ row: 5, column: 7 }, [3]),
    new Cell({ row: 5, column: 8 }, [4, 5, 9]),
    new Cell({ row: 5, column: 9 }, [5, 9]),
  ]);

  const expected: CellValueChange[] = [
    { source: 'IntersectionRemovalSolver', location: { row: 4, column: 4 }, valuesToRemove: [1] },
    { source: 'IntersectionRemovalSolver', location: { row: 4, column: 6 }, valuesToRemove: [1] },
    { source: 'IntersectionRemovalSolver', location: { row: 6, column: 4 }, valuesToRemove: [1] },
    { source: 'IntersectionRemovalSolver', location: { row: 6, column: 6 }, valuesToRemove: [1] },
  ];

  const diffs = IntersectionRemovalSolver.solveForBlockAndRow(block, row);
  expect(diffs).toEqual(expected);
});

//https://sudoku.org.uk/SolvingTechniques/BoxLineReduction.asp
test('Solve the box line reduction example (Fig 11.2) in Sudoku.org.uk', () => {
  const block: CellCollection = new CellCollection([
    new Cell({ row: 1, column: 7 }, [3, 4, 5, 8]),
    new Cell({ row: 1, column: 8 }, [1, 3, 4, 5, 6, 8]),
    new Cell({ row: 1, column: 9 }, [1, 3, 5, 8]),
    new Cell({ row: 2, column: 7 }, [2]),
    new Cell({ row: 2, column: 8 }, [1, 3, 4, 5, 6]),
    new Cell({ row: 2, column: 9 }, [7]),
    new Cell({ row: 3, column: 7 }, [3, 4]),
    new Cell({ row: 3, column: 8 }, [1, 3, 4]),
    new Cell({ row: 3, column: 9 }, [9]),
  ]);

  const row: CellCollection = new CellCollection([
    new Cell({ row: 1, column: 1 }, [1, 6]),
    new Cell({ row: 1, column: 2 }, [9]),
    new Cell({ row: 1, column: 3 }, [4, 5]),
    new Cell({ row: 1, column: 4 }, [7]),
    new Cell({ row: 1, column: 5 }, [1, 4]),
    new Cell({ row: 1, column: 6 }, [2]),
    new Cell({ row: 1, column: 7 }, [3, 4, 5, 8]),
    new Cell({ row: 1, column: 8 }, [1, 3, 4, 5, 6, 8]),
    new Cell({ row: 1, column: 9 }, [1, 3, 5, 8]),
  ]);

  const expected: CellValueChange[] = [
    { source: 'IntersectionRemovalSolver', location: { row: 2, column: 8 }, valuesToRemove: [3] },
    { source: 'IntersectionRemovalSolver', location: { row: 3, column: 7 }, valuesToRemove: [3] },
    { source: 'IntersectionRemovalSolver', location: { row: 3, column: 8 }, valuesToRemove: [3] },
  ];

  const diffs = IntersectionRemovalSolver.solveForBlockAndRow(block, row);
  expect(diffs).toEqual(expected);
});
