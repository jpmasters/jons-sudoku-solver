import { CellValue } from './CellValue';
import { GridLocation } from './ValueTypes';

/**
 * Describes a cell within a Sudoku grid.
 */
export class Cell {
  /**
   * Instantiates a new instance of a Cell. You must provide a location
   * for the cell. You can also specify an initial value. If you don't
   * then the cell is initialised to all potential values.
   * @param location The location of the cel in the grid.
   * @param value An optional initial value for the cell.
   */
  constructor(location: GridLocation, value: CellValue = new CellValue()) {
    this.value = value.copy();
    this.location = { ...location };
  }

  /**
   * Returns a deep copy of the Cell.
   * @returns A deep copy of the Cell.
   */
  copy(): Cell {
    return new Cell({ ...this.location }, this.value.copy());
  }

  /**
   * Gets the value for the cell.
   */
  readonly value: CellValue;

  /**
   * Gets the location for the cell.
   */
  readonly location: GridLocation;
}
