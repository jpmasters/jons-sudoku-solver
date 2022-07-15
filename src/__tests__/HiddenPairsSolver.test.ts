import { CellCollection } from '../CellCollection';
import { Cell } from '../Cell';
import { SolverHelpers } from '../solvers/SolverHelpers';
import { CellValueChange, ValueComboType } from '../ValueTypes';

test('findHiddenPairs works', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 1, column: 3 }, [1, 3]),
    new Cell({ row: 2, column: 3 }, [3, 6, 8, 9]),
    new Cell({ row: 3, column: 3 }, [1, 3, 6, 8, 9]),
    new Cell({ row: 4, column: 3 }, [7]),
    new Cell({ row: 5, column: 3 }, [4]),
    new Cell({ row: 6, column: 3 }, [5]),
    new Cell({ row: 7, column: 3 }, [2, 3, 8]),
    new Cell({ row: 8, column: 3 }, [1, 2, 8]),
    new Cell({ row: 9, column: 3 }, [2, 3, 8]),
  ]);

  const expected: CellValueChange[] = [
    {
      location: { row: 2, column: 3 },
      valuesToRemove: [3, 8],
    },
    {
      location: { row: 3, column: 3 },
      valuesToRemove: [1, 3, 8],
    },
  ];

  const diffs = SolverHelpers.processHiddenCellsInBlock(cc, ValueComboType.Pair);
  expect(diffs).toEqual(expected);
});

test('findHiddenPairs only selects pairs in the same cell!', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 1, column: 1 }, [1, 3, 4]),
    new Cell({ row: 1, column: 2 }, [2]),
    new Cell({ row: 1, column: 3 }, [1, 3]),
    new Cell({ row: 1, column: 4 }, [6]),
    new Cell({ row: 1, column: 5 }, [5]),
    new Cell({ row: 1, column: 6 }, [8]),
    new Cell({ row: 1, column: 7 }, [1, 4, 7]),
    new Cell({ row: 1, column: 8 }, [3, 7]),
    new Cell({ row: 1, column: 9 }, [9]),
  ]);

  // should return nothing as their are no hidden pairs
  const expected: CellValueChange[] = [];

  const diffs = SolverHelpers.processHiddenCellsInBlock(cc, ValueComboType.Pair);
  expect(diffs).toEqual(expected);
});

test('findHiddenPairs works when there are multiple cells with 2 values', () => {
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

  // should return nothing as their are no hidden pairs
  const expected: CellValueChange[] = [];

  const diffs = SolverHelpers.processHiddenCellsInBlock(cc, ValueComboType.Pair);
  expect(diffs).toEqual(expected);
});

test('findHiddenPairs works when there are multiple pairs in the block but noting to remove', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 4, column: 1 }, [2, 4]),
    new Cell({ row: 4, column: 2 }, [9]),
    new Cell({ row: 4, column: 3 }, [6]),
    new Cell({ row: 4, column: 4 }, [1, 7]),
    new Cell({ row: 4, column: 5 }, [5]),
    new Cell({ row: 4, column: 6 }, [1, 7]),
    new Cell({ row: 4, column: 7 }, [2, 4]),
    new Cell({ row: 4, column: 8 }, [3]),
    new Cell({ row: 4, column: 9 }, [8]),
  ]);

  // should return nothing as their are no hidden pairs
  const expected: CellValueChange[] = [];

  const diffs = SolverHelpers.processHiddenCellsInBlock(cc, ValueComboType.Pair);
  expect(diffs).toEqual(expected);
});
