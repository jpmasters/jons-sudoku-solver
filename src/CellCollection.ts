import { Cell } from './Cell';
import { Helpers } from './Helpers';
import { GridLocation, SudokuAllPossibleValues, SudokuPossibleValue } from './ValueTypes';

/**
 * Base class for immutable groups of Cells.
 */
export class CellCollection {
  /**
   * Instantiates a new CellCollection object.
   * @param values A list of cells to initialise with. Cells will be deep copied.
   */
  constructor(values: Cell[]) {
    this.cells = Helpers.orderCells(
      values.map<Cell>((c) => {
        return new Cell({ ...c.location }, c.value.copy());
      }),
    );
  }

  /**
   * Holds the cell values.
   */
  readonly cells: Cell[];

  /**
   * Returns a copy of the Cell at the given location.
   * @param location The grid location to look for.
   * @throws Error if the location cannot be found in the cell collection
   *         @see CellCollection#hasLocation hasLocation
   * @returns A copy of the cell.
   */
  cellAtLocation(location: GridLocation): Cell {
    const rv: Cell | undefined = this.cells.find((c) => {
      return c.location.column === location.column && c.location.row === location.row;
    });

    if (!rv) throw new Error(`No cell at location column: ${location.column} row: ${location.row}.`);

    return rv.copy();
  }

  /**
   * Returns a new CellCollection that combines the contents of two CellCollections
   * replacing any of the existing items with those in the cells parameter if they
   * appear at the same grid location.
   * @param cells Cells to merge.
   * @returns A new CellCollection with the merged Cells.
   */
  mergedWith(cells: CellCollection): CellCollection {
    // create the merged cells and de-dupe ensuring the cells passed in overwrite the existing ones
    const mergedCells: Cell[] = cells.cells.concat(this.cells).filter((c, i, arr) => {
      return (
        arr.findIndex((c2) => c2.location.column === c.location.column && c2.location.row === c.location.row) === i
      );
    });

    return new CellCollection(mergedCells);
  }

  /**
   * Returns a value indicating whether the CellCollection contains a value for the specified location.
   * @param location The location to check.
   * @returns True if the CellCollection contains a value for the location. False if not.
   */
  hasLocation(location: GridLocation): boolean {
    return !!this.cells.filter((cell) => cell.location.column === location.column && cell.location.row === location.row)
      .length;
  }

  /**
   * Returns a value indicating whether the CellCollection contains a Cell with the
   * specified value (i.e. all other potential values are discarded).
   * @param value The value to check.
   * @returns True if the CellCollection contains a value. False if not.
   */
  hasValue(value: SudokuPossibleValue): boolean {
    return !!this.cells.filter((cell) => cell.value.hasKnownValue && cell.value.value === value).length;
  }

  /**
   * returns a value indicating whether the Grid is ann empty Grid.
   * @returns True if the grid has no values set (i.e. every Cell has all potential values)
   */
  hasNoValues(): boolean {
    return this.cells.every((c) => Helpers.arrayContainsAll(c.value.potentialValues, SudokuAllPossibleValues));
  }
}
