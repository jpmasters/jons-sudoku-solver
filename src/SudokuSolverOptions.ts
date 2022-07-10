/**
 * An enumeration of available solving strategies. Note that backtracking
 * is handled separately in the options.
 */
export enum SudokuSolverStrategy {
  NakedSingles,
  HiddenPairs,
  NakedPairs,
  NakedTriples,
  PointingPairs,
  HiddenSingles,
}

/**
 * Defines the available options for solving the puzzle.
 */
export class SudokuSolverOptions {
  /**
   * An optional array of SudokuSolverStrategy values representing the solvers to include.
   * If an array isn't provided, it will include all solvers by default. To run
   * the backtracking algorithm on its own, specify an empty array i.e. [].
   */
  includeStrategies?: SudokuSolverStrategy[];

  /**
   * An optional value whether to complete puzzles using backtracking. If the value is
   * not specified or set to true, backtracking will be used to fill in any unknown
   * cells. If it is explicitly set to false, it will not run backtracking. Note that
   * this might result in outputting incomlpete puzzles but it's useful when writing new
   * solver classes.
   */
  includeBacktracking?: boolean;
}

/**
 * Fills in any missing default values not provided by the calling application.
 * @param providedOptions Options provided by the calling application.
 * @returns Options with defaults filled in where unspecified.
 */
export function deriveOptions(providedOptions: SudokuSolverOptions): SudokuSolverOptions {
  return {
    includeBacktracking: true,
    includeStrategies: Object.values(SudokuSolverStrategy).filter(
      (v) => typeof v !== 'string',
    ) as SudokuSolverStrategy[],
    ...providedOptions,
  };
}
