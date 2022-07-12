import { Cell } from './Cell';
import { CellCollection } from './CellCollection';
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
      .mergedWith(grid.block(Grid.gridBlockFromLocation(location))).cells;

    return new IntersectingCells(cells);
  }

  /**
   * Instantiates a new IntersectigCells object from a CellCollection.
   * @param cells The cells to initialise the new collection from.
   * @returns A new IntersectingCells object.
   */
  static fromCellCollection(cells: CellCollection): IntersectingCells {
    return new IntersectingCells(cells.cells);
  }

  /**
   * Instantiates a new IntersectingCells object.
   * @param values An array of 81 Cells
   */
  private constructor(values: Cell[]) {
    super(values);
  }

  /**
   * Removes the values provided from the specified Cell and returns a new IntersectingCell
   * object with the updated values.
   * @param location The location at which to remove the potentials.
   * @param values The values to remove.
   * @returns A new IntersectingCells object with the updated values.
   */
  removePotentials(location: GridLocation, values: SudokuPossibleValue[]): IntersectingCells {
    // check for a valid location
    if (!this.hasLocation(location))
      throw new Error(`A value at location {${location.column}, ${location.row}} could not be found.`);

    const thisCell = this.cellAtLocation(location);
    const newCell: Cell = new Cell(location, thisCell.removePotentials(values).potentialValues);
    return IntersectingCells.fromCellCollection(this.mergedWith(new CellCollection([newCell])));
  }
}
