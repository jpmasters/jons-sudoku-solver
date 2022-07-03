import { Cell } from './Cell';
import { CellCollection } from './CellCollection';
import { CellValue } from './CellValue';
import { GridLocation, SudokuPossibleValue } from './ValueTypes';
import { Grid } from './Grid';

/**
 * Implements a class that represents a row, column and a block that intersect the given
 * cell in the given Grid. The cell at the given location must have a unique value in the
 * cells selected but a value can be represented more than once at any other location.
 */
export class IntersectingCells extends CellCollection {
  /**
   * Creates a new IntersectingCells object from the specified grid at the specified location.
   * @param grid A reference to the Grid to extract the IntersectingCells from.
   * @param location The location from which to get the row, column and block.
   * @returns An instance of an IntersectingCells object containing copies of the selected cells.
   */
  static fromGridLocation(grid: Grid, location: GridLocation): IntersectingCells {
    const cells: Cell[] = grid
      .row(location.row)
      .mergedWith(grid.column(location.column))
      .mergedWith(grid.block(Grid.gridBlockFromLocation(location))).values;

    return new IntersectingCells(cells);
  }

  /**
   * Instantiates a new IntersectigCells object from a CellCollection.
   * @param cells The cells to initialise the new collection from.
   * @returns A new IntersectingCells object.
   */
  static fromCellCollection(cells: CellCollection): IntersectingCells {
    return new IntersectingCells(cells.values);
  }

  /**
   * Instantiates a new IntersectingCells object.
   * @param values An array of 81 Cells
   */
  private constructor(values: Cell[]) {
    super(values);
  }

  /**
   * Creates a copy of the CellCollection with a specific value set and all other cells
   * have that value potential removed.
   * If the location can't be found in the CellCollection an error is thrown.
   * @param location The location to set the value for.
   * @param value The value to set.
   * @returns A new CellCollection with the updated value.
   */
  setValue(location: GridLocation, value: SudokuPossibleValue): CellCollection {
    // check for a valid location
    if (!this.hasLocation(location))
      throw new Error(`A value at location {${location.column}, ${location.row}} could not be found.`);

    // create a new CellCollection with the new value
    const newCellValues: Cell[] = this.values.map((c) => {
      const newValue: CellValue =
        c.location.column === location.column && c.location.row === location.row
          ? new CellValue([value])
          : c.value.removePotential(value);

      return new Cell({ column: c.location.column, row: c.location.row }, newValue);
    });

    return new CellCollection(newCellValues);
  }
}
