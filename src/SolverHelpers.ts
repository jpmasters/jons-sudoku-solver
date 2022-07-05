import { Grid, GridDifference } from './Grid';
import { Cell } from './Cell';
import { CellCollection } from './CellCollection';

/**
 * Defines the result of applying changes to a Grid.
 */
export interface ChangeResult {
  grid: Grid;
  changes: GridDifference[];
}
/**
 * Implements a class that provides helper methods for solving puzzles.
 */
export class SolverHelpers {
  /**
   * Applies a list of changes to a Grid and returns a new grid with the results.
   * @param grid A reference to a Grid to apply the changes to.
   * @param changes A list of cxhanges to apply to the Grid.
   * @returns An object holding the new grid.
   */
  static applyChangeList(grid: Grid, changes: GridDifference[]): Grid {
    changes.forEach((change) => {
      const newCellValue = grid.cellAtLocation(change.location).value.removePotentials(change.valuesToRemove);
      const newCell = new Cell({ ...change.location }, newCellValue);

      grid = Grid.fromCellCollection(grid.mergedWith(new CellCollection([newCell])));
    });

    return grid;
  }
}
