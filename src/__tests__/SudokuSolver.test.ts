import { emptyPuzzle } from '../EmptyPuzzle';
import { SudokuSolver } from '../SudokuSolver';
import { CellValueChange } from '../ValueTypes';
import {
  easyTestPuzzle1,
  easyTestPuzzle2,
  easyTestPuzzle3,
  easyTestPuzzle3Solved,
  hardTestPuzzle1,
  hardTestPuzzle1Solved,
  hardTestPuzzle2,
  hardTestPuzzle2Solved,
  hardTestPuzzle3,
  hardTestPuzzle3Solved,
} from './puzzles.test';

const invalidPuzzle1: number[][] = [];

const invalidPuzzle2: number[][] = [[0, 0, 0, 0]];

const invalidPuzzle3: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const invalidPuzzle4: number[][] = [
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

const invalidPuzzle5: number[][] = [
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

const invalidPuzzle6: number[][] = [
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

const invalidPuzzle7: number[][] = [
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

test('Solver solves!', () => {
  const solvedPuzzle: number[][] = SudokuSolver.solve(easyTestPuzzle3);
  expect(solvedPuzzle).toEqual(easyTestPuzzle3Solved);
});

test('Solves testPuzzle1', () => {
  const solvedPuzzle: number[][] = SudokuSolver.solve(easyTestPuzzle1);
  expect(solvedPuzzle.flat().filter((v) => !!v).length).toBe(81);
});

test('Solves testPuzzle2', () => {
  const solvedPuzzle: number[][] = SudokuSolver.solve(easyTestPuzzle2);
  expect(solvedPuzzle.flat().filter((v) => !!v).length).toBe(81);
});

test('Solves hardPuzzle2', () => {
  const solvedPuzzle: number[][] = SudokuSolver.solve(hardTestPuzzle2);
  expect(solvedPuzzle.flat().filter((v) => !!v).length).toBe(81);
  expect(solvedPuzzle).toEqual(hardTestPuzzle2Solved);
});

test('Solves hardPuzzle1', () => {
  const solvedPuzzle: number[][] = SudokuSolver.solve(hardTestPuzzle1);
  expect(solvedPuzzle).toStrictEqual(hardTestPuzzle1Solved);
});

test('Solves hardPuzzle3', () => {
  const solvedPuzzle: number[][] = SudokuSolver.solve(hardTestPuzzle3);
  expect(solvedPuzzle).toStrictEqual(hardTestPuzzle3Solved);
});

test('Callback function works in options', () => {
  let callbackCount = 0;

  SudokuSolver.solve(easyTestPuzzle1, {
    stepCallback: (changes, grid) => {
      const expected: CellValueChange = {
        source: 'NakedSinglesSolver',
        location: { row: 1, column: 1 },
        valuesToRemove: [2],
      };

      callbackCount++;
      if (callbackCount === 1) {
        expect(changes).toEqual(expect.arrayContaining([expected]));
      }
    },
  });

  expect(callbackCount).toBeGreaterThan(0);
});
