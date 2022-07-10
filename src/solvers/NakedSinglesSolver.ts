import { CellCollection } from '../CellCollection';
import { Grid, CellValueChange } from '../Grid';
import { Helpers } from '../Helpers';
import { SudokuAllPossibleValues } from '../ValueTypes';

export class NakedSinglesSolver {
  /**
   * Searches the grid for values with a single potential and if it finds any, returns an
   * array of changes to apply to the target grid.
   * @param targetGrid The grid to solve.
   * @returns An array of changes to apply to the grid to solve it.
   */
  static solve(targetGrid: Grid): CellValueChange[] {
    return [
      ...SudokuAllPossibleValues.map((row) => NakedSinglesSolver.solveForBlock(targetGrid.row(row))).flat(),
      ...SudokuAllPossibleValues.map((column) => NakedSinglesSolver.solveForBlock(targetGrid.column(column))).flat(),
      ...SudokuAllPossibleValues.map((block) => NakedSinglesSolver.solveForBlock(targetGrid.block(block))).flat(),
    ];
  }

  /**
   * Searches a given Row, Column or Block for cells where its potentials have collapsed into a
   * single value. It then returns an array of objects to remove the potential to other
   * cells in the block.
   * @param block A reference to a row, column or block that holds 9 unique values.
   * @returns An array of changes that can be applied back to the grid.
   */
  static solveForBlock(block: CellCollection): CellValueChange[] {
    const cellsWithKnownValues = block.cells.filter((cell) => cell.value.hasKnownValue);
    const rv: CellValueChange[] = [];
    cellsWithKnownValues.forEach((cell) => {
      rv.push(
        ...block.cells
          .filter(
            (bc) =>
              !Helpers.locationsMatch(bc.location, cell.location) &&
              bc.value.potentialValues.includes(cell.value.value),
          )
          .map<CellValueChange>((bc) => {
            return {
              location: { ...bc.location },
              valuesToRemove: [cell.value.value],
            };
          }),
      );
    });
    return rv;
  }
}
