import { Grid } from '../Grid';
import { CellValueChange, SudokuAllPossibleValues, ValueComboType } from '../ValueTypes';
import { HiddenTriplesSolver } from './HiddenTriplesSolver';
import { SolverHelpers } from './SolverHelpers';

/**
 * Implements a Hidden Quad solver strategy.
 * @see <a href="https://sudoku.org.uk/SolvingTechniques/HiddenTriples.asp">Sudoku.org.uk</a>
 */
export class HiddenQuadsSolver {
  /**
   * The source of changes provided to callers.
   */
  static source: string = 'HiddenQuadsSolver';

  /**
   * Searches the Grid for hidden quads and if it finds any, returns an
   * array of changes to apply to the target grid.
   * @param targetGrid The grid to solve.
   * @returns An array of changes to apply to the grid to solve it.
   */
  static solve(targetGrid: Grid): CellValueChange[] {
    return SolverHelpers.solveHiddenMultiples(targetGrid, ValueComboType.Quad, HiddenTriplesSolver.source);
  }
}
