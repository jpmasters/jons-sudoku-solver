import { SudokuAllPossibleValues } from '../ValueTypes';
import { Grid } from '../Grid';
import { testPuzzle2 } from './puzzles.test';
import { IntersectingCells } from '../IntersectingCells';
import { emptyPuzzle } from '../EmptyPuzzle';

test('Can create an IntersectingCells object from a Grid', () => {
  const grid = Grid.fromGrid(testPuzzle2);
  const intersectingCells: IntersectingCells = IntersectingCells.fromGridLocation(grid, { column: 5, row: 7 });

  expect(intersectingCells).toBeInstanceOf(IntersectingCells);
  expect(intersectingCells.values.length).toBe(21);
});

test('setValue throws if the location cannot be found', () => {
  const grid = Grid.fromGrid(testPuzzle2);
  const intersectingCells: IntersectingCells = IntersectingCells.fromGridLocation(grid, { column: 5, row: 7 });

  expect(() => {
    intersectingCells.setValue({ column: 1, row: 1 }, 9);
  }).toThrow();

  expect(() => {
    intersectingCells.setValue({ column: 5, row: 3 }, 1);
  }).not.toThrow();
});

test('setValue sets the value', () => {
  const grid = Grid.fromGrid(testPuzzle2);
  const intersectingCells: IntersectingCells = IntersectingCells.fromGridLocation(grid, { column: 5, row: 7 });

  const cc2 = intersectingCells.setValue({ column: 5, row: 5 }, 4);
  expect(cc2.hasValue(4)).toBeTruthy();
  expect(cc2.cellAtLocation({ column: 5, row: 5 })?.value.value).toBe(4);
  expect(cc2.values.filter((cell) => cell.location.column === 5 && cell.location.row === 5).length).toBe(1);
});

test('setValue having set a value removes that as a potentia value for all other cells in the collection.', () => {
  const grid = Grid.fromGrid(emptyPuzzle);
  const cc1: IntersectingCells = IntersectingCells.fromGridLocation(grid, { column: 5, row: 7 });

  const cc2 = cc1.setValue({ column: 5, row: 5 }, 9);

  expect(cc2.values.length).toBe(21);
  expect(cc2.cellAtLocation({ column: 5, row: 5 })?.value.value).toBe(9);
  cc2.values
    .filter((cell) => cell.location.column !== 5 || cell.location.row !== 5)
    .forEach((cell) => {
      SudokuAllPossibleValues.forEach((val, i) => {
        val === 9
          ? expect(cell.value.valuePotentials[i]).toBeFalsy()
          : expect(cell.value.valuePotentials[i]).toBeTruthy();
      });
    });
});
