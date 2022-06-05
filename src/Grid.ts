import { Cell } from './Cell';
import { CellCollection } from './CellCollection';
import { CellValue } from './CellValue';
import { SudokuPossibleValue } from './ValueTypes';

/**
 * Defines an immutable grid structure of Sudoku cells.
 */
export class Grid extends CellCollection {
  /**
   * Creates a new Grid object from a 9x9 array containing known values. Unknown values
   * should be set to zero.
   * @param values A 9x9 grid of numbers that gives the starting point for the grid.
   * @returns A Grid object containing the required Cells.
   */
  static fromGrid(values: number[][]): Grid {
    // it must have 9 rows
    if (values.length !== 9) throw new Error('A 9x9 grid of SudokuPossibleValues (1-9) must be supplied.');

    // map each row of numbers to a row of cells
    let cells: Cell[] = values
      .map((row, y) => {
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
      })
      // and reduce to a single dimension array
      .reduce<Cell[]>((acc, val) => acc.concat(val), []);

    return new Grid(cells);
  }

  /**
   * Instantiates a new Grid object.
   * @param values An array of 81 Cells
   */
  constructor(values: Cell[]) {
    super(values);

    // ensure that there are 81 values set
    if (values.length !== 81) throw Error('A Grid must contain 81 values.');
  }
}
