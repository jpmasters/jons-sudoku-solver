import { CellCollection } from '../CellCollection';
import { Grid, CellValueChange } from '../Grid';
import { Helpers } from '../Helpers';
import { SudokuAllPossibleValues, GridLocation, SudokuPossibleValue } from '../ValueTypes';
import { SolverHelpers, ReducedValues } from './SolverHelpers';

export class HiddenPairsSolver {
  /**
   * Searches the Grid for hidden pairs and if it finds any, returns an
   * array of changes to apply to the target grid.
   * @param targetGrid The grid to solve.
   * @returns An array of changes to apply to the grid to solve it.
   */
  static solve(targetGrid: Grid): CellValueChange[] {
    return [
      ...SudokuAllPossibleValues.map((row) => HiddenPairsSolver.solveForBlock(targetGrid.row(row))).flat(),
      ...SudokuAllPossibleValues.map((column) => HiddenPairsSolver.solveForBlock(targetGrid.column(column))).flat(),
      ...SudokuAllPossibleValues.map((block) => HiddenPairsSolver.solveForBlock(targetGrid.block(block))).flat(),
    ];
  }

  /**
   * Searches a given row, column or block for hiddden pairs and returns an
   * array of objects to remove unneeded potentials in those pairs.
   * @param block A reference to a row, column or block to process.
   * @returns An array of GridDifference objects to apply back to the Grid.
   */
  static solveForBlock(block: CellCollection): CellValueChange[] {
    const rv: CellValueChange[] = [];

    // by definition we're only interested in cells with > 2 potentials
    const reducedCells = SolverHelpers.reduceCells(block);

    const pairs = SudokuAllPossibleValues.filter((value) => {
      return value in reducedCells && (reducedCells[value] as ReducedValues[]).length === 2;
    });

    // pairs contains values that only appear twice in the cell
    pairs.forEach((value, i, values) => {
      // now filter to ones that have matching locations for the values as some are
      // unrepeated pairs of values
      const otherValueIdx = values.findIndex((val2, i2) => {
        return Helpers.locationArraysMatch(reducedCells[value], reducedCells[val2]) && i < i2;
      });

      // if we found a matching pair...
      if (otherValueIdx !== -1) {
        // ...create the cell updates needed to remove other values from the pair of cells
        rv.push(
          ...[value, values[otherValueIdx]]
            .map<CellValueChange>((valueChange, locationIdx, valuePair) => {
              const location = { ...(reducedCells[valueChange] as GridLocation[])[locationIdx] };
              return {
                location,
                valuesToRemove: block
                  .cellAtLocation(location)
                  .value.potentialValues.filter((v) => !valuePair.includes(v)),
              };
            })
            // filter out empty changes (cell only had these two values)
            .filter((change) => change.valuesToRemove.length),
        );
      }
    });

    return rv;
  }
}
