import { CellValueChange, Grid } from './Grid';
import { CollapsedValueSolver } from './solvers/CollapsedValuesSolver';
import { HiddenPairsSolver } from './solvers/HiddenPairsSolver';
import { ObviousPairsSolver } from './solvers/ObviousPairsSolver';
import { SingleValuesSolver } from './solvers/SingleValuesSolver';
import { SolverHelpers } from './solvers/SolverHelpers';

/**
 * Implements a class that can solve a 9x9 Sudoku provided as a number[9][9].
 */
export class SudokuSolver {
  /**
   * Solves the given 9x9 Sudoku grid.
   * TODO: Needs a better way to handle puzzles it can't solve (than return incomplete solution)
   * TODO: Add a callback method of some kind to allow the user to monitor the grids and changes at each iteration.
   * @param puzzle A puzzle defined a as a 2D array of numbers with zeros representing unknown values.
   * @returns A solved puzzle defined as a 2D array of numbers.
   */
  static solve(puzzle: number[][]): number[][] {
    // make sure we have a valid grid as this is an external interface method.
    if (puzzle.length !== 9) throw new Error('Grid must contain 9 rows.');
    if (puzzle.filter((column) => column.length !== 9).length) throw new Error('Grid must contain 9 columns.');
    if (puzzle.flat().filter((val) => val < 0 || val > 9).length)
      throw new Error('Grid must contain values between 0 and 9 where 0 is an unknown value.');
    if (puzzle.flat().filter((val) => val !== 0).length === 0) throw new Error('Grid must have some initial values.');

    // the targetGrid holds our work in progress
    let targetGrid: Grid = Grid.fromGrid(puzzle);

    // this change list is a list of changes we want to make
    // to the Grid in the iteration
    const changes: CellValueChange[] = [];

    do {
      // clear out the previous changes
      changes.length = 0;

      if (!changes.length) {
        changes.push(...CollapsedValueSolver.solve(targetGrid));
      }

      if (!changes.length) {
        changes.push(...SingleValuesSolver.solve(targetGrid));
      }

      if (!changes.length) {
        changes.push(...ObviousPairsSolver.solve(targetGrid));
      }

      if (!changes.length) {
        changes.push(...HiddenPairsSolver.solve(targetGrid));
      }

      // apply them to the target grid
      targetGrid = SolverHelpers.applyChangeList(targetGrid, changes);
    } while (changes.length || !targetGrid.isSolved);

    // convert it into something we can return
    return targetGrid.toPuzzleArray();
  }
}
