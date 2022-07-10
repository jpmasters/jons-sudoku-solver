import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { CellValue } from '../CellValue';
import { CellValueChange } from '../Grid';
import { ValueComboType } from '../ValueTypes';
import { SolverHelpers } from '../solvers/SolverHelpers';

test('Naked Triple Solver - solve for a (123) (123) (123) row', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 5, column: 1 }, new CellValue([5, 7, 8])),
    new Cell({ row: 5, column: 2 }, new CellValue([1, 5])),
    new Cell({ row: 5, column: 3 }, new CellValue([1, 2, 3, 5])),
    new Cell({ row: 5, column: 4 }, new CellValue([2, 5, 6, 8])),
    new Cell({ row: 5, column: 5 }, new CellValue([4])),
    new Cell({ row: 5, column: 6 }, new CellValue([1, 2, 3, 8, 9])),
    new Cell({ row: 5, column: 7 }, new CellValue([6, 9])),
    new Cell({ row: 5, column: 8 }, new CellValue([5, 7, 8])),
    new Cell({ row: 5, column: 9 }, new CellValue([5, 7, 8])),
  ]);

  const expected: CellValueChange[] = [
    { location: { row: 5, column: 2 }, valuesToRemove: [5] },
    { location: { row: 5, column: 3 }, valuesToRemove: [5] },
    { location: { row: 5, column: 4 }, valuesToRemove: [5, 8] },
    { location: { row: 5, column: 6 }, valuesToRemove: [8] },
  ];

  expect(SolverHelpers.processNakedCellsInBlock(cc, ValueComboType.Triple)).toEqual(expected);
});

/**
 * see https://sudoku.org.uk/SolvingTechniques/NakedTriples.asp
 */
test('Naked Triple Solver - solve for a (123) (123) (12) row', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 5, column: 1 }, new CellValue([7, 8])),
    new Cell({ row: 5, column: 2 }, new CellValue([1, 5])),
    new Cell({ row: 5, column: 3 }, new CellValue([1, 2, 3, 5])),
    new Cell({ row: 5, column: 4 }, new CellValue([2, 5, 6, 8])),
    new Cell({ row: 5, column: 5 }, new CellValue([4])),
    new Cell({ row: 5, column: 6 }, new CellValue([1, 2, 3, 8, 9])),
    new Cell({ row: 5, column: 7 }, new CellValue([6, 9])),
    new Cell({ row: 5, column: 8 }, new CellValue([5, 7, 8])),
    new Cell({ row: 5, column: 9 }, new CellValue([5, 7, 8])),
  ]);

  const expected: CellValueChange[] = [
    { location: { row: 5, column: 2 }, valuesToRemove: [5] },
    { location: { row: 5, column: 3 }, valuesToRemove: [5] },
    { location: { row: 5, column: 4 }, valuesToRemove: [5, 8] },
    { location: { row: 5, column: 6 }, valuesToRemove: [8] },
  ];

  expect(SolverHelpers.processNakedCellsInBlock(cc, ValueComboType.Triple)).toEqual(expected);
});

/**
 * See https://www.sudokuwiki.org/Naked_Candidates
 */
test('Naked Triple Solver - solve for a (123) (123) (12) block', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 4, column: 7 }, new CellValue([1, 4, 7, 8, 9])),
    new Cell({ row: 4, column: 8 }, new CellValue([2, 4, 7, 8, 9])),
    new Cell({ row: 4, column: 9 }, new CellValue([2, 3, 8])),
    new Cell({ row: 5, column: 7 }, new CellValue([1, 5, 7, 9])),
    new Cell({ row: 5, column: 8 }, new CellValue([6])),
    new Cell({ row: 5, column: 9 }, new CellValue([2, 3])),
    new Cell({ row: 6, column: 7 }, new CellValue([1, 5, 8, 9])),
    new Cell({ row: 6, column: 8 }, new CellValue([2, 8, 9])),
    new Cell({ row: 6, column: 9 }, new CellValue([2, 3, 8])),
  ]);

  const expected: CellValueChange[] = [
    { location: { row: 4, column: 7 }, valuesToRemove: [8] },
    { location: { row: 4, column: 8 }, valuesToRemove: [2, 8] },
    { location: { row: 6, column: 7 }, valuesToRemove: [8] },
    { location: { row: 6, column: 8 }, valuesToRemove: [2, 8] },
  ];

  expect(SolverHelpers.processNakedCellsInBlock(cc, ValueComboType.Triple)).toEqual(expected);
});

/**
 * See https://www.sudokuwiki.org/Naked_Candidates
 */
test('Naked Triple Solver - solve for a (123) (12) (23) row', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 5, column: 1 }, new CellValue([4, 5, 6, 7, 9])),
    new Cell({ row: 5, column: 2 }, new CellValue([2])),
    new Cell({ row: 5, column: 3 }, new CellValue([1, 5, 6, 7, 9])),
    new Cell({ row: 5, column: 4 }, new CellValue([5, 8, 9])),
    new Cell({ row: 5, column: 5 }, new CellValue([5, 8])),
    new Cell({ row: 5, column: 6 }, new CellValue([5, 9])),
    new Cell({ row: 5, column: 7 }, new CellValue([3, 5, 8, 9])),
    new Cell({ row: 5, column: 8 }, new CellValue([3, 4, 5, 8, 9])),
    new Cell({ row: 5, column: 9 }, new CellValue([1, 6])),
  ]);

  const expected: CellValueChange[] = [
    { location: { row: 5, column: 1 }, valuesToRemove: [5, 9] },
    { location: { row: 5, column: 3 }, valuesToRemove: [5, 9] },
    { location: { row: 5, column: 7 }, valuesToRemove: [5, 8, 9] },
    { location: { row: 5, column: 8 }, valuesToRemove: [5, 8, 9] },
  ];

  expect(SolverHelpers.processNakedCellsInBlock(cc, ValueComboType.Triple)).toEqual(expected);
});

test('Naked Triple Solver - solve for a (12) (23) (13) row', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 5, column: 1 }, new CellValue([4, 5, 6, 7, 9])),
    new Cell({ row: 5, column: 2 }, new CellValue([2])),
    new Cell({ row: 5, column: 3 }, new CellValue([1, 5, 6, 7, 9])),
    new Cell({ row: 5, column: 4 }, new CellValue([5, 8])),
    new Cell({ row: 5, column: 5 }, new CellValue([8, 9])),
    new Cell({ row: 5, column: 6 }, new CellValue([5, 9])),
    new Cell({ row: 5, column: 7 }, new CellValue([3, 5, 8, 9])),
    new Cell({ row: 5, column: 8 }, new CellValue([3, 4, 5, 8, 9])),
    new Cell({ row: 5, column: 9 }, new CellValue([1, 6])),
  ]);

  const expected: CellValueChange[] = [
    { location: { row: 5, column: 1 }, valuesToRemove: [5, 9] },
    { location: { row: 5, column: 3 }, valuesToRemove: [5, 9] },
    { location: { row: 5, column: 7 }, valuesToRemove: [5, 8, 9] },
    { location: { row: 5, column: 8 }, valuesToRemove: [5, 8, 9] },
  ];

  expect(SolverHelpers.processNakedCellsInBlock(cc, ValueComboType.Triple)).toEqual(expected);
});

test('Naked Triple Solver - fail for non-triple row 1', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 8, column: 1 }, new CellValue([2])),
    new Cell({ row: 8, column: 2 }, new CellValue([6, 8, 9])),
    new Cell({ row: 8, column: 3 }, new CellValue([5, 6, 7, 9])),
    new Cell({ row: 8, column: 4 }, new CellValue([1, 5, 7, 8])),
    new Cell({ row: 8, column: 5 }, new CellValue([1, 5, 8])),
    new Cell({ row: 8, column: 6 }, new CellValue([5, 7])),
    new Cell({ row: 8, column: 7 }, new CellValue([4])),
    new Cell({ row: 8, column: 8 }, new CellValue([5, 8, 9])),
    new Cell({ row: 8, column: 9 }, new CellValue([3])),
  ]);

  const expected: CellValueChange[] = [];

  expect(SolverHelpers.processNakedCellsInBlock(cc, ValueComboType.Triple)).toEqual(expected);
});
