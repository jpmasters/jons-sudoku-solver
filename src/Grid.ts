import { Helpers } from './Helpers';
import { Cell } from './Cell';
import { CellCollection } from './CellCollection';
import {
  GridBlocks,
  GridColumns,
  GridLocation,
  GridRows,
  SudokuAllPossibleValues,
  SudokuPossibleValue,
} from './ValueTypes';

/**
 * Describes a change to a grid.
 */
export type CellValueChange = {
  location: GridLocation;
  valuesToRemove: SudokuPossibleValue[];
};

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
    const xBlock = Math.floor((location.column - 1) / 3);
    const yBlock = Math.floor((location.row - 1) / 3);

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
    const cells: Cell[] = values
      .map((row, y) => {
        // ensure we have 9 values per row
        if (row.length !== 9) throw new Error('A 9x9 grid of SudokuPossibleValues (1-9) must be supplied.');

        // map each number in a row to a cell
        return row.map((v, x) => {
          return new Cell(
            // remember locations are from 1 - 9 (not 0 - 8)
            { column: (x + 1) as GridColumns, row: (y + 1) as GridRows },
            v ? [v as unknown as SudokuPossibleValue] : SudokuAllPossibleValues,
          );
        });
      })
      // and reduce to a single dimension array
      .reduce<Cell[]>((acc, val) => acc.concat(val), []);

    return new Grid(cells);
  }

  /**
   * Converts a raw CellCollection into a Grid.
   * @param cells The cell collection from which to create the Grid.
   * @returns A reference to the created Grid object.
   */
  static fromCellCollection(cells: CellCollection): Grid {
    return new Grid(cells.cells);
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
    const cells: Cell[] = this.cells
      .filter((cell) => cell.location.row === row)
      .sort((a, b) => a.location.column - b.location.column);

    return new CellCollection(cells);
  }

  /**
   * Returns a copy of the data at a specified column.
   * @param column The column to return.
   * @returns A CellCollection containing a copy of the requested column.
   */
  column(column: GridColumns): CellCollection {
    const cells: Cell[] = this.cells
      .filter((cell) => cell.location.column === column)
      .sort((a, b) => a.location.row - b.location.row);

    return new CellCollection(cells);
  }

  /**
   * Returns a copy of the data at a specified column.
   * @param column The column to return.
   * @returns A CellCollection containing a copy of the requested column.
   */
  block(block: GridBlocks): CellCollection {
    const cells: Cell[] = this.cells.filter((cell) => Grid.gridBlockFromLocation(cell.location) === block);

    return new CellCollection(cells);
  }

  /**
   * Returns a value indicating whether the puzzle is completely solved or not.
   * @returns True if the puzzle is solved or false if it isn't.
   */
  get isSolved(): boolean {
    return this.cells.filter((cell) => !cell.hasKnownValue).length === 0;
  }

  /**
   * returns a list of values that apply what's in this grid to what's in the grid parameter.
   * @param targetGrid The grid to compare it to.
   * @returns A list of values and their locations that differ between the Grids.
   */
  differences(targetGrid: Grid): CellValueChange[] {
    const rv: CellValueChange[] = [];

    this.cells.forEach((thisCell) => {
      // do we have this cell in the incoming grid?
      const targetCellIndex = targetGrid.cells.findIndex((targetCell) =>
        Helpers.locationsMatch(thisCell.location, targetCell.location),
      );

      if (targetCellIndex !== -1) {
        const targetCell: Cell = targetGrid.cells[targetCellIndex];

        // values in the target cell that do not appear in this cell need to be removed
        const valuesRemoved: SudokuPossibleValue[] = targetCell.potentialValues.filter(
          (v) => !thisCell.potentialValues.includes(v),
        );

        if (valuesRemoved.length) {
          rv.push({ location: { ...thisCell.location }, valuesToRemove: valuesRemoved });
        }
      }
    });

    return rv;
  }

  /**
   * Converts the values in this Grid to a 2D array of numbers.
   * @returns The Grid as a 2D array of numbers.
   */
  toPuzzleArray(): number[][] {
    const rv: number[][] = new Array<number[]>(9).fill([]).map<number[]>((v) => new Array(9).fill(0));

    this.cells.forEach((cell) => {
      rv[cell.location.row - 1].splice(cell.location.column - 1, 1, cell.hasKnownValue ? cell.value : 0);
    });

    return rv;
  }
}
