import { Grid, GridDifference } from './Grid';
import { IntersectingCells } from './IntersectingCells';

/**
 * Defines the result of applying changes to a Grid.
 */
export interface ChangeResult {
  grid: Grid;
  changes: GridDifference[];
}

export class SolverHelpers {
  /**
   * Applies a list of changes to a Grid and returns a new grid with the results.
   * @param grid A reference to a Grid to apply the changes to.
   * @param changes A list of cxhanges to apply to the Grid.
   * @returns An object holding the new grid.
   */
  static applyChangeList(grid: Grid, changes: GridDifference[]): ChangeResult {
    const gridCopy: Grid = Grid.fromCellCollection(grid);

    changes.forEach((change) => {
      let i = IntersectingCells.fromGridLocation(grid, change.location);
      i = IntersectingCells.fromCellCollection(i.setValue(change.location, change.value));
      grid = Grid.fromCellCollection(grid.mergedWith(i));
    });

    return {
      grid,
      changes: grid
        .differences(gridCopy)
        .filter(
          (diff) =>
            changes.findIndex(
              (diff2) => diff.location.row === diff2.location.row && diff.location.column === diff2.location.column,
            ) === -1,
        ),
    };
  }
}
