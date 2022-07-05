import { Cell } from '../Cell';
import { CellValue } from '../CellValue';
import { GridColumns, GridRows, SudokuAllPossibleValues } from '../ValueTypes';

test('Can create a cell with default value', () => {
  const c = new Cell({ column: 1, row: 1 });
  expect(c).toBeInstanceOf(Cell);
  expect(c.location).toStrictEqual({ row: 1, column: 1 });
  expect(c.value.hasKnownValue).toBeFalsy();
  expect(c.value.potentialValues).toStrictEqual(SudokuAllPossibleValues);
});

test('Created cell holds location correctly', () => {
  const c = new Cell({ column: 3, row: 6 });
  expect(c.location).toStrictEqual({ column: 3, row: 6 });
});

test('Copying a cell gives you a deep copy', () => {
  const c = new Cell({ column: 1, row: 1 }, new CellValue([1, 2, 3]));
  const d = c.copy();
  expect(c).toStrictEqual(d);
  expect(c === d).toBeFalsy();
  expect(c.location === d.location).toBeFalsy();
  expect(c.value === d.value).toBeFalsy();
  expect(c.value.potentialValues === d.value.potentialValues).toBeFalsy();
});
