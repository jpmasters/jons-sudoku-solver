import { SudokuAllPossibleValues, SudokuPossibleValues } from '../ValueTypes';

test('SudokuAllPossibleValues initialises correctly', () => {
  expect(SudokuAllPossibleValues).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('Can create an array of potential values', () => {
  const v: SudokuPossibleValues = [1, 2, 3];
  expect(v).toEqual([1, 2, 3]);
});
