import { CellCollection } from '../CellCollection';
import { Grid } from '../Grid';
import { Helpers } from '../Helpers';
import { CellValueChange, GridLocation, SudokuAllPossibleValues } from '../ValueTypes';
import { ReducedValues, SolverHelpers } from './SolverHelpers';

export class PointingPairsSolver {
  /**
   * The name of the solver to insert into change information.
   */
  static source: string = 'PointingPairsSolver';

  /**
   * Searches the grid for instances of Pointing Pairs and if it finds any, returns an
   * array of changes to apply to the target grid.
   * @param targetGrid The grid to solve.
   * @returns An array of changes to apply to the grid to solve it.
   */
  static solve(targetGrid: Grid): CellValueChange[] {
    const rv: CellValueChange[] = [];
    SudokuAllPossibleValues.map((b) => targetGrid.block(b)).forEach((block) => {
      ['row', 'column'].forEach((rc) => {
        const rowOrColumn: 'row' | 'column' = rc as 'row' | 'column';
        block.cells
          .filter((cell, i, arr) => {
            return arr.findIndex((c) => cell.location[rowOrColumn] === c.location[rowOrColumn]) === i;
          })
          .forEach((cell) => {
            const changes = PointingPairsSolver.solveForBlockAndRow(
              block,
              targetGrid.row(cell.location[rowOrColumn]),
              rowOrColumn,
            );
            rv.push(...changes);
          });
      });
    });

    return rv;
  }

  /**
   * Solves for pointing pairs in the provided block and row.
   * @param blockCells The cells in the nonet block to check for candidates.
   * @param rowOrColumnCells The cells in the row or column to check for candidates.
   * @param rowOrColumn If 'row' it will check for rows and if 'column' it will check for columns.
   * @returns An array of CellValueChanges to apply to the grid.
   */
  static solveForBlockAndRow(
    blockCells: CellCollection,
    rowOrColumnCells: CellCollection,
    rowOrColumn: 'row' | 'column',
  ): CellValueChange[] {
    const reducedCells: ReducedValues = SolverHelpers.reduceCells(blockCells);
    const rv: CellValueChange[] = SudokuAllPossibleValues.filter((v) => reducedCells[v]?.length === 2)
      .filter((v) => {
        const locs: GridLocation[] = reducedCells[v] as GridLocation[];
        return locs[0][rowOrColumn] === locs[1][rowOrColumn];
      })
      .map<CellValueChange[]>((v) => {
        const locs: GridLocation[] = reducedCells[v] as GridLocation[];
        return rowOrColumnCells.cells
          .filter((cell) => cell.location[rowOrColumn] === locs[0][rowOrColumn])
          .filter((cell) => !Helpers.locationsMatch(cell.location, locs[0]))
          .filter((cell) => !Helpers.locationsMatch(cell.location, locs[1]))
          .map<CellValueChange>((cell) => {
            return {
              source: PointingPairsSolver.source,
              location: { ...cell.location },
              valuesToRemove: cell.potentialValues.includes(v) ? [v] : [],
            };
          });
      })
      .flat()
      .filter((vc) => vc.valuesToRemove.length);
    return rv;
  }
}
