import { Grid } from '../Grid';
import { CellValueChange, SudokuAllPossibleValues, ValueComboType } from '../ValueTypes';
import { SolverHelpers } from './SolverHelpers';

/**
 * Implements a Naked Triple solver strategy.
 * @see <a href="https://sudoku.org.uk/SolvingTechniques/NakedTriples.asp">Sudoku.org.uk</a>
 */
export class NakedTriplesSolver {
  /**
   * The name of the solver to insert into change information.
   */
  static source: string = 'NakedTriplesSolver';

  /**
   * Searches the grid for Naked Triples and if it finds any, returns an
   * array of changes to apply to the target grid.
   * @param targetGrid The grid to solve.
   * @returns An array of changes to apply to the grid to solve it.
   */
  static solve(targetGrid: Grid): CellValueChange[] {
    return SolverHelpers.solveNakedMultiples(targetGrid, ValueComboType.Triple, NakedTriplesSolver.source);
  }
}
