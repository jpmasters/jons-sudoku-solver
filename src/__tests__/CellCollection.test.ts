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
