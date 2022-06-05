import { Cell } from '../Cell';
import { CellValue } from '../CellValue';

test('Can create a cell with default value', () => {
  const c = new Cell({ x: 1, y: 1 });
  expect(c).toBeInstanceOf(Cell);
  expect(c.location).toStrictEqual({ x: 1, y: 1 });
  expect(c.value.hasKnownValue).toBeFalsy();
  expect(c.value.valuePotentials).toStrictEqual([1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9]);
});

test('Created cell holds location correctly', () => {
  const c = new Cell({ x: 3, y: 6 });
  expect(c.location).toStrictEqual({ x: 3, y: 6 });
});

test('Cell location x and y in range', () => {
  expect(() => {
    const c = new Cell({ x: -1, y: -1 });
  }).toThrow();

  expect(() => {
    const c = new Cell({ x: 10, y: 10 });
  }).toThrow();
});

test('Copying a cell gives you a deep copy', () => {
  const c = new Cell({ x: 1, y: 1 }, new CellValue([1, 2, 3]));
  const d = c.copy();
  expect(c).toStrictEqual(d);
  expect(c === d).toBeFalsy();
  expect(c.location === d.location).toBeFalsy();
  expect(c.value === d.value).toBeFalsy();
  expect(c.value.valuePotentials === d.value.valuePotentials).toBeFalsy();
});
