import { CellCollection } from '../CellCollection';
import { Grid, CellValueChange } from '../Grid';
import { Helpers } from '../Helpers';
import { SudokuAllPossibleValues } from '../ValueTypes';
import { SolverHelpers } from './SolverHelpers';

export class NakedPairsSolver {
  /**
   * Searches the values with a single potential and if it finds any, returns an
   * array of changes to apply to the target grid.
   * @param targetGrid The grid to solve.
   * @returns An array of changes to apply to the grid to solve it.
   */
  static solve(targetGrid: Grid): CellValueChange[] {
    return [
      ...SudokuAllPossibleValues.map((row) => NakedPairsSolver.solveForBlock(targetGrid.row(row))).flat(),
      ...SudokuAllPossibleValues.map((column) => NakedPairsSolver.solveForBlock(targetGrid.column(column))).flat(),
      ...SudokuAllPossibleValues.map((block) => NakedPairsSolver.solveForBlock(targetGrid.block(block))).flat(),
    ];
  }

  /**
   * Searches a given row, column or block for obvious pairs and returns an
   * array of objects to remove unneeded potentials from the rest of the cells.
   * @param block A reference to a row, column or block to process.
   * @returns An array of GridDifference objects to apply back to the Grid.
   */
  static solveForBlock(block: CellCollection): CellValueChange[] {
    const rv: CellValueChange[] = [];

    // search the block for triples
    SolverHelpers.scanBlock(block, 2, (cells) => {
      return new Set(cells.map((c) => c.value.potentialValues).flat()).size === 2;
    })
      // for each of the triples we found
      .forEach((nakedGroup) => {
        rv.push(
          ...block.cells
            .filter((blockCell) => {
              // filter out cells that are part of the triple group as we're mot changing them
              return nakedGroup.every((nakedCell) => !Helpers.locationsMatch(nakedCell.location, blockCell.location));
            })
            .map<CellValueChange>((cell) => {
              // for the remainnig cells, create a change obect that removes potentials that are part of
              // the triple
              const nakedCellPotentials = Array.from(new Set(nakedGroup.map((c) => c.value.potentialValues).flat()));
              return {
                location: { ...cell.location },
                valuesToRemove: nakedCellPotentials
                  .filter((p) => cell.value.potentialValues.includes(p))
                  .sort((a, b) => a - b),
              };
            })
            // finally filter out empty changes
            .filter((cvc) => cvc.valuesToRemove.length),
        );
      });

    return rv;
  }
}
