import { emptyPuzzle } from '../EmptyPuzzle';
import { Grid, CellValueChange } from '../Grid';
import { SolverHelpers } from '../SolverHelpers';

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

  let cl: CellValueChange[] = sourceGrid.differences(targetGrid);

  const updatedGrid = SolverHelpers.applyChangeList(targetGrid, cl);
  expect(updatedGrid.toPuzzleArray()).toEqual(sourceGrid.toPuzzleArray());
});
