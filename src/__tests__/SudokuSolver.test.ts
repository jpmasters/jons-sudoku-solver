import { emptyPuzzle } from '../EmptyPuzzle';
import { GridDifference, Grid } from '../Grid';
import { SudokuSolver } from '../SudokuSolver';
import { testPuzzle1, testPuzzle2, testPuzzle3, testPuzzle3Solved } from './puzzles.test';

const invalidPuzzle1: Array<Array<number>> = [];

const invalidPuzzle2: Array<Array<number>> = [[0, 0, 0, 0]];

const invalidPuzzle3: Array<Array<number>> = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const invalidPuzzle4: Array<Array<number>> = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const invalidPuzzle5: Array<Array<number>> = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const invalidPuzzle6: Array<Array<number>> = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, -1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const invalidPuzzle7: Array<Array<number>> = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 10, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

test('Solver accepts 9x9 grid only.', () => {
  expect(() => {
    SudokuSolver.solve(invalidPuzzle1);
  }).toThrowError();

  expect(() => {
    SudokuSolver.solve(invalidPuzzle2);
  }).toThrowError();

  expect(() => {
    SudokuSolver.solve(invalidPuzzle3);
  }).toThrowError();

  expect(() => {
    SudokuSolver.solve(invalidPuzzle4);
  }).toThrowError();

  expect(() => {
    SudokuSolver.solve(invalidPuzzle5);
  }).toThrowError();

  expect(() => {
    SudokuSolver.solve(invalidPuzzle6);
  }).toThrowError();

  expect(() => {
    SudokuSolver.solve(invalidPuzzle7);
  }).toThrowError();

  expect(() => {
    SudokuSolver.solve(emptyPuzzle);
  }).toThrowError();
});

test('Apply changes works', () => {
  const gInitial = Grid.fromGrid(testPuzzle3);
  let cl: Array<GridDifference> = [];
  gInitial.values.forEach((cell) => {
    if (cell.value.hasKnownValue) {
      cl.push({ location: { ...cell.location }, value: cell.value.value });
    }
  });
  let gStart = Grid.fromGrid(emptyPuzzle);
  const updatedGrid = SudokuSolver.applyChangeList(gStart, cl);

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

test('Solver solves!', () => {
  const solvedPuzzle: number[][] = SudokuSolver.solve(testPuzzle3);
  expect(solvedPuzzle).toEqual(testPuzzle3Solved);
});

test('Grid to puzzle array works', () => {
  const p1 = Grid.fromGrid(testPuzzle3Solved);
  const res = SudokuSolver.gridToPuzzleArray(p1);
  expect(res).toEqual(testPuzzle3Solved);
});

test('Solves testPuzzle1', () => {
  const solvedPuzzle: number[][] = SudokuSolver.solve(testPuzzle1);
  expect(solvedPuzzle.flat().filter((v) => !!v).length).toBe(81);
});

test('Solves testPuzzle2', () => {
  const solvedPuzzle: number[][] = SudokuSolver.solve(testPuzzle2);
  expect(solvedPuzzle.flat().filter((v) => !!v).length).toBe(81);
});
