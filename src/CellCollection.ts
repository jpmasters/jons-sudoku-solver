import { Cell } from './Cell';
import { GridLocation } from './ValueTypes';

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
      return new Cell(c.location, c.value.copy());
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
      return c.location.x === location.x && c.location.y === location.y;
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
      return arr.findIndex((c2) => c2.location.x === c.location.x && c2.location.y === c.location.y) === i;
    });

    return new CellCollection(mergedCells);
  }
}
