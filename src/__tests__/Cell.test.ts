import { Cell } from '../Cell';

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
