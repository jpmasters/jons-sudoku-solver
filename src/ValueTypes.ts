/**
 * The possible values a cell can have.
 */
export type SudokuPossibleValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * An array of possible values.
 */
export type SudokuPossibleValues = ReadonlyArray<SudokuPossibleValue>;

/**
 * A helper class describing all possible values.
 */
export const SudokuAllPossibleValues: SudokuPossibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/**
 * Defines the location of a cell within a grid.
 */
export type GridLocation = { x: number; y: number };
