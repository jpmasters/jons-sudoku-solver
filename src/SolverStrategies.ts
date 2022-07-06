import { Cell } from './Cell';
import { CellCollection } from './CellCollection';
import { GridDifference } from './Grid';
import { Helpers } from './Helpers';
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

/***
 * Useful structure for grouping values by location.
 */
interface GroupedValues {
  value: SudokuPossibleValue[];
  locations: GridLocation[];
}

/**
 * Implements a class that holds various strategies for solving puzzles.
 */
export class SolverStrategies {
  /**
   * Pivots the cell values into an object that provides the frequency and locations
   * of values in the specified row, column or block.
   * @param block A reference to a Grid Row, Column or Block.
   * @returns A reference to a ReducedValues object that shows value frequency.
   */
  private static reduceCells(block: CellCollection): ReducedValues {
    return block.cells
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
  }

  /**
   * Searches a given Row, Column or Block for cells where its potentials have collapsed into a
   * single value. It then returns an array of objects to remove the potential to other
   * cells in the block.
   * @param block A reference to a row, column or block that holds 9 unique values.
   * @returns An array of changes that can be applied back to the grid.
   */
  static findCollapsedValues(block: CellCollection): GridDifference[] {
    const cellsWithKnownValues = block.cells.filter((cell) => cell.value.hasKnownValue);
    const rv: GridDifference[] = [];
    cellsWithKnownValues.forEach((cell) => {
      rv.push(
        ...block.cells
          .filter(
            (bc) =>
              !Helpers.locationsMatch(bc.location, cell.location) &&
              bc.value.potentialValues.includes(cell.value.value),
          )
          .map<GridDifference>((bc) => {
            return {
              location: { ...bc.location },
              valuesToRemove: [cell.value.value],
            };
          }),
      );
    });
    return rv;
  }

  /**
   * Searches a given Row, Column or Block for cells where its value doesn't appear
   * in any of the other cells implying that it should have that value.
   * @param block A reference to a row, column or block that holds 9 unique values.
   * @returns An array of changes that can be applied back to the grid.
   */
  static findSingleValues(block: CellCollection): GridDifference[] {
    const rv: GridDifference[] = [];
    const reducedCells = SolverStrategies.reduceCells(block);

    SudokuAllPossibleValues.forEach((value) => {
      if (value in reducedCells) {
        if ((reducedCells[value] as ReducedValues[]).length === 1) {
          const location: GridLocation = (reducedCells[value] as ReducedValues[]).at(0) as GridLocation;
          const newVals: SudokuPossibleValue[] = block
            .cellAtLocation({ column: location.column, row: location.row })
            .value.potentialValues.filter((cv) => cv !== value);
          rv.push({ location, valuesToRemove: newVals });
        }
      }
    });

    return rv;
  }

  /**
   * Searches a given row, column or block for hiddden pairs and returns an
   * array of objects to remove unneeded potentials in those pairs.
   * @param block A reference to a row, column or block to process.
   * @returns An array of GridDifference objects to apply back to the Grid.
   */
  static findHiddenPairs(block: CellCollection): GridDifference[] {
    const rv: GridDifference[] = [];
    const reducedCells = SolverStrategies.reduceCells(block);

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
          .map<GridDifference>((cell) => {
            const vr: SudokuPossibleValue[] = cell.value.potentialValues.filter((v) => !pairs.includes(v));
            return { location: { ...cell.location }, valuesToRemove: [...vr] };
          })
          .filter((diff) => diff.valuesToRemove.length),
      );
    }

    return rv;
  }

  /**
   * Searches a given row, column or block for obvious pairs and returns an
   * array of objects to remove unneeded potentials from the rest of the cells.
   * @param block A reference to a row, column or block to process.
   * @returns An array of GridDifference objects to apply back to the Grid.
   */
  static findObviousPairs(block: CellCollection): GridDifference[] {
    // all cells with 2 potential values only
    let cellsWithTwoPotentials: Cell[] = block.cells
      .filter((cell) => cell.value.potentialValues.length === 2)
      .filter((cell1, _, allCells) => {
        return (
          allCells.filter((c) => Helpers.arrayHasSameMembers(cell1.value.potentialValues, c.value.potentialValues))
            .length === 2
        );
      });

    let groupedPairs: GroupedValues[] = cellsWithTwoPotentials.reduce<GroupedValues[]>((prev, curr) => {
      let i: number = prev.findIndex((gv) => Helpers.arrayHasSameMembers(gv.value, curr.value.potentialValues));
      if (i === -1) {
        prev.push({ value: curr.value.potentialValues, locations: [curr.location] });
      } else {
        prev[i].locations.push(curr.location);
      }
      return prev;
    }, []);

    // convert the pairs into changes
    const rv: GridDifference[] = groupedPairs.reduce<GridDifference[]>((prev, curr) => {
      const cellsToChange: Cell[] = block.cells
        .filter((c) => {
          return !(
            Helpers.locationsMatch(c.location, curr.locations[0]) ||
            Helpers.locationsMatch(c.location, curr.locations[1])
          );
        })
        .filter((cell) => cell.value.potentialValues.some((v) => curr.value.includes(v)));

      const newdiffs = cellsToChange.map<GridDifference>((cell) => {
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
