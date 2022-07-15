import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { CellValueChange, ValueComboType } from '../ValueTypes';
import { SolverHelpers } from '../solvers/SolverHelpers';

test('findObviousPairs works', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 1, column: 1 }, [1, 3, 4]),
    new Cell({ row: 1, column: 2 }, [2]),
    new Cell({ row: 1, column: 3 }, [1, 3]),
    new Cell({ row: 2, column: 1 }, [7]),
    new Cell({ row: 2, column: 2 }, [3, 4, 6, 8]),
    new Cell({ row: 2, column: 3 }, [6, 9]),
    new Cell({ row: 3, column: 1 }, [5]),
    new Cell({ row: 3, column: 2 }, [1, 3, 4, 6, 8]),
    new Cell({ row: 3, column: 3 }, [6, 9]),
  ]);

  const expected: CellValueChange[] = [
    {
      location: { row: 2, column: 2 },
      valuesToRemove: [6],
    },
    {
      location: { row: 3, column: 2 },
      valuesToRemove: [6],
    },
  ];

  const diffs = SolverHelpers.processNakedCellsInBlock(cc, ValueComboType.Pair);
  expect(diffs).toEqual(expected);
});

test('findObviousPairs pairs must match values', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 4, column: 1 }, [1, 8]),
    new Cell({ row: 4, column: 2 }, [1, 6, 8]),
    new Cell({ row: 4, column: 3 }, [7]),
    new Cell({ row: 4, column: 4 }, [8, 9]),
    new Cell({ row: 4, column: 5 }, [6, 8, 9]),
    new Cell({ row: 4, column: 6 }, [2]),
    new Cell({ row: 4, column: 7 }, [3]),
    new Cell({ row: 4, column: 8 }, [4]),
    new Cell({ row: 4, column: 9 }, [5]),
  ]);

  const expected: CellValueChange[] = [];

  const diffs = SolverHelpers.processNakedCellsInBlock(cc, ValueComboType.Pair);
  expect(diffs).toEqual(expected);
});

test('findObviousPairs find multiple pairs', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 4, column: 1 }, [1, 8]),
    new Cell({ row: 4, column: 2 }, [2, 4]),
    new Cell({ row: 4, column: 3 }, [7, 4]),
    new Cell({ row: 4, column: 4 }, [8, 9]),
    new Cell({ row: 4, column: 5 }, [6]),
    new Cell({ row: 4, column: 6 }, [2, 4]),
    new Cell({ row: 4, column: 7 }, [3, 1]),
    new Cell({ row: 4, column: 8 }, [1, 8]),
    new Cell({ row: 4, column: 9 }, [5]),
  ]);

  const expected: CellValueChange[] = [
    {
      location: { row: 4, column: 3 },
      valuesToRemove: [4],
    },
    {
      location: { row: 4, column: 4 },
      valuesToRemove: [8],
    },
    {
      location: { row: 4, column: 7 },
      valuesToRemove: [1],
    },
  ];

  const diffs = SolverHelpers.processNakedCellsInBlock(cc, ValueComboType.Pair);
  expect(diffs).toEqual(expected);
});

test('solve naked pairs works for sudoku.org.uk examples', () => {
  const row_8: CellCollection = new CellCollection([
    new Cell({ row: 8, column: 1 }, [1, 4]),
    new Cell({ row: 8, column: 2 }, [8]),
    new Cell({ row: 8, column: 3 }, [1, 4]),
    new Cell({ row: 8, column: 4 }, [9]),
    new Cell({ row: 8, column: 5 }, [3]),
    new Cell({ row: 8, column: 6 }, [6]),
    new Cell({ row: 8, column: 7 }, [1, 2, 4, 7]),
    new Cell({ row: 8, column: 8 }, [5]),
    new Cell({ row: 8, column: 9 }, [2, 4, 7]),
  ]);

  const block_7: CellCollection = new CellCollection([
    new Cell({ row: 7, column: 1 }, [7]),
    new Cell({ row: 7, column: 2 }, [2]),
    new Cell({ row: 7, column: 3 }, [1, 5, 6]),
    new Cell({ row: 8, column: 1 }, [1, 4]),
    new Cell({ row: 8, column: 2 }, [8]),
    new Cell({ row: 8, column: 3 }, [1, 4]),
    new Cell({ row: 9, column: 1 }, [1, 3, 4]),
    new Cell({ row: 9, column: 2 }, [1, 3, 6, 9]),
    new Cell({ row: 9, column: 3 }, [1, 3, 4, 5, 6, 9]),
  ]);

  const expected_row_8: CellValueChange[] = [
    {
      location: { row: 8, column: 7 },
      valuesToRemove: [1, 4],
    },
    {
      location: { row: 8, column: 9 },
      valuesToRemove: [4],
    },
  ];

  const expected_block_7: CellValueChange[] = [
    {
      location: { row: 7, column: 3 },
      valuesToRemove: [1],
    },
    {
      location: { row: 9, column: 1 },
      valuesToRemove: [1, 4],
    },
    {
      location: { row: 9, column: 2 },
      valuesToRemove: [1],
    },
    {
      location: { row: 9, column: 3 },
      valuesToRemove: [1, 4],
    },
  ];

  expect(SolverHelpers.processNakedCellsInBlock(row_8, ValueComboType.Pair)).toEqual(expected_row_8);
  expect(SolverHelpers.processNakedCellsInBlock(block_7, ValueComboType.Pair)).toEqual(expected_block_7);
});
