import { CellCollection } from '../CellCollection';
import { Grid } from '../Grid';
import { SudokuAllPossibleValues, GridLocation, SudokuPossibleValue, CellValueChange } from '../ValueTypes';
import { ReducedValues, SolverHelpers } from './SolverHelpers';

export class HiddenSinglesSolver {
  static source: string = 'HiddenSinglesSolver';

  /**
   * Searches the grid for cells where the value only appears once in the row, column or block
   * and if it finds any, returns an array of changes to apply to the target grid.
   * @param targetGrid The grid to solve.
   * @returns An array of changes to apply to the grid to solve it.
   */
  static solve(targetGrid: Grid): CellValueChange[] {
    const rv: CellValueChange[] = [];

    [targetGrid.row.bind(targetGrid), targetGrid.column.bind(targetGrid), targetGrid.block.bind(targetGrid)].some(
      (fn) => {
        SudokuAllPossibleValues.some((v) => {
          rv.push(...HiddenSinglesSolver.solveForBlock(fn(v)));
          return rv.length;
        });
        return rv.length;
      },
    );

    return rv;
  }

  /**
   * Searches a given Row, Column or Block for cells where its value doesn't appear
   * in any of the other cells implying that it should have that value.
   * @param block A reference to a row, column or block that holds 9 unique values.
   * @returns An array of changes that can be applied back to the grid.
   */
  static solveForBlock(block: CellCollection): CellValueChange[] {
    const rv: CellValueChange[] = [];
    const reducedCells = SolverHelpers.reduceCells(block);

    SudokuAllPossibleValues.some((value) => {
      if (value in reducedCells) {
        if ((reducedCells[value] as ReducedValues[]).length === 1) {
          const location: GridLocation = (reducedCells[value] as ReducedValues[]).at(0) as GridLocation;
          const newVals: SudokuPossibleValue[] = block
            .cellAtLocation({ column: location.column, row: location.row })
            .potentialValues.filter((cv) => cv !== value);
          rv.push({ source: HiddenSinglesSolver.source, location, valuesToRemove: newVals });
        }
      }
      return rv.length;
    });

    return rv;
  }
}
