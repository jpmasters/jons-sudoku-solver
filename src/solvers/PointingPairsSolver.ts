import { CellCollection } from '../CellCollection';
import { Grid, CellValueChange } from '../Grid';
import { Helpers } from '../Helpers';
import { GridLocation, SudokuAllPossibleValues } from '../ValueTypes';
import { ReducedValues, SolverHelpers } from './SolverHelpers';

export class PointingPairsSolver {
  /**
   * Searches the grid for instances of Pointing Pairs and if it finds any, returns an
   * array of changes to apply to the target grid.
   * @param targetGrid The grid to solve.
   * @returns An array of changes to apply to the grid to solve it.
   */
  static solve(targetGrid: Grid): CellValueChange[] {
    const rv: CellValueChange[] = [];
    SudokuAllPossibleValues.map((b) => targetGrid.block(b)).forEach((block) => {
      block.cells
        .filter((cell, i, arr) => {
          return arr.findIndex((c) => cell.location.row === c.location.row) === i;
        })
        .forEach((cell) => {
          const changes = PointingPairsSolver.solveForBlockAndRow(block, targetGrid.row(cell.location.row));
          rv.push(...changes);
        });
    });
    
    return rv;
  }

  /**
   * Solves for pointing pairs in the provided block and row.
   * @param blockCells The cells in the nonet block to check for candidates.
   * @param rowCells The cells in the row to check for candidates.
   * @returns An array of CellValueChanges to apply to the grid.
   */
  static solveForBlockAndRow(blockCells: CellCollection, rowCells: CellCollection): CellValueChange[] {
    const reducedCells: ReducedValues = SolverHelpers.reduceCells(blockCells);
    const rv: CellValueChange[] = SudokuAllPossibleValues.filter((v) => reducedCells[v]?.length === 2)
      .filter((v) => {
        const locs: GridLocation[] = reducedCells[v] as GridLocation[];
        return locs[0].row === locs[1].row;
      })
      .map<CellValueChange[]>((v) => {
        const locs: GridLocation[] = reducedCells[v] as GridLocation[];
        const rv: CellValueChange[] = rowCells.cells
          .filter((cell) => cell.location.row === locs[0].row)
          .filter((cell) => !Helpers.locationsMatch(cell.location, locs[0]))
          .filter((cell) => !Helpers.locationsMatch(cell.location, locs[1]))
          .map<CellValueChange>((cell) => {
            return {
              location: { ...cell.location },
              valuesToRemove: cell.value.potentialValues.includes(v) ? [v] : [],
            };
          });

        return rv;
      })
      .flat()
      .filter((vc) => vc.valuesToRemove.length);
    return rv;
  }
}
