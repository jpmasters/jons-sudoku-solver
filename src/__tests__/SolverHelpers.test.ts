import { emptyPuzzle } from '../EmptyPuzzle';
import { Grid, GridDifference } from '../Grid';
import { SolverHelpers } from '../SolverHelpers';
import { easyTestPuzzle3, easyTestPuzzle3Solved } from './puzzles.test';

test('Apply changes works', () => {
  const sourceGrid = Grid.fromGrid([
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  let targetGrid = Grid.fromGrid(emptyPuzzle);

  let cl: GridDifference[] = sourceGrid.differences(targetGrid);

  const updatedGrid = SolverHelpers.applyChangeList(targetGrid, cl);
  expect(updatedGrid.toPuzzleArray()).toEqual(sourceGrid.toPuzzleArray());
});
