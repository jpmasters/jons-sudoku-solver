import { Grid } from '../Grid';
import { CellValueChange, SudokuAllPossibleValues, ValueComboType } from '../ValueTypes';
import { SolverHelpers } from './SolverHelpers';

/**
 * Implements a Hidden Triple solver strategy.
 * @see <a href="https://sudoku.org.uk/SolvingTechniques/HiddenTriples.asp">Sudoku.org.uk</a>
 */
export class HiddenTriplesSolver {
  /**
   * The source of changes provided to callers.
   */
  static source: string = 'HiddenTriplesSolver';

  /**
   * Searches the Grid for hidden triples and if it finds any, returns an
   * array of changes to apply to the target grid.
   * @param targetGrid The grid to solve.
   * @returns An array of changes to apply to the grid to solve it.
   */
  static solve(targetGrid: Grid): CellValueChange[] {
    return SolverHelpers.solveHiddenMultiples(targetGrid, ValueComboType.Triple, HiddenTriplesSolver.source);
  }
}
