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
}
