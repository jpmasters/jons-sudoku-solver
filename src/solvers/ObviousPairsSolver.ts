import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { Grid, CellValueChange } from '../Grid';
import { Helpers } from '../Helpers';
import { SudokuAllPossibleValues } from '../ValueTypes';
import { GroupedValues } from './SolverHelpers';

export class ObviousPairsSolver {
  /**
   * Searches the values with a single potential and if it finds any, returns an
   * array of changes to apply to the target grid.
   * @param targetGrid The grid to solve.
   * @returns An array of changes to apply to the grid to solve it.
   */
  static solve(targetGrid: Grid): CellValueChange[] {
    return [
      ...SudokuAllPossibleValues.map((row) => ObviousPairsSolver.findObviousPairs(targetGrid.row(row))).flat(),
      ...SudokuAllPossibleValues.map((column) => ObviousPairsSolver.findObviousPairs(targetGrid.column(column))).flat(),
      ...SudokuAllPossibleValues.map((block) => ObviousPairsSolver.findObviousPairs(targetGrid.block(block))).flat(),
    ];
  }

  /**
   * Searches a given row, column or block for obvious pairs and returns an
   * array of objects to remove unneeded potentials from the rest of the cells.
   * @param block A reference to a row, column or block to process.
   * @returns An array of GridDifference objects to apply back to the Grid.
   */
  static findObviousPairs(block: CellCollection): CellValueChange[] {
    // all cells with 2 potential values only
    const cellsWithTwoPotentials: Cell[] = block.cells
      .filter((cell) => cell.value.potentialValues.length === 2)
      .filter((cell1, _, allCells) => {
        return (
          allCells.filter((c) => Helpers.arrayHasSameMembers(cell1.value.potentialValues, c.value.potentialValues))
            .length === 2
        );
      });

    const groupedPairs: GroupedValues[] = cellsWithTwoPotentials.reduce<GroupedValues[]>((prev, curr) => {
      const i: number = prev.findIndex((gv) => Helpers.arrayHasSameMembers(gv.value, curr.value.potentialValues));
      if (i === -1) {
        prev.push({ value: curr.value.potentialValues, locations: [curr.location] });
      } else {
        prev[i].locations.push(curr.location);
      }
      return prev;
    }, []);

    // convert the pairs into changes
    const rv: CellValueChange[] = groupedPairs.reduce<CellValueChange[]>((prev, curr) => {
      const cellsToChange: Cell[] = block.cells
        .filter((c) => {
          return !(
            Helpers.locationsMatch(c.location, curr.locations[0]) ||
            Helpers.locationsMatch(c.location, curr.locations[1])
          );
        })
        .filter((cell) => cell.value.potentialValues.some((v) => curr.value.includes(v)));

      const newdiffs = cellsToChange.map<CellValueChange>((cell) => {
        return {
          location: { ...cell.location },
          valuesToRemove: cell.value.potentialValues.filter((v) => curr.value.includes(v)),
        };
      });

      prev.push(...newdiffs);

      return prev;
    }, []);

    return rv;
  }
}
