import { Grid, GridDifference } from '../Grid';
import { hardTestPuzzle1 } from './puzzles.test';
import { ChangeResult, SolverHelpers } from '../SolverHelpers';
import { SolverStrategies } from '../SolverStrategies';
import { emptyPuzzle } from '../EmptyPuzzle';

test('onlyValueInBlock works', () => {
  const sourceGrid: Grid = Grid.fromGrid(hardTestPuzzle1);
  const targetGrid: Grid = Grid.fromGrid(emptyPuzzle);

  // perform the initial collapse
  const changes: GridDifference[] = sourceGrid.differences(targetGrid);
  let res: ChangeResult = { grid: targetGrid, changes };

  while (res.changes.length) {
    // apply them to the target grid
    res = SolverHelpers.applyChangeList(res.grid, res.changes);
  }

  // at this point only the original 24 values are solved
  expect(
    res.grid
      .toPuzzleArray()
      .flat()
      .filter((val) => val).length,
  ).toBe(24);

  const row1 = res.grid.row(1);
  const diffs = SolverStrategies.onlyValueInBlock(row1);

  expect(diffs.length).toBe(1);
  expect(diffs[0]).toEqual({ location: { column: 5, row: 1 }, value: 5 });
});
