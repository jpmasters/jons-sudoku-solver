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

    // the location must be in range
    if (location.x < 1 || location.x > 9 || location.y < 1 || location.y > 9) {
      throw new Error('Location is out of range. x and y values should be between 1 and 9');
    }

    this.location = location;
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
