import { Cell } from './Cell';
import { CellCollection } from './CellCollection';
import { CellValue } from './CellValue';
import { GridLocation, SudokuPossibleValue } from './ValueTypes';

export type GridRows = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type GridColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type GridBlocks = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/**
 * Defines an immutable grid structure of Sudoku cells.
 */
export class Grid extends CellCollection {
  /**
   * This helper function transforms a location (x 1 to 9, y 1 to 9) into the
   * corresponding GridBlock (1 - 9) representing one of the 9 sub-squares in the
   * Sudoku grid.
   * @param location The x y location to look up.
   * @returns The GridBlock that the location sits in.
   */
  static gridBlockFromLocation(location: GridLocation): GridBlocks {
    const xBlock = Math.floor((location.x - 1) / 3);
    const yBlock = Math.floor((location.y - 1) / 3);

    return (1 + xBlock + 3 * yBlock) as GridBlocks;
  }

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

  /**
   * Returns a copy of the data at a specified row.
   * @param row The row to return.
   * @returns A CellCollection containing a copy of the requested row.
   */
  row(row: GridRows): CellCollection {
    const cells: Cell[] = this.values
      .filter((cell) => cell.location.y === (row as number))
      .sort((a, b) => a.location.x - b.location.x);

    return new CellCollection(cells);
  }

  /**
   * Returns a copy of the data at a specified column.
   * @param column The column to return.
   * @returns A CellCollection containing a copy of the requested column.
   */
  column(column: GridColumns): CellCollection {
    const cells: Cell[] = this.values
      .filter((cell) => cell.location.x === (column as number))
      .sort((a, b) => a.location.y - b.location.y);

    return new CellCollection(cells);
  }

  /**
   * Returns a copy of the data at a specified column.
   * @param column The column to return.
   * @returns A CellCollection containing a copy of the requested column.
   */
  block(block: GridBlocks): CellCollection {
    const cells: Cell[] = this.values.filter((cell) => Grid.gridBlockFromLocation(cell.location) === block);

    return new CellCollection(cells);
  }
}
