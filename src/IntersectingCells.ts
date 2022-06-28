import { Cell } from './Cell';
import { CellCollection } from './CellCollection';
import { CellValue } from './CellValue';
import { GridBlocks, GridColumns, GridLocation, GridRows, SudokuPossibleValue } from './ValueTypes';
import { Grid } from './Grid';

export class IntersectingCells extends CellCollection {
  static fromGridLocation(grid: Grid, location: GridLocation): IntersectingCells {
    const cells: Cell[] = grid
      .row(location.row)
      .mergedWith(grid.column(location.column))
      .mergedWith(grid.block(Grid.gridBlockFromLocation(location))).values;

    return new IntersectingCells(cells);
  }

  /**
   * Instantiates a new Grid object.
   * @param values An array of 81 Cells
   */
  private constructor(values: Cell[]) {
    super(values);
  }

  /**
   * Creates a copy of the CellCollection with a specific value set and all other cells
   * have that value potential removed.
   * If the location can't be found in the CellCollection an error is thrown.
   * If the CellCollection already contains that value in another Cell then an error is thrown.
   * TODO: Feels like this should raise some kind of event if all of the potentials:
   *  - Go false except one - i.e. a value is now known
   *  - fails because it would cause a value to have all potentials set false
   * TODO: This fails as a public method for the derived Grid class because this assumes that a value
   * can only appear once.
   * @param location The location to set the value for.
   * @param value The value to set.
   * @returns A new CellCollection with the updated value.
   */
  setValue(location: GridLocation, value: SudokuPossibleValue): CellCollection {
    // check for a valid location
    if (!this.hasLocation(location))
      throw new Error(`A value at location {${location.column}, ${location.row}} could not be found.`);

    // check for a valid value
    if (this.hasValue(value)) throw new Error(`This CellCollection already contains a value of ${value}`);

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
