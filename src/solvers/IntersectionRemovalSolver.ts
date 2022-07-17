import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { Grid } from '../Grid';
import { Helpers } from '../Helpers';
import { CellValueChange, SudokuPossibleValue } from '../ValueTypes';
import { SolverHelpers } from './SolverHelpers';

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
    return SolverHelpers.solveBoxLineReduction(targetGrid, IntersectionRemovalSolver.solveForBlockAndRow);
  }

  /**
   * Implements the Intersection Removal solver for a given block and row / column.
   * @param blockCells The block of cells we're checking for intersections.
   * @param rowOrColumnCells The row or column we're checking for intersections.
   * @returns An array of CellValueChange objects describing the changes to apply to targetGrid.
   */
  static solveForBlockAndRow(blockCells: CellCollection, rowOrColumnCells: CellCollection): CellValueChange[] {
    return SolverHelpers.solveBoxLineReductionForBlockAndRow(
      blockCells,
      rowOrColumnCells,
      'line',
      IntersectionRemovalSolver.source,
    );
  }
}
