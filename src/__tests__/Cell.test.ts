import { Cell } from '../Cell';
import { CellValue } from '../CellValue';
import { GridColumns, GridRows } from '../ValueTypes';

test('Can create a cell with default value', () => {
  const c = new Cell({ column: 1, row: 1 });
  expect(c).toBeInstanceOf(Cell);
  expect(c.location).toStrictEqual({ row: 1, column: 1 });
  expect(c.value.hasKnownValue).toBeFalsy();
  expect(c.value.valuePotentials).toStrictEqual([true, true, true, true, true, true, true, true, true]);
});

test('Created cell holds location correctly', () => {
  const c = new Cell({ column: 3, row: 6 });
  expect(c.location).toStrictEqual({ column: 3, row: 6 });
});

test('Cell location x and y in range', () => {
  expect(() => {
    const c = new Cell({ column: -1 as unknown as GridColumns, row: -1 as unknown as GridRows });
  }).toThrow();

  expect(() => {
    const c = new Cell({ column: 10 as unknown as GridRows, row: 10 as unknown as GridColumns });
  }).toThrow();
});

test('Copying a cell gives you a deep copy', () => {
  const c = new Cell({ column: 1, row: 1 }, new CellValue([1, 2, 3]));
  const d = c.copy();
  expect(c).toStrictEqual(d);
  expect(c === d).toBeFalsy();
  expect(c.location === d.location).toBeFalsy();
  expect(c.value === d.value).toBeFalsy();
  expect(c.value.valuePotentials === d.value.valuePotentials).toBeFalsy();
});
