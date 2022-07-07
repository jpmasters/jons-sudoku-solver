import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { CellValue } from '../CellValue';
import { Helpers } from '../Helpers';
import { GridLocation, SudokuPossibleValues } from '../ValueTypes';

test('Helpers arrayContainsAll works', () => {
  const arr1: SudokuPossibleValues = [1, 3, 5, 7, 9];
  const arr2: SudokuPossibleValues = [1, 3, 5, 7, 9];
  const arr3: SudokuPossibleValues = [3, 5, 7, 9];

  expect(Helpers.arrayContainsAll(arr1, arr2)).toBeTruthy();
  expect(Helpers.arrayContainsAll(arr2, arr1)).toBeTruthy();
  expect(Helpers.arrayContainsAll(arr1, arr3)).toBeTruthy();
  expect(Helpers.arrayContainsAll(arr3, arr1)).toBeFalsy();
});

test('Helpers arrayHasSameMembers works', () => {
  const arr1: SudokuPossibleValues = [1, 3, 5, 7, 9];
  const arr2: SudokuPossibleValues = [1, 3, 5, 7, 9];
  const arr3: SudokuPossibleValues = [3, 5, 7, 9];

  expect(Helpers.arrayHasSameMembers(arr1, arr2)).toBeTruthy();
  expect(Helpers.arrayHasSameMembers(arr2, arr1)).toBeTruthy();
  expect(Helpers.arrayHasSameMembers(arr1, arr3)).toBeFalsy();
  expect(Helpers.arrayHasSameMembers(arr3, arr1)).toBeFalsy();
});

test('Helpers sudokuValuesWithout works', () => {
  const arr1: SudokuPossibleValues = [1, 3, 5, 7, 9];
  const arr2: SudokuPossibleValues = [1, 2, 3, 4, 5, 6, 7, 8];

  expect(Helpers.sudokuValuesWithout(arr1)).toEqual([2, 4, 6, 8]);
  expect(Helpers.sudokuValuesWithout(arr2)).toEqual([9]);
});

test('locationArraysMatch works', () => {
  const loc1: GridLocation[] = [
    { column: 4, row: 5 },
    { column: 4, row: 6 },
  ];
  const loc2: GridLocation[] = [
    { column: 4, row: 5 },
    { column: 4, row: 6 },
  ];
  const loc3: GridLocation[] = [
    { column: 4, row: 5 },
    { column: 3, row: 6 },
  ];
  const loc4: GridLocation[] = [
    { column: 4, row: 5 },
    { column: 4, row: 6 },
    { column: 4, row: 7 },
  ];
  const loc5: GridLocation[] = [
    { column: 4, row: 5 },
    { column: 4, row: 6 },
    { column: 4, row: 7 },
  ];

  expect(Helpers.locationArraysMatch(loc1, loc2)).toBeTruthy();
  expect(Helpers.locationArraysMatch(loc4, loc5)).toBeTruthy();
  expect(Helpers.locationArraysMatch(loc1, loc3)).toBeFalsy();
  expect(Helpers.locationArraysMatch(loc1, loc4)).toBeFalsy();
  expect(Helpers.locationArraysMatch(loc2, loc5)).toBeFalsy();
});

test('Order cells works', () => {
  const cc1 = new CellCollection([
    new Cell({ column: 5, row: 5 }, new CellValue([4])),
    new Cell({ column: 1, row: 1 }, new CellValue([1])),
    new Cell({ column: 6, row: 5 }, new CellValue([5])),
    new Cell({ column: 7, row: 5 }, new CellValue([6])),
    new Cell({ column: 8, row: 5 }, new CellValue([7])),
    new Cell({ column: 3, row: 1 }, new CellValue([3])),
    new Cell({ column: 9, row: 5 }, new CellValue([9])),
    new Cell({ column: 2, row: 1 }, new CellValue([2])),
    new Cell({ column: 8, row: 5 }, new CellValue([8])),
  ]);

  const orderedCells = Helpers.orderCells(cc1.cells);
  expect(orderedCells.length).toBe(9);
  orderedCells.forEach((cell, i) => {
    expect(cell.value.hasKnownValue).toBeTruthy();
    expect(cell.value.value).toBe(i + 1);
  });
});
