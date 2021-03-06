import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { PointingPairsSolver } from '../solvers/PointingPairsSolver';
import { CellValueChange } from '../ValueTypes';

test('Pointing Pairs found in a row', () => {
  const block: CellCollection = new CellCollection([
    new Cell({ row: 7, column: 7 }, [9]),
    new Cell({ row: 7, column: 8 }, [1]),
    new Cell({ row: 7, column: 9 }, [3, 4, 8]),
    new Cell({ row: 8, column: 7 }, [2, 4, 6, 7, 8]),
    new Cell({ row: 8, column: 8 }, [2, 5, 6, 7, 8]),
    new Cell({ row: 8, column: 9 }, [4, 7, 8]),
    new Cell({ row: 9, column: 7 }, [2, 4, 7, 8]),
    new Cell({ row: 9, column: 8 }, [2, 3, 5, 7, 8]),
    new Cell({ row: 9, column: 9 }, [3, 4, 7, 8]),
  ]);

  const row: CellCollection = new CellCollection([
    new Cell({ row: 8, column: 1 }, [9]),
    new Cell({ row: 8, column: 2 }, [1, 4, 5, 8]),
    new Cell({ row: 8, column: 3 }, [1, 2, 8]),
    new Cell({ row: 8, column: 4 }, [3]),
    new Cell({ row: 8, column: 5 }, [2, 4, 6, 7, 8]),
    new Cell({ row: 8, column: 6 }, [4, 5, 6]),
    new Cell({ row: 8, column: 7 }, [2, 4, 6, 7, 8]),
    new Cell({ row: 8, column: 8 }, [2, 5, 6, 7, 8]),
    new Cell({ row: 8, column: 9 }, [4, 7, 8]),
  ]);

  const expected: CellValueChange[] = [
    { source: 'PointingPairsSolver', location: { row: 8, column: 5 }, valuesToRemove: [6] },
    { source: 'PointingPairsSolver', location: { row: 8, column: 6 }, valuesToRemove: [6] },
  ];

  const diffs = PointingPairsSolver.solveForBlockAndRow(block, row);
  expect(diffs).toEqual(expected);
});

test('Pointing Pairs found in a column', () => {
  const block: CellCollection = new CellCollection([
    new Cell({ row: 4, column: 4 }, [9, 6]),
    new Cell({ row: 4, column: 5 }, [1]),
    new Cell({ row: 4, column: 6 }, [3, 4, 8]),
    new Cell({ row: 5, column: 4 }, [2, 4, 7, 8]),
    new Cell({ row: 5, column: 5 }, [2, 5, 7, 8]),
    new Cell({ row: 5, column: 6 }, [4, 7, 8]),
    new Cell({ row: 6, column: 4 }, [2, 6, 8]),
    new Cell({ row: 6, column: 5 }, [9]),
    new Cell({ row: 6, column: 6 }, [3, 4, 7, 8]),
  ]);

  const column: CellCollection = new CellCollection([
    new Cell({ row: 1, column: 4 }, [9]),
    new Cell({ row: 2, column: 4 }, [1, 6, 5, 8]),
    new Cell({ row: 3, column: 4 }, [1, 2, 8]),
    new Cell({ row: 4, column: 4 }, [9, 6]),
    new Cell({ row: 5, column: 4 }, [2, 4, 7, 8]),
    new Cell({ row: 6, column: 4 }, [2, 6, 8]),
    new Cell({ row: 7, column: 4 }, [2, 4, 7, 8]),
    new Cell({ row: 8, column: 4 }, [2, 6, 7, 8]),
    new Cell({ row: 9, column: 4 }, [2, 4, 8]),
  ]);

  const expected: CellValueChange[] = [
    { source: 'PointingPairsSolver', location: { row: 2, column: 4 }, valuesToRemove: [6] },
    { source: 'PointingPairsSolver', location: { row: 8, column: 4 }, valuesToRemove: [6] },
  ];

  const diffs = PointingPairsSolver.solveForBlockAndRow(block, column);
  expect(diffs).toEqual(expected);
});

test('Pointing Pairs works in sudoku.org.uk example', () => {
  const block: CellCollection = new CellCollection([
    new Cell({ row: 7, column: 4 }, [3, 4, 8, 9]),
    new Cell({ row: 7, column: 5 }, [4, 8, 9]),
    new Cell({ row: 7, column: 6 }, [3, 9]),
    new Cell({ row: 8, column: 4 }, [6]),
    new Cell({ row: 8, column: 5 }, [1]),
    new Cell({ row: 8, column: 6 }, [2]),
    new Cell({ row: 9, column: 4 }, [7]),
    new Cell({ row: 9, column: 5 }, [4, 9]),
    new Cell({ row: 9, column: 6 }, [5]),
  ]);

  const row: CellCollection = new CellCollection([
    new Cell({ row: 7, column: 1 }, [2, 3, 4, 5, 6]),
    new Cell({ row: 7, column: 2 }, [1]),
    new Cell({ row: 7, column: 3 }, [2, 4, 6]),
    new Cell({ row: 7, column: 4 }, [3, 4, 8, 9]),
    new Cell({ row: 7, column: 5 }, [4, 8, 9]),
    new Cell({ row: 7, column: 6 }, [3, 9]),
    new Cell({ row: 7, column: 7 }, [3, 7, 9]),
    new Cell({ row: 7, column: 8 }, [3, 5, 7, 9]),
    new Cell({ row: 7, column: 9 }, [2, 3, 5, 7]),
  ]);

  const expected: CellValueChange[] = [
    { source: 'PointingPairsSolver', location: { row: 7, column: 1 }, valuesToRemove: [3] },
    { source: 'PointingPairsSolver', location: { row: 7, column: 7 }, valuesToRemove: [3] },
    { source: 'PointingPairsSolver', location: { row: 7, column: 8 }, valuesToRemove: [3] },
    { source: 'PointingPairsSolver', location: { row: 7, column: 9 }, valuesToRemove: [3] },
  ];

  const diffs = PointingPairsSolver.solveForBlockAndRow(block, row);
  expect(diffs).toEqual(expected);
});
