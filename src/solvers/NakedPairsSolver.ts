import { Grid } from '../Grid';
import { CellValueChange, SudokuAllPossibleValues, ValueComboType } from '../ValueTypes';
import { SolverHelpers } from './SolverHelpers';

/**
 * Implements a Naked Pair solver strategy.
 * @see <a href="https://sudoku.org.uk/SolvingTechniques/NakedPairs.asp">Sudoku.org.uk</a>
 */
export class NakedPairsSolver {
  /**
   * The name of the solver to insert into change information.
   */
  static source: string = 'NakedPairsSolver';

  /**
   * Searches the values with a single potential and if it finds any, returns an
   * array of changes to apply to the target grid.
   * @param targetGrid The grid to solve.
   * @returns An array of changes to apply to the grid to solve it.
   */
  static solve(targetGrid: Grid): CellValueChange[] {
    const rv: CellValueChange[] = [];

    for (const rcb of SudokuAllPossibleValues) {
      rv.push(
        ...SolverHelpers.processNakedCellsInBlock(targetGrid.row(rcb), ValueComboType.Pair, NakedPairsSolver.source),
      );
      if (rv.length) break;
      rv.push(
        ...SolverHelpers.processNakedCellsInBlock(targetGrid.column(rcb), ValueComboType.Pair, NakedPairsSolver.source),
      );
      if (rv.length) break;
      rv.push(
        ...SolverHelpers.processNakedCellsInBlock(targetGrid.block(rcb), ValueComboType.Pair, NakedPairsSolver.source),
      );
      if (rv.length) break;
    }

    return rv;
  }
}
