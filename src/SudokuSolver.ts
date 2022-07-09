import { CellValueChange, Grid } from './Grid';
import { BacktrackingSolver } from './solvers/BacktrackingSolver';
import { CollapsedValueSolver } from './solvers/CollapsedValuesSolver';
import { HiddenPairsSolver } from './solvers/HiddenPairsSolver';
import { ObviousPairsSolver } from './solvers/ObviousPairsSolver';
import { PointingPairsSolver } from './solvers/PointingPairsSolver';
import { SingleValuesSolver } from './solvers/SingleValuesSolver';
import { SolverHelpers } from './solvers/SolverHelpers';
import { SolverList } from './solvers/SolverList';
import { deriveOptions, SudokuSolverOptions, SudokuSolverStrategy } from './SudokuSolverOptions';

/**
 * Implements a class that can solve a 9x9 Sudoku provided as a number[9][9].
 */
export class SudokuSolver {
  /**
   * Solves the given 9x9 Sudoku grid.
   * TODO: Add a callback method of some kind to allow the user to monitor the grids and changes at each iteration.
   * @param puzzle A puzzle defined a as a 2D array of numbers with zeros representing unknown values.
   * @param options Optional parameter allowing the caller to specify what strategies to use whne solving the puzzle.
   * @returns A solved puzzle defined as a 2D array of numbers.
   */
  static solve(puzzle: number[][], options: SudokuSolverOptions = {}): number[][] {
    // make sure we have a valid grid as this is an external interface method.
    if (puzzle.length !== 9) throw new Error('Grid must contain 9 rows.');
    if (puzzle.filter((column) => column.length !== 9).length) throw new Error('Grid must contain 9 columns.');
    if (puzzle.flat().filter((val) => val < 0 || val > 9).length)
      throw new Error('Grid must contain values between 0 and 9 where 0 is an unknown value.');
    if (puzzle.flat().filter((val) => val !== 0).length === 0) throw new Error('Grid must have some initial values.');

    // the targetGrid holds our work in progress
    let targetGrid: Grid = Grid.fromGrid(puzzle);

    // expand the provided options
    options = deriveOptions(options);

    // this change list is a list of changes we want to make
    // to the Grid in the iteration
    const changes: CellValueChange[] = [];

    // start with optimisation strategies
    do {
      // clear out the previous changes
      changes.length = 0;

      // solve using the solvers included in the options
      SolverList.solvers
        .filter((solverEntry) => options.includeStrategies?.includes(solverEntry.strategy))
        .sort((a, b) => a.order - b.order)
        .forEach((solverEntry) => {
          if (!changes.length) {
            changes.push(...solverEntry.solve(targetGrid));
          }
        });

      // apply them to the target grid
      targetGrid = SolverHelpers.applyChangeList(targetGrid, changes);
    } while (changes.length && !targetGrid.isSolved);

    // if there's anything left to do, use backtracking
    if (!targetGrid.isSolved && options.includeBacktracking) {
      targetGrid = SolverHelpers.applyChangeList(targetGrid, [...BacktrackingSolver.solve(targetGrid)]);
    }

    // convert it into something we can return
    return targetGrid.toPuzzleArray();
  }
}
