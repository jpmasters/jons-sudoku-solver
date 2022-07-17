import { Grid } from '../Grid';
import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import {
  CellValueChange,
  GridLocation,
  SudokuAllPossibleValues,
  SudokuPossibleValue,
  ValueComboType,
} from '../ValueTypes';
import { Helpers } from '../Helpers';

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
      const newCellValue = grid.cellAtLocation(change.location).removePotentials(change.valuesToRemove);
      const newCell = new Cell({ ...change.location }, newCellValue.potentialValues);

      grid = Grid.fromCellCollection(grid.mergedWith(new CellCollection([newCell])));
    });

    return grid;
  }

  /**
   * Pivots the cell values into an object that provides the frequency and locations
   * of values in the specified row, column or block.
   * TODO: See if there is a simpler way to do this which could removed code complexity.
   * @param block A reference to a Grid Row, Column or Block.
   * @returns A reference to a ReducedValues object that shows value frequency.
   */
  static reduceCells(block: CellCollection): ReducedValues {
    return block.cells
      .filter((cell) => !cell.hasKnownValue)
      .map((cell) => {
        return { location: { ...cell.location }, values: cell.potentialValues };
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
    callback: (cells: Cell[], block: Cell[]) => boolean,
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
      if (s.filter((v) => v === '1').length === groupsOf) {
        const cellsToProcess = Array(9)
          .fill('0')
          .concat(s)
          .slice(-9)
          .map<number>((v, i) => (v === '1' ? i : -1))
          .filter((v) => v !== -1)
          .map((i) => block.cells[i])
          .sort((a, b) => a.location.row - b.location.row)
          .sort((a, b) => a.location.column - b.location.column);

        // if caller is interested in these...
        if (callback(cellsToProcess, block.cells)) {
          // ...push a deep copy onto the return value
          rv.push(new CellCollection(cellsToProcess).cells);
        }
      }
    }
    return rv;
  }

  /**
   * Runs a naked cell solver for a row, column or block.
   * @param block A reference to a row, column or block to process.
   * @param comboType The type of combo to process.
   * @param source string to say where the changes have come from.
   * @returns A set of changes to apply to the target grid or an empty array if
   * no naked cells are found.
   */
  static processNakedCellsInBlock(block: CellCollection, comboType: ValueComboType, source: string): CellValueChange[] {
    const rv: CellValueChange[] = [];

    // search the block for triples
    SolverHelpers.scanBlock(block, comboType, (cells) => {
      return new Set(cells.map((c) => c.potentialValues).flat()).size === comboType;
    })
      // for each of the triples we found
      .some((nakedGroup) => {
        rv.push(
          ...block.cells
            .filter((blockCell) => {
              // filter out cells that are part of the triple group as we're mot changing them
              return nakedGroup.every((nakedCell) => !Helpers.locationsMatch(nakedCell.location, blockCell.location));
            })
            .map<CellValueChange>((cell) => {
              // for the remainnig cells, create a change obect that removes potentials that are part of
              // the triple
              const nakedPotentials = Array.from(new Set(nakedGroup.map((c) => c.potentialValues).flat()));
              return {
                source,
                location: { ...cell.location },
                valuesToRemove: nakedPotentials.filter((p) => cell.potentialValues.includes(p)).sort((a, b) => a - b),
              };
            })
            // finally filter out empty changes
            .filter((cvc) => cvc.valuesToRemove.length),
        );

        return rv.length;
      });

    return rv;
  }

  /**
   * Searches a given row, column or block for hidden values and returns an
   * array of objects to remove unneeded potentials in those cells.
   * @param block A reference to a row, column or block to process.
   * @param groupsOf Whether to serch for pairs, triples, or quads.
   * @param source The source solver to add to the change messages.
   * @returns An array of GridDifference objects to apply back to the Grid.
   */
  static processHiddenCellsInBlock(
    block: CellCollection,
    groupsOf: SudokuPossibleValue,
    source: string,
  ): CellValueChange[] {
    const rv: CellValueChange[] = [];

    SolverHelpers.scanBlock(block, groupsOf, (cellsToConsider, blockCells) => {
      let valuesToConsider = cellsToConsider
        .map<SudokuPossibleValue[]>((c) => c.potentialValues)
        .flat()
        .filter((v, i, a) => a.indexOf(v) === i);

      const otherCells: Cell[] = blockCells.filter((blockCell) => {
        return cellsToConsider.every((c) => !Helpers.locationsMatch(blockCell.location, c.location));
      });

      // now use the potentials from otherCells to filter values to consider
      const valuesToRemove = otherCells
        .map<SudokuPossibleValue[]>((c) => c.potentialValues)
        .flat()
        .filter((v, i, a) => a.indexOf(v) === i);

      valuesToConsider = valuesToConsider.filter((v) => !valuesToRemove.includes(v));

      // do we have 'groupsOf' values left in valuesToConsider? if so, we have a hidden triple
      // so return true
      if (valuesToConsider.length === groupsOf) {
        rv.push(
          ...cellsToConsider
            .map<CellValueChange>((c) => {
              return {
                source,
                location: { ...c.location },
                valuesToRemove: c.potentialValues.filter((v) => !valuesToConsider.includes(v)),
              };
            })
            .filter((v) => v.valuesToRemove.length),
        );
      }

      return false;
    });

    return rv;
  }

  /**
   * Searches the targetGrid for naked pairs, truples or quads and returns a list of potentials that
   * need to be updated to the caller.
   * @param helperFn A function to call that will find the changes needed to solve a basic cell combination.
   * @param targetGrid The grid to solve.
   * @param comboType A ValueComboType describing whether we're looking for Pairs, Triples or Quads.
   * @param source The name of the solver that will be passed as part of the changes array.
   * @returns An array of CellValueChange objects describing the changes to make.
   */
  static solveSimpleMultiples(
    helperFn: (targetGrid: CellCollection, comboType: ValueComboType, source: string) => CellValueChange[],
    targetGrid: Grid,
    comboType: ValueComboType,
    source: string,
  ): CellValueChange[] {
    const rv: CellValueChange[] = [];

    [targetGrid.row.bind(targetGrid), targetGrid.column.bind(targetGrid), targetGrid.block.bind(targetGrid)].some(
      (fn) => {
        return SudokuAllPossibleValues.some((rcb) => {
          const cvc = helperFn(fn(rcb), comboType, source);
          rv.push(...cvc);
          return cvc.length;
        });
      },
    );

    return rv;
  }

  /**
   * Searches the targetGrid for naked pairs, truples or quads and returns a list of potentials that
   * need to be updated to the caller.
   * @param targetGrid The grid to solve.
   * @param comboType A ValueComboType describing whether we're looking for Pairs, Triples or Quads.
   * @param source The name of the solver that will be passed as part of the changes array.
   * @returns An array of CellValueChange objects describing the changes to make.
   */
  static solveNakedMultiples(targetGrid: Grid, comboType: ValueComboType, source: string): CellValueChange[] {
    return SolverHelpers.solveSimpleMultiples(SolverHelpers.processNakedCellsInBlock, targetGrid, comboType, source);
  }

  /**
   * Searches the targetGrid for hidden pairs, truples or quads and returns a list of potentials that
   * need to be updated to the caller.
   * @param targetGrid The grid to solve.
   * @param comboType A ValueComboType describing whether we're looking for Pairs, Triples or Quads.
   * @param source The name of the solver that will be passed as part of the changes array.
   * @returns An array of CellValueChange objects describing the changes to make.
   */
  static solveHiddenMultiples(targetGrid: Grid, comboType: ValueComboType, source: string): CellValueChange[] {
    return SolverHelpers.solveSimpleMultiples(SolverHelpers.processHiddenCellsInBlock, targetGrid, comboType, source);
  }

  /**
   * Searches the grid provided for intersecting blocks, rows and columns
   * where potential removals can take place. Returns an array of CellValueChange
   * objects to make the required changes.
   * array of changes to apply to the target grid.
   * @param targetGrid The grid to solve.
   * @param solveFn A function that can solve for a given block and row / column.
   * @returns An array of changes to apply to the grid to solve it.
   */
  static solveBoxLineReduction(
    targetGrid: Grid,
    solveFn: (blockCells: CellCollection, rowOrColumnCells: CellCollection) => CellValueChange[],
  ): CellValueChange[] {
    const rv: CellValueChange[] = [];

    // iterate through each block in the puzzle
    SudokuAllPossibleValues.map((b) => targetGrid.block(b)).some((block) => {
      // search both rows and columns in the block...
      ['row', 'column'].some((rc) => {
        const rowOrColumn = rc as 'row' | 'column';

        block.cells
          // ...looking for rows and cells that intersect the block
          .filter((cell, i, arr) => {
            return arr.findIndex((c) => cell.location[rowOrColumn] === c.location[rowOrColumn]) === i;
          })
          .some((cell) => {
            // call the solver for the block row / column combo
            rv.push(...solveFn(block, targetGrid.row(cell.location[rowOrColumn])));

            // exit early if we have something to return
            return rv.length;
          });

        // exit early if we have something to return
        return rv.length;
      });

      // exit early if we have something to return
      return rv.length;
    });

    return rv;
  }
}
