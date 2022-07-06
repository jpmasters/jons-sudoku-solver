import { Grid, CellValueChange } from '../Grid';
import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { GridLocation, SudokuPossibleValue } from '../ValueTypes';

/**
 * Defines the result of applying changes to a Grid.
 */
export interface ChangeResult {
  grid: Grid;
  changes: CellValueChange[];
}

/**
 * Structure to help reduce found values into values and counts at a location.
 */
export interface ReducedValues {
  1?: GridLocation[];
  2?: GridLocation[];
  3?: GridLocation[];
  4?: GridLocation[];
  5?: GridLocation[];
  6?: GridLocation[];
  7?: GridLocation[];
  8?: GridLocation[];
  9?: GridLocation[];
}

/***
 * Useful structure for grouping values by location.
 */
export interface GroupedValues {
  value: SudokuPossibleValue[];
  locations: GridLocation[];
}

/**
 * Implements a class that provides helper methods for solving puzzles.
 */
export class SolverHelpers {
  /**
   * Applies a list of changes to a Grid and returns a new grid with the results.
   * @param grid A reference to a Grid to apply the changes to.
   * @param changes A list of cxhanges to apply to the Grid.
   * @returns An object holding the new grid.
   */
  static applyChangeList(grid: Grid, changes: CellValueChange[]): Grid {
    changes.forEach((change) => {
      const newCellValue = grid.cellAtLocation(change.location).value.removePotentials(change.valuesToRemove);
      const newCell = new Cell({ ...change.location }, newCellValue);

      grid = Grid.fromCellCollection(grid.mergedWith(new CellCollection([newCell])));
    });

    return grid;
  }

  /**
   * Pivots the cell values into an object that provides the frequency and locations
   * of values in the specified row, column or block.
   * @param block A reference to a Grid Row, Column or Block.
   * @returns A reference to a ReducedValues object that shows value frequency.
   */
  static reduceCells(block: CellCollection): ReducedValues {
    return block.cells
      .filter((cell) => !cell.value.hasKnownValue)
      .map((cell) => {
        return { location: { ...cell.location }, values: cell.value.potentialValues };
      })
      .reduce<ReducedValues>((prev, curr) => {
        curr.values.forEach((val) => {
          const newLocs = (prev[val] ? prev[val] : []) as GridLocation[];
          newLocs.push(curr.location);
          prev[val] = newLocs;
        });

        return prev;
      }, {});
  }
}
