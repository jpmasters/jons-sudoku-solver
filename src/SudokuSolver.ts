import { emptyPuzzle } from './EmptyPuzzle';
import { GridDifference, Grid } from './Grid';
import { ChangeResult, SolverHelpers } from './SolverHelpers';
import { SolverStrategies } from './SolverStrategies';
import { SudokuAllPossibleValues } from './ValueTypes';

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

    const rv = Array(9).fill(Array(9).fill(0));
    rv.forEach((v, i) => {
      rv[i] = new Array(9).fill(0);
    });

    // get the initial set of changes
    const sourceGrid = Grid.fromGrid(puzzle);
    let targetGrid: Grid = Grid.fromGrid(emptyPuzzle);
    let changes: GridDifference[] = sourceGrid.differences(targetGrid);

    // now get the rest
    while (changes.length) {
      // apply them to the target grid
      targetGrid = SolverHelpers.applyChangeList(targetGrid, changes);

      changes = [];

      // if we got zero changes, try our strategies
      if (!targetGrid.isSolved) {
        if (!changes.length) {
          SudokuSolver.solveCollapsedValues(changes, targetGrid);
        }

        if (!changes.length) {
          SudokuSolver.solveSingleValues(changes, targetGrid);
        }

        if (!changes.length) {
          SudokuSolver.solveHiddenPairs(changes, targetGrid);
        }
      }
    }

    // convert it into something we can return
    return targetGrid.toPuzzleArray();
  }

  private static solveSingleValues(changes: GridDifference[], targetGrid: Grid) {
    changes.push(
      ...SudokuAllPossibleValues.map((row) => SolverStrategies.findSingleValues(targetGrid.row(row))).flat(),
      ...SudokuAllPossibleValues.map((column) => SolverStrategies.findSingleValues(targetGrid.column(column))).flat(),
      ...SudokuAllPossibleValues.map((block) => SolverStrategies.findSingleValues(targetGrid.block(block))).flat(),
    );
  }

  private static solveCollapsedValues(changes: GridDifference[], targetGrid: Grid) {
    changes.push(
      ...SudokuAllPossibleValues.map((row) => SolverStrategies.findCollapsedValues(targetGrid.row(row))).flat(),
      ...SudokuAllPossibleValues.map((column) =>
        SolverStrategies.findCollapsedValues(targetGrid.column(column)),
      ).flat(),
      ...SudokuAllPossibleValues.map((block) => SolverStrategies.findCollapsedValues(targetGrid.block(block))).flat(),
    );
  }

  private static solveHiddenPairs(changes: GridDifference[], targetGrid: Grid) {
    changes.push(
      ...SudokuAllPossibleValues.map((row) => SolverStrategies.findHiddenPairs(targetGrid.row(row))).flat(),
      ...SudokuAllPossibleValues.map((column) => SolverStrategies.findHiddenPairs(targetGrid.column(column))).flat(),
      ...SudokuAllPossibleValues.map((block) => SolverStrategies.findHiddenPairs(targetGrid.block(block))).flat(),
    );
  }
}
