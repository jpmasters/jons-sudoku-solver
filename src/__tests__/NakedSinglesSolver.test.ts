import { Grid } from '../Grid';
import { NakedSinglesSolver } from '../solvers/NakedSinglesSolver';
import { CellValueChange } from '../ValueTypes';
import { easyTestPuzzle1 } from './puzzles.test';

test('solveForCell() works', () => {
  const targetGrid = Grid.fromGrid(easyTestPuzzle1);

  const expected: CellValueChange[] = [
    // row
    { source: "NakedSinglesSolver", location: { row: 1, column: 1 }, valuesToRemove: [2] },
    { source: "NakedSinglesSolver", location: { row: 1, column: 2 }, valuesToRemove: [2] },
    { source: "NakedSinglesSolver", location: { row: 1, column: 3 }, valuesToRemove: [2] },
    { source: "NakedSinglesSolver", location: { row: 1, column: 6 }, valuesToRemove: [2] },
    { source: "NakedSinglesSolver", location: { row: 1, column: 8 }, valuesToRemove: [2] },
    // block
    { source: "NakedSinglesSolver", location: { row: 2, column: 4 }, valuesToRemove: [2] },
    { source: "NakedSinglesSolver", location: { row: 2, column: 6 }, valuesToRemove: [2] },
    { source: "NakedSinglesSolver", location: { row: 3, column: 4 }, valuesToRemove: [2] },
    { source: "NakedSinglesSolver", location: { row: 3, column: 5 }, valuesToRemove: [2] },
    // column
    { source: "NakedSinglesSolver", location: { row: 6, column: 4 }, valuesToRemove: [2] },
    { source: "NakedSinglesSolver", location: { row: 8, column: 4 }, valuesToRemove: [2] },
    { source: "NakedSinglesSolver", location: { row: 9, column: 4 }, valuesToRemove: [2] },
  ];

  const diffs = NakedSinglesSolver.solveForCell(targetGrid, targetGrid.cellAtLocation({ row: 1, column: 4 }));
  expect(diffs).toEqual(expected);
});

test('solve() solves only the first cell it encounters', () => {
  const targetGrid = Grid.fromGrid(easyTestPuzzle1);

  const expected: CellValueChange[] = [
    // row
    { source: "NakedSinglesSolver", location: { row: 1, column: 1 }, valuesToRemove: [2] },
    { source: "NakedSinglesSolver", location: { row: 1, column: 2 }, valuesToRemove: [2] },
    { source: "NakedSinglesSolver", location: { row: 1, column: 3 }, valuesToRemove: [2] },
    { source: "NakedSinglesSolver", location: { row: 1, column: 6 }, valuesToRemove: [2] },
    { source: "NakedSinglesSolver", location: { row: 1, column: 8 }, valuesToRemove: [2] },
    // block
    { source: "NakedSinglesSolver", location: { row: 2, column: 4 }, valuesToRemove: [2] },
    { source: "NakedSinglesSolver", location: { row: 2, column: 6 }, valuesToRemove: [2] },
    { source: "NakedSinglesSolver", location: { row: 3, column: 4 }, valuesToRemove: [2] },
    { source: "NakedSinglesSolver", location: { row: 3, column: 5 }, valuesToRemove: [2] },
    // column
    { source: "NakedSinglesSolver", location: { row: 6, column: 4 }, valuesToRemove: [2] },
    { source: "NakedSinglesSolver", location: { row: 8, column: 4 }, valuesToRemove: [2] },
    { source: "NakedSinglesSolver", location: { row: 9, column: 4 }, valuesToRemove: [2] },
  ];

  const diffs = NakedSinglesSolver.solve(targetGrid);
  expect(diffs).toEqual(expected);
});
