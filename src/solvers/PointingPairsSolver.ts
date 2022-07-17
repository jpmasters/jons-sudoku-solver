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
    return SolverHelpers.solveBoxLineReductionForBlockAndRow(
      blockCells,
      rowOrColumnCells,
      'box',
      PointingPairsSolver.source,
    );
  }
}
