import { Grid } from '../Grid';
import {
  easyTestPuzzle3,
  easyTestPuzzle3Solved,
  hardTestPuzzle1,
  hardTestPuzzle1Intermediate,
  hardTestPuzzle1Solved,
} from './puzzles.test';
import { BacktrackingSolver } from '../solvers/BacktrackingSolver';
import { SolverHelpers } from '../solvers/SolverHelpers';
import { emptyPuzzle } from '../EmptyPuzzle';

test('Backtracking solver works on easy puzzle', () => {
  const grid = Grid.fromGrid(easyTestPuzzle3);

  const diffs = BacktrackingSolver.solve(grid);
  const solvedGrid = SolverHelpers.applyChangeList(grid, diffs);
  expect(solvedGrid.toPuzzleArray()).toEqual(easyTestPuzzle3Solved);
});

test('Backtracking solver works on hard puzzle', () => {
  const grid = Grid.fromGrid(hardTestPuzzle1);

  const diffs = BacktrackingSolver.solve(grid);
  const solvedGrid = SolverHelpers.applyChangeList(grid, diffs);
  expect(solvedGrid.toPuzzleArray()).toEqual(hardTestPuzzle1Solved);
});

test('Backtracking solver works on hard puzzle after other solvers have done their thing', () => {
  const sourceGrid = Grid.fromGrid(hardTestPuzzle1Intermediate);
  let targetGrid = Grid.fromGrid(emptyPuzzle);
  let diffs = sourceGrid.differences(targetGrid);

  targetGrid = SolverHelpers.applyChangeList(targetGrid, diffs);
  expect(targetGrid.toPuzzleArray()).toEqual(hardTestPuzzle1Intermediate);

  diffs = BacktrackingSolver.solve(targetGrid);
  const solvedGrid = SolverHelpers.applyChangeList(sourceGrid, diffs);
  expect(solvedGrid.toPuzzleArray()).toEqual(hardTestPuzzle1Solved);
});
