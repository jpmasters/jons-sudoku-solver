import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { Grid } from '../Grid';
import { Helpers } from '../Helpers';
import { CellValueChange, SudokuPossibleValue } from '../ValueTypes';
import { SolverHelpers } from './SolverHelpers';

/**
 * Implements an pointing pairs solver strategy.
 * @see <a href="https://sudoku.org.uk/SolvingTechniques/IntersectionRemoval.asp">Sudoku.org.uk</a>
 */
export class PointingPairsSolver {
  /**
   * The name of the solver to insert into change information.
   */
  static source: string = 'PointingPairsSolver';

  /**
   * Searches the grid for instances of Pointing Pairs and if it finds any, returns an
   * array of changes to apply to the target grid.
   * @param targetGrid The grid to solve.
   * @returns An array of changes to apply to the grid to solve it.
   */
  static solve(targetGrid: Grid): CellValueChange[] {
    return SolverHelpers.solveBoxLineReduction(targetGrid, PointingPairsSolver.solveForBlockAndRow);
  }

  /**
   * Solves for pointing pairs in the provided block and row.
   * @param blockCells The cells in the nonet block to check for candidates.
   * @param rowOrColumnCells The cells in the row or column to check for candidates.
   * @returns An array of CellValueChanges to apply to the grid.
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

    // find block cells outside the block / row intersection
    const outsideBlockCells: Cell[] = blockCells.cells.filter((rcCell) => {
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
        return !outsideBlockCells
          .map((c) => c.potentialValues)
          .flat()
          .includes(v);
      });

    // find row / column cells outside the block / row intersection
    const changes: CellValueChange[] = rowOrColumnCells.cells
      .filter((rcCell) => {
        return !intersectingBlockCells.some((c) => Helpers.locationsMatch(c.location, rcCell.location));
      })
      // create a corresponding change record
      .map<CellValueChange>((cell) => {
        return {
          source: PointingPairsSolver.source,
          location: { ...cell.location },
          valuesToRemove: valuesToRemove.filter((v) => cell.potentialValues.includes(v)),
        };
      })
      // filter out anything where there is no change to make
      .filter((cvc) => cvc.valuesToRemove.length);

    return changes;
  }
}
