import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { CellValue } from '../CellValue';

test('Getting a Cell from a location works', () => {
  const cc = new CellCollection([
    new Cell({ column: 5, row: 5 }, new CellValue([4, 5, 6])),
    new Cell({ column: 6, row: 5 }, new CellValue([7, 8, 9])),
    new Cell({ column: 7, row: 5 }, new CellValue([1, 2, 3])),
    new Cell({ column: 8, row: 5 }, new CellValue([1, 4, 8])),
    new Cell({ column: 9, row: 5 }, new CellValue([2, 3, 4])),
  ]);

  expect(cc.cells.length).toBe(5);
  cc.cells.forEach((c) => {
    expect(c).toBeInstanceOf(Cell);
  });

  const testCell = cc.cellAtLocation({ column: 7, row: 5 });
  expect(testCell).not.toBeNull();
  expect(testCell).toBeInstanceOf(Cell);
});

test('Getting a cell from an invalid location returns null', () => {
  const cc = new CellCollection([
    new Cell({ column: 5, row: 5 }, new CellValue([4, 5, 6])),
    new Cell({ column: 6, row: 5 }, new CellValue([7, 8, 9])),
    new Cell({ column: 7, row: 5 }, new CellValue([1, 2, 3])),
    new Cell({ column: 8, row: 5 }, new CellValue([1, 4, 8])),
    new Cell({ column: 9, row: 5 }, new CellValue([2, 3, 4])),
  ]);

  expect(cc.cells.length).toBe(5);
  cc.cells.forEach((c) => {
    expect(c).toBeInstanceOf(Cell);
  });

  expect(() => {
    const testCell = cc.cellAtLocation({ column: 1, row: 1 });
  }).toThrowError();
});

test('Merging cell collections returns returns items from both collections.', () => {
  const cc1 = new CellCollection([
    new Cell({ column: 5, row: 5 }, new CellValue([1])),
    new Cell({ column: 6, row: 5 }, new CellValue([2])),
    new Cell({ column: 7, row: 5 }, new CellValue([3])),
    new Cell({ column: 8, row: 5 }, new CellValue([4])),
    new Cell({ column: 9, row: 5 }, new CellValue([5])),
  ]);

  const cc2 = new CellCollection([
    new Cell({ column: 1, row: 1 }, new CellValue([6])),
    new Cell({ column: 2, row: 1 }, new CellValue([7])),
    new Cell({ column: 3, row: 1 }, new CellValue([8])),
    new Cell({ column: 8, row: 5 }, new CellValue([9])),
  ]);

  const mergedCells = cc1.mergedWith(cc2);

  expect(mergedCells.cells.length).toBe(8);

  const replacedCell = mergedCells.cells.find((c) => {
    return c.location.column === 8 && c.location.row === 5;
  });

  expect(replacedCell).not.toBeUndefined();
  expect(replacedCell?.value.hasKnownValue).toBeTruthy();
  expect(replacedCell?.value.value).toBe(9);
});

test('hasLocation works', () => {
  const cc1 = new CellCollection([
    new Cell({ column: 5, row: 5 }, new CellValue([1])),
    new Cell({ column: 6, row: 5 }, new CellValue([2])),
    new Cell({ column: 7, row: 5 }, new CellValue([3])),
    new Cell({ column: 8, row: 5 }, new CellValue([4])),
    new Cell({ column: 9, row: 5 }, new CellValue([5])),
  ]);

  expect(cc1.hasLocation({ column: 5, row: 5 })).toBeTruthy();
  expect(cc1.hasLocation({ column: 1, row: 1 })).toBeFalsy();
});

test('hasValue works', () => {
  const cc1 = new CellCollection([
    new Cell({ column: 5, row: 5 }, new CellValue([1])),
    new Cell({ column: 6, row: 5 }, new CellValue([2])),
    new Cell({ column: 7, row: 5 }, new CellValue([3])),
    new Cell({ column: 8, row: 5 }, new CellValue([4])),
    new Cell({ column: 9, row: 5 }, new CellValue([5])),
  ]);

  expect(cc1.hasValue(3)).toBeTruthy();
  expect(cc1.hasValue(9)).toBeFalsy();
});
