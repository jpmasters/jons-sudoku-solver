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

  /**
   * Scans a row, column or block for a unique combination of n cells. The number of cells
   * returned (n) is provided by the caller in the groupsOf parameter. The caller provides
   * a callback function to process the groups and if the callback function returns true,
   * that group will be added to the Cell[][] returned value.
   * If you pass in an array of cells that is not 9 Cells long, an error is thrown.
   * @param block A CellCollection containing a row, column or block to be scanned.
   * @param groupsOf The number of cells to return in each combination.
   * @param callback A callback method to receive each cell combination.
   * @returns An array of Cell[] where the callback function returned true.
   */
  static scanBlock(
    block: CellCollection,
    groupsOf: SudokuPossibleValue,
    callback: (cells: Cell[]) => boolean,
  ): Cell[][] {
    if (block.cells.length !== 9) throw new Error('scanBlock requires exactly 9 Cells to process.');

    const rv: Cell[][] = [];

    let startValue = 0;
    for (let i = 0; i < groupsOf; i++) {
      // tslint:disable-next-line:no-bitwise
      startValue = startValue | (1 << i);
    }

    for (let possibleValues = startValue; possibleValues <= 0x1ff; possibleValues++) {
      const s = possibleValues.toString(2).split('');
      if (s.filter((v) => v === '1').length === 3) {
        const cellsToProcess = Array(9)
          .fill('0')
          .concat(s)
          .slice(-9)
          .map<number>((v, i) => (v === '1' ? i : -1))
          .filter((v) => v !== -1)
          .map((i) => block.cells[i]);

        // if caller is interested in these...
        if (callback(cellsToProcess)) {
          // ...push a deep copy onto the return value
          rv.push(new CellCollection(cellsToProcess).cells);
        }
      }
    }
    return rv;
  }
}
