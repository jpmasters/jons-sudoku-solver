import { Cell } from './Cell';
import { GridLocation, SudokuPossibleValue } from './ValueTypes';

/**
 * Base class for immutable groups of Cells.
 */
export class CellCollection {
  /**
   * Instantiates a new CellCollection object.
   * @param values A list of cells to initialise with. Cells will be deep copied.
   */
  constructor(values: Cell[]) {
    this.values = values.map<Cell>((c) => {
      return new Cell({...c.location}, c.value.copy());
    });
  }

  /**
   * Holds the cell values.
   */
  readonly values: Cell[];

  /**
   * Returns a copy of the Cell at the given location.
   * @param location The grid location to look for.
   * @returns A copy of the cell or null if there is no cell at the location.
   */
  cellAtLocation(location: GridLocation): Cell | null {
    const rv: Cell | undefined = this.values.find((c) => {
      return c.location.column === location.column && c.location.row === location.row;
    });

    return rv ? rv.copy() : null;
  }

  /**
   * Returns a new CellColection that combines the contents of two CellCollections
   * replacing any of the existing items with those in the cells parameter if they
   * appear at the same grid location.
   * @param cells Cells to merge.
   * @returns A new CellCollection with the merged Cells.
   */
  mergedWith(cells: CellCollection): CellCollection {
    // create the merged cells and de-dupe ensuring the cells passed in overwrite the existing ones
    const mergedCells: Cell[] = cells.values.concat(this.values).filter((c, i, arr) => {
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
    return !!this.values.filter(
      (cell) => cell.location.column === location.column && cell.location.row === location.row,
    ).length;
  }

  /**
   * Returns a value indicating whether the CellCollection contains a Cell with the
   * specified value (i.e. all other potential values are discarded).
   * @param value The value to check.
   * @returns True if the CellCollection contains a value. False if not.
   */
  hasValue(value: SudokuPossibleValue): boolean {
    return !!this.values.filter((cell) => cell.value.hasKnownValue && cell.value.value === value).length;
  }
}
