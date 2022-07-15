import { Grid } from '../Grid';
import { CellValueChange, SudokuAllPossibleValues, ValueComboType } from '../ValueTypes';
import { SolverHelpers } from './SolverHelpers';

/**
 * Implements a Naked Pair solver strategy.
 * @see <a href="https://sudoku.org.uk/SolvingTechniques/NakedPairs.asp">Sudoku.org.uk</a>
 */
export class NakedPairsSolver {
  /**
   * Searches the values with a single potential and if it finds any, returns an
   * array of changes to apply to the target grid.
   * @param targetGrid The grid to solve.
   * @returns An array of changes to apply to the grid to solve it.
   */
  static solve(targetGrid: Grid): CellValueChange[] {
    return [
      ...SudokuAllPossibleValues.map((row) =>
        SolverHelpers.processNakedCellsInBlock(targetGrid.row(row), ValueComboType.Pair),
      ).flat(),
      ...SudokuAllPossibleValues.map((column) =>
        SolverHelpers.processNakedCellsInBlock(targetGrid.column(column), ValueComboType.Pair),
      ).flat(),
      ...SudokuAllPossibleValues.map((block) =>
        SolverHelpers.processNakedCellsInBlock(targetGrid.block(block), ValueComboType.Pair),
      ).flat(),
    ];
  }
}
