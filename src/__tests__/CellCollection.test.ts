import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { CellValue } from '../CellValue';

test('Getting a Cell from a location works', () => {
  const cc = new CellCollection([
    new Cell({ x: 5, y: 5 }, new CellValue([4, 5, 6])),
    new Cell({ x: 6, y: 5 }, new CellValue([7, 8, 9])),
    new Cell({ x: 7, y: 5 }, new CellValue([1, 2, 3])),
    new Cell({ x: 8, y: 5 }, new CellValue([1, 4, 8])),
    new Cell({ x: 9, y: 5 }, new CellValue([2, 3, 4])),
  ]);

  expect(cc.values.length).toBe(5);
  cc.values.forEach((c) => {
    expect(c).toBeInstanceOf(Cell);
  });

  const testCell = cc.cellAtLocation({ x: 7, y: 5 });
  expect(testCell).not.toBeNull();
  expect(testCell).toBeInstanceOf(Cell);
});

test('Getting a cell from an invalid location returns null', () => {
  const cc = new CellCollection([
    new Cell({ x: 5, y: 5 }, new CellValue([4, 5, 6])),
    new Cell({ x: 6, y: 5 }, new CellValue([7, 8, 9])),
    new Cell({ x: 7, y: 5 }, new CellValue([1, 2, 3])),
    new Cell({ x: 8, y: 5 }, new CellValue([1, 4, 8])),
    new Cell({ x: 9, y: 5 }, new CellValue([2, 3, 4])),
  ]);

  expect(cc.values.length).toBe(5);
  cc.values.forEach((c) => {
    expect(c).toBeInstanceOf(Cell);
  });

  const testCell = cc.cellAtLocation({ x: 1, y: 1 });
  expect(testCell).toBeNull();
});

test('Merging cell collections returns returns items from both collections.', () => {
  const cc1 = new CellCollection([
    new Cell({ x: 5, y: 5 }, new CellValue([1])),
    new Cell({ x: 6, y: 5 }, new CellValue([2])),
    new Cell({ x: 7, y: 5 }, new CellValue([3])),
    new Cell({ x: 8, y: 5 }, new CellValue([4])),
    new Cell({ x: 9, y: 5 }, new CellValue([5])),
  ]);

  const cc2 = new CellCollection([
    new Cell({ x: 1, y: 1 }, new CellValue([6])),
    new Cell({ x: 2, y: 1 }, new CellValue([7])),
    new Cell({ x: 3, y: 1 }, new CellValue([8])),
    new Cell({ x: 8, y: 5 }, new CellValue([9])),
  ]);

  const mergedCells = cc1.mergedWith(cc2);

  expect(mergedCells.values.length).toBe(8);

  const replacedCell = mergedCells.values.find((c) => {
    return c.location.x === 8 && c.location.y === 5;
  });

  expect(replacedCell).not.toBeUndefined();
  expect(replacedCell?.value.hasKnownValue).toBeTruthy();
  expect(replacedCell?.value.value).toBe(9);
});

test('hasLocation works', () => {
  const cc1 = new CellCollection([
    new Cell({ x: 5, y: 5 }, new CellValue([1])),
    new Cell({ x: 6, y: 5 }, new CellValue([2])),
    new Cell({ x: 7, y: 5 }, new CellValue([3])),
    new Cell({ x: 8, y: 5 }, new CellValue([4])),
    new Cell({ x: 9, y: 5 }, new CellValue([5])),
  ]);

  expect(cc1.hasLocation({ x: 5, y: 5 })).toBeTruthy();
  expect(cc1.hasLocation({ x: 1, y: 1 })).toBeFalsy();
});

test('hasValue works', () => {
  const cc1 = new CellCollection([
    new Cell({ x: 5, y: 5 }, new CellValue([1])),
    new Cell({ x: 6, y: 5 }, new CellValue([2])),
    new Cell({ x: 7, y: 5 }, new CellValue([3])),
    new Cell({ x: 8, y: 5 }, new CellValue([4])),
    new Cell({ x: 9, y: 5 }, new CellValue([5])),
  ]);

  expect(cc1.hasValue(3)).toBeTruthy();
  expect(cc1.hasValue(9)).toBeFalsy();
});

test('setValue throws if the location cannot be found', () => {
  const cc1 = new CellCollection([
    new Cell({ x: 5, y: 5 }, new CellValue([1])),
    new Cell({ x: 6, y: 5 }, new CellValue([2])),
    new Cell({ x: 7, y: 5 }, new CellValue([3])),
    new Cell({ x: 8, y: 5 }, new CellValue([4])),
    new Cell({ x: 9, y: 5 }, new CellValue([5])),
  ]);

  expect(() => {
    cc1.setValue({ x: 1, y: 1 }, 9);
  }).toThrow();

  expect(() => {
    cc1.setValue({ x: 6, y: 5 }, 9);
  }).not.toThrow();
});

test('setValue throws if the value is already set in one of the other cells', () => {
  const cc1 = new CellCollection([
    new Cell({ x: 5, y: 5 }, new CellValue([1])),
    new Cell({ x: 6, y: 5 }, new CellValue([2])),
    new Cell({ x: 7, y: 5 }, new CellValue([3])),
    new Cell({ x: 8, y: 5 }, new CellValue([4])),
    new Cell({ x: 9, y: 5 }, new CellValue([5])),
  ]);

  expect(() => {
    cc1.setValue({ x: 5, y: 5 }, 3);
  }).toThrow();
});

test('setValue sets the value', () => {
  const cc1 = new CellCollection([
    new Cell({ x: 5, y: 5 }, new CellValue([1])),
    new Cell({ x: 6, y: 5 }, new CellValue([2])),
    new Cell({ x: 7, y: 5 }, new CellValue([3])),
    new Cell({ x: 8, y: 5 }, new CellValue([4])),
    new Cell({ x: 9, y: 5 }, new CellValue([5])),
  ]);

  const cc2 = cc1.setValue({ x: 5, y: 5 }, 9);
  expect(cc2.hasValue(9)).toBeTruthy();
  expect(cc2.cellAtLocation({ x: 5, y: 5 })?.value.value).toBe(9);
});

test('setValue having set a value removes that as a potentia value for all other cells in the collection.', () => {
  const cc1 = new CellCollection([
    new Cell({ x: 5, y: 5 }, new CellValue()),
    new Cell({ x: 6, y: 5 }, new CellValue()),
    new Cell({ x: 7, y: 5 }, new CellValue()),
    new Cell({ x: 8, y: 5 }, new CellValue()),
    new Cell({ x: 9, y: 5 }, new CellValue()),
  ]);

  const cc2 = cc1.setValue({ x: 5, y: 5 }, 9);

  expect(cc2.values.length).toBe(5);
  expect(cc2.cellAtLocation({ x: 5, y: 5 })?.value.value).toBe(9);
  cc2.values
    .filter((cell) => cell.location.x !== 5 && cell.location.y !== 5)
    .every((cell) => {
      expect(cell.value.valuePotentials[8]).toBeFalsy();
      expect(cell.value.valuePotentials[0]).toBeTruthy();
      return true;
    });
});
