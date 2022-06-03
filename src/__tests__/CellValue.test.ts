import { CellValue } from '../CellValue';

test('Default constructor instantiates a cell value with all possible states', () => {
  const c = new CellValue();

  // object is created
  expect(c).not.toBeNull();

  // has no known value
  expect(c.hasKnownValue).toBeFalsy();

  // has the correct values
  expect(c.valuePotentials).toStrictEqual(Array(9).fill(1 / 9));
});

test('Reading the value before it is 100% known throws an exception.', () => {
  const c = new CellValue();
  expect(() => c.value).toThrow();
});

test('Reading the cell value after it has resolved sets hasValue to true', () => {
  const c = new CellValue([3]);
  expect(c.hasKnownValue).toBeTruthy();
});

test('Reading the cell value when it has resolved returns the correct value', () => {
  const c = new CellValue([4]);
  expect(c.value === 4);
});

test('Copy returns a new CellValue', () => {
  const c = new CellValue([3, 4, 5]);
  const d = c.copy();
  expect(d).toBeInstanceOf(CellValue);
});

test('Copy returns a CellValue with the correct values', () => {
  const c = new CellValue([3, 4, 5]);
  const d = c.copy();
  expect(d.valuePotentials).toStrictEqual([0, 0, 1 / 3, 1 / 3, 1 / 3, 0, 0, 0, 0]);
});

test('Copy returns a deep copy', () => {
  const c = new CellValue([3, 4, 5]);
  const d = c.copy();

  expect(d.valuePotentials).not.toBe(c.valuePotentials);
});
