import { Grid } from '../Grid';
import { easyTestPuzzle2 } from './puzzles.test';
import { IntersectingCells } from '../IntersectingCells';
import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';

test('Can create an IntersectingCells object from a Grid', () => {
  const grid = Grid.fromGrid(easyTestPuzzle2);
  const intersectingCells: IntersectingCells = IntersectingCells.fromGridLocation(grid, { column: 5, row: 7 });

  expect(intersectingCells).toBeInstanceOf(IntersectingCells);
  expect(intersectingCells.cells.length).toBe(21);
});

test('removePotentials works', () => {
  const cc = IntersectingCells.fromCellCollection(
    new CellCollection([
      new Cell({ column: 5, row: 5 }, [4, 5, 6]),
      new Cell({ column: 6, row: 5 }, [7, 8, 9]),
      new Cell({ column: 7, row: 5 }, [1, 2, 3]),
      new Cell({ column: 8, row: 5 }, [1, 4, 8]),
      new Cell({ column: 9, row: 5 }, [2, 3, 4]),
    ]),
  );

  const dd = cc.removePotentials({ column: 7, row: 5 }, [2, 3]);

  // check the one we want to alter has changed
  expect(dd.cellAtLocation({ column: 7, row: 5 }).potentialValues).toEqual([1]);

  // check the one we don't want to alter hasn't changed
  expect(dd.cellAtLocation({ column: 9, row: 5 }).potentialValues).toEqual([2, 3, 4]);

  // check location validation works
  expect(() => {
    cc.removePotentials({ column: 1, row: 1 }, [1, 2, 3]);
  }).toThrowError();
});
