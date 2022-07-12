import { Cell } from '../Cell';
import { SudokuAllPossibleValues } from '../ValueTypes';

test('Can create a cell with default value', () => {
  const c = new Cell({ column: 1, row: 1 });
  expect(c).toBeInstanceOf(Cell);
  expect(c.location).toStrictEqual({ row: 1, column: 1 });
  expect(c.hasKnownValue).toBeFalsy();
  expect(c.potentialValues).toStrictEqual(SudokuAllPossibleValues);
});

test('Created cell holds location correctly', () => {
  const c = new Cell({ column: 3, row: 6 });
  expect(c.location).toStrictEqual({ column: 3, row: 6 });
});

test('Copying a cell gives you a deep copy', () => {
  const c = new Cell({ column: 1, row: 1 }, [1, 2, 3]);
  const d = c.copy();
  expect(c).toStrictEqual(d);
  expect(c === d).toBeFalsy();
  expect(c.location === d.location).toBeFalsy();
  expect(c.potentialValues === d.potentialValues).toBeFalsy();
});

test('Default constructor instantiates a cell value with all possible states', () => {
  const c = new Cell({ column: 3, row: 6 });

  // object is created
  expect(c).not.toBeNull();

  // has no known value
  expect(c.hasKnownValue).toBeFalsy();

  // has the correct values
  expect(c.potentialValues).toStrictEqual(SudokuAllPossibleValues);
});

test('Reading the value before it is 100% known throws an exception.', () => {
  const c = new Cell({ column: 3, row: 6 });
  expect(() => c.value).toThrow();
});

test('Reading the cell value after it has resolved sets hasValue to true', () => {
  const c = new Cell({ column: 3, row: 6 }, [3]);
  expect(c.hasKnownValue).toBeTruthy();
});

test('Reading the cell value when it has resolved returns the correct value', () => {
  const c = new Cell({ column: 3, row: 6 }, [4]);
  expect(c.value === 4);
});

test('Copy returns a new CellValue', () => {
  const c = new Cell({ column: 3, row: 6 }, [3, 4, 5]);
  const d = c.copy();
  expect(d).toBeInstanceOf(Cell);
});

test('Copy returns a CellValue with the correct values', () => {
  const c = new Cell({ column: 3, row: 6 }, [3, 4, 5]);
  const d = c.copy();
  expect(d.potentialValues).toEqual([3, 4, 5]);
});

test('Copy returns a deep copy', () => {
  const c = new Cell({ column: 3, row: 6 }, [3, 4, 5]);
  const d = c.copy();

  expect(d.potentialValues).not.toBe(c.potentialValues);
});

test('Remove a potential value sets it (and only it) to false.', () => {
  const c = new Cell({ column: 3, row: 6 });

  expect(c.potentialValues).toStrictEqual(SudokuAllPossibleValues);

  const d = c.removePotentials([5, 8]);

  // c should be untouched
  expect(c.potentialValues).toEqual(SudokuAllPossibleValues);

  // d should have the removed potential set to false
  // and it should not have settled onm a value yet
  expect(d.hasKnownValue).toBeFalsy();
  expect(d.potentialValues).toEqual([1, 2, 3, 4, 6, 7, 9]);
});

test('potentialValues returns correct values', () => {
  let c = new Cell({ column: 3, row: 6 });
  expect(c.potentialValues).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  c = c.removePotentials([5]);
  expect(c.potentialValues).toEqual([1, 2, 3, 4, 6, 7, 8, 9]);

  c = new Cell({ column: 3, row: 6 }, [1, 2, 4]);
  expect(c.potentialValues).toEqual([1, 2, 4]);

  c = new Cell({ column: 3, row: 6 }, [3]);
  expect(c.hasKnownValue).toBeTruthy();
  expect(c.potentialValues).toEqual([3]);
});
