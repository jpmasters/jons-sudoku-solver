import { emptyPuzzle } from './EmptyPuzzle';
import { GridDifference, Grid } from './Grid';
import { IntersectingCells } from './IntersectingCells';

/**
 * Defines the result of applying changes to a Grid.
 * TODO: This should not be exposed outside the library.
 */
export interface ChangeResult {
  grid: Grid;
  changes: Array<GridDifference>;
}

/**
 * Implemenbts a class that can solve a 9x9 Sudoku provided as a number[9][9].
 */
export class SudokuSolver {
  /**
   * Applies a list of changes to a Grid and returns a new grid with the results.
   * TODO: This function shouldn't be exposed outside the librry.
   * @param grid The starting grid.
   * @param changes A list of cxhanges to apply to the Grid.
   * @returns An object holding the new grid.
   */
  static applyChangeList(grid: Grid, changes: Array<GridDifference>): ChangeResult {
    const gridCopy: Grid = Grid.fromCellCollection(grid);

    changes.forEach((change) => {
      let i = IntersectingCells.fromGridLocation(grid, change.location);
      i = IntersectingCells.fromCellCollection(i.setValue(change.location, change.value));
      grid = Grid.fromCellCollection(grid.mergedWith(i));
    });

    return {
      grid: grid,
      changes: grid
        .differences(gridCopy)
        .filter(
          (diff) =>
            changes.findIndex(
              (diff2) => diff.location.row === diff2.location.row && diff.location.column === diff2.location.column,
            ) === -1,
        ),
    };
  }

  /**
   * Converts the values in a Grid to a 2D array of numbers.
   * @param grid The grid object to convert.
   * @returns The Grid as a 2D array of numbers.
   */
  static gridToPuzzleArray(grid: Grid): Array<Array<number>> {
    // TODO: there must be a better way to do this without copying the
    // same sub-array reference to every row??
    let rv: Array<Array<number>> = new Array(9).fill([]);
    rv.forEach((v, i) => {
      rv[i] = new Array(9).fill(0);
    });

    grid.values.forEach((cell) => {
      rv[cell.location.row - 1].splice(cell.location.column - 1, 1, cell.value.hasKnownValue ? cell.value.value : 0);
    });

    return rv;
  }

  /**
   * Solves the given 9x9 Sudoku grid.
   * @param puzzle A puzzle defined a as a 2D array of numbers with zeros representing unknown values.
   * @returns A solved puzzle defined as a 2D array of numbers.
   */
  static solve(puzzle: Array<Array<number>>): Array<Array<number>> {
    // make sure we have a valid grid as this is an external interface method.
    if (puzzle.length !== 9) throw new Error('Grid must contain 9 rows.');
    if (puzzle.filter((column) => column.length !== 9).length) throw new Error('Grid must contain 9 columns.');
    if (puzzle.flat().filter((val) => val < 0 || val > 9).length)
      throw new Error('Grid must contain values between 0 and 9 where 0 is an unknown value.');
    if (puzzle.flat().filter((val) => val !== 0).length === 0) throw new Error('Grid must have some initial values.');

    let rv = Array(9).fill(Array(9).fill(0));
    rv.forEach((v, i) => {
      rv[i] = new Array(9).fill(0);
    });

    let sourceGrid = Grid.fromGrid(puzzle);
    let targetGrid: Grid = Grid.fromGrid(emptyPuzzle);
    let changes: Array<GridDifference> = sourceGrid.differences(targetGrid);

    // get the initial set of changes
    let res: ChangeResult = { grid: targetGrid, changes: changes };

    // now get the rest
    while (res.changes.length) {
      // apply them to the target grid
      res = SudokuSolver.applyChangeList(res.grid, res.changes);
    }

    // concert it into something we can return
    return this.gridToPuzzleArray(res.grid);
  }
}
