import { Grid } from '../Grid';
import { CellValueChange, SudokuAllPossibleValues, ValueComboType } from '../ValueTypes';
import { SolverHelpers } from './SolverHelpers';

/**
 * Implements a Naked Triple solver strategy.
 * @see <a href="https://sudoku.org.uk/SolvingTechniques/NakedTriples.asp">Sudoku.org.uk</a>
 */
export class NakedTriplesSolver {
  /**
   * Searches the grid for Naked Triples and if it finds any, returns an
   * array of changes to apply to the target grid.
   * @param targetGrid The grid to solve.
   * @returns An array of changes to apply to the grid to solve it.
   */
  static solve(targetGrid: Grid): CellValueChange[] {
    return [
      ...SudokuAllPossibleValues.map((row) =>
        SolverHelpers.processNakedCellsInBlock(targetGrid.row(row), ValueComboType.Triple),
      ).flat(),
      ...SudokuAllPossibleValues.map((column) =>
        SolverHelpers.processNakedCellsInBlock(targetGrid.column(column), ValueComboType.Triple),
      ).flat(),
      ...SudokuAllPossibleValues.map((block) =>
        SolverHelpers.processNakedCellsInBlock(targetGrid.block(block), ValueComboType.Triple),
      ).flat(),
    ];
  }
}
