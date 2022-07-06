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
      ...SudokuAllPossibleValues.map((row) => HiddenPairsSolver.findHiddenPairs(targetGrid.row(row))).flat(),
      ...SudokuAllPossibleValues.map((column) => HiddenPairsSolver.findHiddenPairs(targetGrid.column(column))).flat(),
      ...SudokuAllPossibleValues.map((block) => HiddenPairsSolver.findHiddenPairs(targetGrid.block(block))).flat(),
    ];
  }

  /**
   * Searches a given row, column or block for hiddden pairs and returns an
   * array of objects to remove unneeded potentials in those pairs.
   * @param block A reference to a row, column or block to process.
   * @returns An array of GridDifference objects to apply back to the Grid.
   */
  static findHiddenPairs(block: CellCollection): CellValueChange[] {
    const rv: CellValueChange[] = [];
    const reducedCells = SolverHelpers.reduceCells(block);

    // we're looking for sets of 2 cells that hold the same pair of values
    // along with a load of other values
    const pairs = SudokuAllPossibleValues.filter((value) => {
      return value in reducedCells && (reducedCells[value] as ReducedValues[]).length === 2;
    }).filter((value, i, arr) => {
      return arr
        .filter((v) => v !== value)
        .some((v2) =>
          Helpers.locationArraysMatch(reducedCells[v2] as GridLocation[], reducedCells[value] as GridLocation[]),
        );
    });

    if (pairs.length > 2) throw new Error('Did not expect multiple pairs to be possible.');

    if (pairs.length === 2) {
      rv.push(
        ...block.cells
          .filter((cell) => Helpers.arrayContainsAll(cell.value.potentialValues, pairs))
          .map<CellValueChange>((cell) => {
            const vr: SudokuPossibleValue[] = cell.value.potentialValues.filter((v) => !pairs.includes(v));
            return { location: { ...cell.location }, valuesToRemove: [...vr] };
          })
          .filter((diff) => diff.valuesToRemove.length),
      );
    }

    return rv;
  }
}
