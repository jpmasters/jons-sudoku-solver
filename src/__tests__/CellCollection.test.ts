import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { SudokuAllPossibleValues } from '../ValueTypes';

test('Getting a Cell from a location works', () => {
  const cc = new CellCollection([
    new Cell({ column: 5, row: 5 }, [4, 5, 6]),
    new Cell({ column: 6, row: 5 }, [7, 8, 9]),
    new Cell({ column: 7, row: 5 }, [1, 2, 3]),
    new Cell({ column: 8, row: 5 }, [1, 4, 8]),
    new Cell({ column: 9, row: 5 }, [2, 3, 4]),
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
    new Cell({ column: 5, row: 5 }, [4, 5, 6]),
    new Cell({ column: 6, row: 5 }, [7, 8, 9]),
    new Cell({ column: 7, row: 5 }, [1, 2, 3]),
    new Cell({ column: 8, row: 5 }, [1, 4, 8]),
    new Cell({ column: 9, row: 5 }, [2, 3, 4]),
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
    new Cell({ column: 5, row: 5 }, [1]),
    new Cell({ column: 6, row: 5 }, [2]),
    new Cell({ column: 7, row: 5 }, [3]),
    new Cell({ column: 8, row: 5 }, [4]),
    new Cell({ column: 9, row: 5 }, [5]),
  ]);

  const cc2 = new CellCollection([
    new Cell({ column: 1, row: 1 }, [6]),
    new Cell({ column: 2, row: 1 }, [7]),
    new Cell({ column: 3, row: 1 }, [8]),
    new Cell({ column: 8, row: 5 }, [9]),
  ]);

  const mergedCells = cc1.mergedWith(cc2);

  expect(mergedCells.cells.length).toBe(8);

  const replacedCell = mergedCells.cells.find((c) => {
    return c.location.column === 8 && c.location.row === 5;
  });

  expect(replacedCell).not.toBeUndefined();
  expect(replacedCell?.hasKnownValue).toBeTruthy();
  expect(replacedCell?.value).toBe(9);
});

test('hasLocation works', () => {
  const cc1 = new CellCollection([
    new Cell({ column: 5, row: 5 }, [1]),
    new Cell({ column: 6, row: 5 }, [2]),
    new Cell({ column: 7, row: 5 }, [3]),
    new Cell({ column: 8, row: 5 }, [4]),
    new Cell({ column: 9, row: 5 }, [5]),
  ]);

  expect(cc1.hasLocation({ column: 5, row: 5 })).toBeTruthy();
  expect(cc1.hasLocation({ column: 1, row: 1 })).toBeFalsy();
});

test('hasValue works', () => {
  const cc1 = new CellCollection([
    new Cell({ column: 5, row: 5 }, [1]),
    new Cell({ column: 6, row: 5 }, [2]),
    new Cell({ column: 7, row: 5 }, [3]),
    new Cell({ column: 8, row: 5 }, [4]),
    new Cell({ column: 9, row: 5 }, [5]),
  ]);

  expect(cc1.hasValue(3)).toBeTruthy();
  expect(cc1.hasValue(9)).toBeFalsy();
});

test('hasNoValues works', () => {
  const cc1 = new CellCollection([
    new Cell({ column: 5, row: 5 }, SudokuAllPossibleValues),
    new Cell({ column: 6, row: 5 }, SudokuAllPossibleValues),
    new Cell({ column: 7, row: 5 }, SudokuAllPossibleValues),
    new Cell({ column: 8, row: 5 }, SudokuAllPossibleValues),
    new Cell({ column: 9, row: 5 }, SudokuAllPossibleValues),
  ]);

  const cc2 = new CellCollection([
    new Cell({ column: 5, row: 5 }, [1]),
    new Cell({ column: 6, row: 5 }, [2]),
    new Cell({ column: 7, row: 5 }, SudokuAllPossibleValues),
    new Cell({ column: 8, row: 5 }, SudokuAllPossibleValues),
    new Cell({ column: 9, row: 5 }, [5]),
  ]);

  expect(cc1.hasNoValues()).toBeTruthy();
  expect(cc2.hasNoValues()).toBeFalsy();
});
