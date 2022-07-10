import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { CellValueChange, Grid } from '../Grid';
import { Helpers } from '../Helpers';
import { SudokuAllPossibleValues } from '../ValueTypes';
import { SolverHelpers } from './SolverHelpers';

/**
 * Implements a Naked Triple solver strategy.
 * @see <a href="https://sudoku.org.uk/SolvingTechniques/NakedTriples.asp">Sudoku.org.uk</a>
 */
export class NakedTriplesSolver {
  /**
   * Searches the grid for Naked Triples and if it finds any, returns an
   * array of changes to apply to the target grid.
   * @param targetGrid The grid to solve.
   * @returns An array of changes to apply to the grid to solve it.
   */
  static solve(targetGrid: Grid): CellValueChange[] {
    return [
      ...SudokuAllPossibleValues.map((row) => NakedTriplesSolver.solveForBlock(targetGrid.row(row))).flat(),
      ...SudokuAllPossibleValues.map((column) => NakedTriplesSolver.solveForBlock(targetGrid.column(column))).flat(),
      ...SudokuAllPossibleValues.map((block) => NakedTriplesSolver.solveForBlock(targetGrid.block(block))).flat(),
    ];
  }

  /**
   * Runs the NakedTriple solver for a row, column or block.
   * @param block A reference to a row, column or block to process.
   * @returns A set of changes to apply to the target grid or an empty array if
   * no naked triples are found.
   */
  static solveForBlock(block: CellCollection): CellValueChange[] {
    // search the block for triples
    const grps: Cell[][] = SolverHelpers.scanBlock(block, 3, (cells) => {
      return new Set(cells.map((c) => c.value.potentialValues).flat()).size === 3;
    });

    const rv: CellValueChange[] = [];

    // for each of the triples we found
    grps.forEach((nakedTriple) => {
      rv.push(
        ...block.cells
          .filter((blockCell) => {
            // filter out cells that are part of the triple group as we're mot changing them
            return nakedTriple.every((tripleCell) => !Helpers.locationsMatch(tripleCell.location, blockCell.location));
          })
          .map<CellValueChange>((cell) => {
            // for the remainnig cells, create a change obect that removes potentials that are part of
            // the triple
            const triplePotentials = Array.from(new Set(nakedTriple.map((c) => c.value.potentialValues).flat()));
            return {
              location: { ...cell.location },
              valuesToRemove: triplePotentials
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
