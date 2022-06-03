import { SudokuCellValue } from '../SudokuCellValue';

test('Default constructor instantiates a cell value with all possible states', () => {
  const c = new SudokuCellValue();

  // object is created
  expect(c).not.toBeNull();

  // has no known value
  expect(c.hasKnownValue).toBeFalsy();

  // has the correct values
  expect(c.valuePotentials).toStrictEqual(Array(9).fill(1 / 9));
});

test('Reading the value before it is 100% known throws an exception.', () => {
  const c = new SudokuCellValue();
  expect(() => c.value).toThrow();
});

test('Reading the cell value after it has resolved sets hasValue to true', () => {
  const c = new SudokuCellValue([3]);
  expect(c.hasKnownValue).toBeTruthy();
});

test('Reading the cell value when it has resolved returns the correct value', () => {
  const c = new SudokuCellValue([4]);
  expect(c.value === 4);
});
