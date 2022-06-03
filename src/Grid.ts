import { Cell } from './Cell';
import { CellValue } from './CellValue';
import { SudokuPossibleValue } from './ValueTypes';

/**
 * Defines an immutable grid structure of Sudoku cells.
 */
export class Grid {
  constructor(values: number[][]) {
    // it must have 9 rows
    if (values.length !== 9) throw new Error('A 9x9 grid of SudokuPossibleValues (1-9) must be supplied.');

    // map each row of numbers to a row of cells
    this.values = values.map((row, y) => {
      // ensure we have 9 values per row
      if (row.length !== 9) throw new Error('A 9x9 grid of SudokuPossibleValues (1-9) must be supplied.');

      // map each number in a row to a cell
      return row.map((v, x) => {
        return new Cell(
          // remember locations are from 1 - 9 (not 0 - 8)
          { x: x + 1, y: y + 1 },
          v ? new CellValue([v as unknown as SudokuPossibleValue]) : new CellValue(),
        );
      });
    });
  }

  readonly values: Cell[][];
}
