import { Cell } from '../Cell';
import { Grid, CellValueChange } from '../Grid';
import { IntersectingCells } from '../IntersectingCells';
import { GridLocation, SudokuAllPossibleValues, SudokuPossibleValue } from '../ValueTypes';
import { SolverHelpers } from './SolverHelpers';

export class BacktrackingSolver {
  /**
   * Completes the grid using a backtracking algorithm but is optimised to only select
   * values that appear in the CelValue potentials. It will always work but is a very inefficient
   * and non-human way to do things. if you're writing a Sudoku puzzle game and want to be able to
   * provide players with hints etc, this method probably isn't the one you'd choose.
   * @param targetGrid The grid to solve.
   * @returns An empty array as Backtracking completes itself.
   */
  static solve(targetGrid: Grid): CellValueChange[] {
    const rv: CellValueChange[] = [];

    BacktrackingSolver.doBackTracking(targetGrid, (grid) => {
      rv.splice(0, rv.length, ...grid.differences(targetGrid));
    });
    return rv;
  }

  /**
   * Performs the backtracking recursion.
   * @param grid A reference to a new copy of the grid (this is why everything is immutable!)
   * @returns A value indicating whether the grid id still valid.
   */
  static doBackTracking(grid: Grid, completed: (grid: Grid) => void, depth: number = 0): boolean {
    // find the first empty cell in the grid
    const emptyCells: Cell[] = grid.cells.filter((cell) => !cell.value.hasKnownValue);

    for (let cell of emptyCells) {
      for (let valueToTry of [...cell.value.potentialValues] /*SudokuAllPossibleValues*/) {
        if (BacktrackingSolver.isValidPlacement(grid, valueToTry, cell.location)) {
          // we have a value to try so try it
          const newGrid = SolverHelpers.applyChangeList(grid, [
            {
              location: { ...cell.location },
              valuesToRemove: cell.value.potentialValues.filter((v) => v !== valueToTry),
            },
          ]);

          // check to see if the puzzle is solved
          if (newGrid.isSolved) {
            // tell the caller
            completed(newGrid);

            // we're done
            return true;
          }

          // it isn't so move onto the next cell
          if (BacktrackingSolver.doBackTracking(newGrid, completed, depth + 1)) {
            // puzzle is solved so we can bail out early
            return true;
          }
        }
      }

      // all the values were tried but it didn't work
      break;
    }

    return false;
  }

  /**
   * Helper method to confirm that a given cell in a grid can have a value.
   * @param grid Grid to check placemnet on.
   * @param value Value to check.
   * @param location Location of cell for proposed value.
   * @returns True if the cell is allowed the specified value.
   */
  private static isValidPlacement(grid: Grid, value: SudokuPossibleValue, location: GridLocation): boolean {
    return !IntersectingCells.fromGridLocation(grid, location).hasValue(value);
  }
}
