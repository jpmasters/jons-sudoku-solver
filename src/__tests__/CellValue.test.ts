import { CellValue } from '../CellValue';

test('Default constructor instantiates a cell value with all possible states', () => {
  const c = new CellValue();

  // object is created
  expect(c).not.toBeNull();

  // has no known value
  expect(c.hasKnownValue).toBeFalsy();

  // has the correct values
  expect(c.valuePotentials).toStrictEqual(Array(9).fill(true));
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
  expect(d.valuePotentials).toStrictEqual([false, false, true, true, true, false, false, false, false]);
});

test('Copy returns a deep copy', () => {
  const c = new CellValue([3, 4, 5]);
  const d = c.copy();

  expect(d.valuePotentials).not.toBe(c.valuePotentials);
});

test('Remove a potential value sets it (and only it) to false.', () => {
  const c = new CellValue();

  expect(c.valuePotentials.length).toBe(9);
  c.valuePotentials.forEach((v) => {
    expect(v).toBeTruthy();
  });

  const d = c.removePotential(5);
  const cCheck = Array(9).fill(true);
  let dCheck = Array(9).fill(true);
  dCheck[4] = false;

  // c should be untouched
  expect(c.valuePotentials).toEqual(cCheck);

  // d should have the removed potential set to false
  // and it should not have settled onm a value yet
  expect(d.hasKnownValue).toBeFalsy();
  expect(d.valuePotentials).toEqual(dCheck);
});

test('potentialValues returns correct values', () => {
  let c = new CellValue();
  expect(c.potentialValues).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  c = c.removePotential(5);
  expect(c.potentialValues).toEqual([1, 2, 3, 4, 6, 7, 8, 9]);

  c = new CellValue([1, 2, 4]);
  expect(c.potentialValues).toEqual([1, 2, 4]);

  c = new CellValue([3]);
  expect(c.hasKnownValue).toBeTruthy();
  expect(c.potentialValues).toEqual([3]);
});
