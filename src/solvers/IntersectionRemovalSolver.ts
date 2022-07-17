import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { Grid } from '../Grid';
import { Helpers } from '../Helpers';
import { CellValueChange, SudokuAllPossibleValues, SudokuPossibleValue } from '../ValueTypes';

/**
 * Implements an intersection removal solver strategy.
 * @see <a href="https://sudoku.org.uk/SolvingTechniques/IntersectionRemoval.asp">Sudoku.org.uk</a>
 */
export class IntersectionRemovalSolver {
  /**
   * The name of the solver to insert into change information.
   */
  static source: string = 'IntersectionRemovalSolver';

  /**
   * Searches the grid provided for intersecting blocks, rows and columns
   * where potential removals can take place. Returns an array of CellValueChange
   * objects to make the required changes.
   * array of changes to apply to the target grid.
   * @param targetGrid The grid to solve.
   * @returns An array of changes to apply to the grid to solve it.
   */
  static solve(targetGrid: Grid): CellValueChange[] {
    const rv: CellValueChange[] = [];
    SudokuAllPossibleValues.map((b) => targetGrid.block(b)).some((block) => {
      ['row', 'column'].some((rc) => {
        const rowOrColumn: 'row' | 'column' = rc as 'row' | 'column';
        block.cells
          .filter((cell, i, arr) => {
            return arr.findIndex((c) => cell.location[rowOrColumn] === c.location[rowOrColumn]) === i;
          })
          .some((cell) => {
            const changes = IntersectionRemovalSolver.solveForBlockAndRow(
              block,
              targetGrid.row(cell.location[rowOrColumn]),
            );
            rv.push(...changes);

            // exit early if we have something to return
            return rv.length;
          });

        // exit early if we have something to return
        return rv.length;
      });

      // exit early if we have something to return
      return rv.length;
    });

    return rv;
  }

  /**
   * Implements the Intersection Removal solver for a given block and row / column.
   * @param blockCells The block of cells we're checking for intersections.
   * @param rowOrColumnCells The row or column we're checking for intersections.
   * @returns An array of CellValueChange objects describing the changes to apply to targetGrid.
   */
  static solveForBlockAndRow(blockCells: CellCollection, rowOrColumnCells: CellCollection): CellValueChange[] {
    const isRow: boolean = rowOrColumnCells.cells.every((c, _, a) => c.location.row === a[0].location.row);
    const rowOrColumnNumber = isRow
      ? rowOrColumnCells.cells[0].location.row
      : rowOrColumnCells.cells[0].location.column;

    // find the relevant block cells
    const intersectingBlockCells: Cell[] = blockCells.cells.filter((c) =>
      isRow ? c.location.row === rowOrColumnNumber : c.location.column === rowOrColumnNumber,
    );

    // find row / column cells outside the block / row intersection
    const outsideRowCells: Cell[] = rowOrColumnCells.cells.filter((rcCell) => {
      return !intersectingBlockCells.some((c) => Helpers.locationsMatch(c.location, rcCell.location));
    });

    const valuesToRemove = intersectingBlockCells
      .map<SudokuPossibleValue[]>((c) => c.potentialValues)
      .flat()
      // we're looking for >1 instance of a value
      .filter((v, i, a) => a.findIndex((v2) => v === v2) !== i)
      // now de-duplicate the result
      .filter((v, i, a) => a.indexOf(v) === i)
      .sort((a, b) => a - b)

      // if the valuesToRemove appear in the row or column but outside of the
      // block and only appear in the part of the block that intersects the
      // row or column then they can be removed from the row or column

      // not interested in any valuesToRemove that appear in outsideRowCells
      .filter((v) => {
        return !outsideRowCells
          .map((c) => c.potentialValues)
          .flat()
          .includes(v);
      });

    // find row / column cells outside the block / row intersection
    const changes: CellValueChange[] = blockCells.cells
      .filter((rcCell) => {
        return !intersectingBlockCells.some((c) => Helpers.locationsMatch(c.location, rcCell.location));
      })
      // create a corresponding change record
      .map<CellValueChange>((cell) => {
        return {
          source: IntersectionRemovalSolver.source,
          location: { ...cell.location },
          valuesToRemove: valuesToRemove.filter((v) => cell.potentialValues.includes(v)),
        };
      })
      // filter out anything where there is no change to make
      .filter((cvc) => cvc.valuesToRemove.length);

    return changes;
  }
}
