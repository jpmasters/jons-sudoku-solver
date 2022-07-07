import { Grid } from '../Grid';
import { easyTestPuzzle3, easyTestPuzzle3Solved, hardTestPuzzle1, hardTestPuzzle1Solved } from './puzzles.test';
import { BacktrackingSolver } from '../solvers/BacktrackingSolver';
import { SolverHelpers } from '../solvers/SolverHelpers';

test('Backtracking solver works', () => {
  const grid = Grid.fromGrid(easyTestPuzzle3);

  const diffs = BacktrackingSolver.solve(grid);
  const solvedGrid = SolverHelpers.applyChangeList(grid, diffs);
  expect(solvedGrid.toPuzzleArray()).toEqual(easyTestPuzzle3Solved);
});

test('Backtracking solver works', () => {
  const grid = Grid.fromGrid(hardTestPuzzle1);

  const diffs = BacktrackingSolver.solve(grid);
  const solvedGrid = SolverHelpers.applyChangeList(grid, diffs);
  expect(solvedGrid.toPuzzleArray()).toEqual(hardTestPuzzle1Solved);
});
