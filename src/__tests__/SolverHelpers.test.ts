import { emptyPuzzle } from '../EmptyPuzzle';
import { Grid, GridDifference } from '../Grid';
import { SolverHelpers } from '../SolverHelpers';
import { testPuzzle3, testPuzzle3Solved } from './puzzles.test';

test('Apply changes works', () => {
  const gInitial = Grid.fromGrid(testPuzzle3);
  let cl: GridDifference[] = [];
  gInitial.values.forEach((cell) => {
    if (cell.value.hasKnownValue) {
      cl.push({ location: { ...cell.location }, value: cell.value.value });
    }
  });
  let gStart = Grid.fromGrid(emptyPuzzle);
  const updatedGrid = SolverHelpers.applyChangeList(gStart, cl);

  gInitial.values
    .filter((iVal) => iVal.value.hasKnownValue)
    .forEach((iVal) => {
      expect(
        updatedGrid.grid.cellAtLocation({ row: iVal.location.row, column: iVal.location.column })?.value.value,
      ).toBe(iVal.value.value);
    });

  const gSolved = Grid.fromGrid(testPuzzle3Solved);
  const newKnownValues = updatedGrid.grid.values
    .filter((val) => val.value.hasKnownValue)
    .filter((val) => !gInitial.cellAtLocation(val.location)?.value.hasKnownValue);

  expect(newKnownValues.length).toBeGreaterThan(0);

  newKnownValues.forEach((cell) => {
    expect(gSolved.cellAtLocation(cell.location)?.value.value).toBe(cell.value.value);
  });
});
