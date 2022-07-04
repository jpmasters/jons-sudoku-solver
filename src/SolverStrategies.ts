import { CellCollection } from './CellCollection';
import { GridDifference } from './Grid';
import { GridLocation, SudokuAllPossibleValues, SudokuPossibleValue, SudokuPossibleValues } from './ValueTypes';

/**
 * Structure to help reduce found values into values and counts at a location.
 */
interface ReducedValues {
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
 * Implements a class that holds various strategies for solving puzzles.
 */
export class SolverStrategies {
  /**
   * Searches a given Row, Column or Block for cells where its value doesn't appear
   * in any of the other cells implying that it should have that value.
   * @param block A reference to a row, column or block that holds 9 unique values.
   * @returns An array of changes that can be applied back to the grid.
   */
  static onlyValueInBlock(block: CellCollection): GridDifference[] {
    const rv: GridDifference[] = [];
    const reducedCells = block.values
      .filter((cell) => !cell.value.hasKnownValue)
      .map((cell) => {
        return { location: { ...cell.location }, values: cell.value.potentialValues };
      })
      .reduce<ReducedValues>((prev, curr) => {
        curr.values.forEach((val) => {
          const newLocs = (prev[val] ? prev[val] : []) as GridLocation[];
          newLocs.push(curr.location);
          prev[val] = newLocs;
        });

        return prev;
      }, {});

    SudokuAllPossibleValues.forEach((value) => {
      if (value in reducedCells) {
        if ((reducedCells[value] as ReducedValues[]).length === 1) {
          const location: GridLocation = (reducedCells[value] as ReducedValues[]).at(0) as GridLocation;
          rv.push({ location, value });
        }
      }
    });

    return rv;
  }
}
