import { Cell } from '../Cell';
import { Grid } from '../Grid';
import { Helpers } from '../Helpers';
import { IntersectingCells } from '../IntersectingCells';
import { CellValueChange } from '../ValueTypes';

export class NakedSinglesSolver {
  /**
   * Searches the grid for values with a single potential and if it finds any, returns an
   * array of changes to apply to the target grid.
   * @param targetGrid The grid to solve.
   * @returns An array of changes to apply to the grid to solve it.
   */
  static solve(targetGrid: Grid): CellValueChange[] {
    const rv: CellValueChange[] = [];
    const cellsWithKnownValues = targetGrid.cells.filter((cell) => cell.hasKnownValue);

    for (const nextKnownCell of cellsWithKnownValues) {
      rv.push(...NakedSinglesSolver.solveForCell(targetGrid, nextKnownCell));
      if (rv.length) break;
    }

    return rv;
  }

  /**
   * Given a known cell, it finds all other cells intersecting it that need the potential value
   * removed. It then returns an array of objects to remove the potential to other cells in the
   * block.
   * @param targetGrid The grid holding the puzzle to work with.
   * @param cell The known cell to use for potential removal.
   * @returns An array of changes to other cells in the grid.
   */
  static solveForCell(targetGrid: Grid, cell: Cell): CellValueChange[] {
    const rv: CellValueChange[] = [];
    const intersectingBlocks = IntersectingCells.fromGridLocation(targetGrid, cell.location);

    rv.push(
      ...intersectingBlocks.cells
        .filter((bc) => !Helpers.locationsMatch(bc.location, cell.location) && bc.potentialValues.includes(cell.value))
        .map<CellValueChange>((bc) => {
          return {
            source: 'NakedSinglesSolver',
            location: { ...bc.location },
            valuesToRemove: [cell.value],
          };
        }),
    );

    return rv;
  }
}
