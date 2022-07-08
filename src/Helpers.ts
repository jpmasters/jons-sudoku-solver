import { Cell } from './Cell';
import { GridLocation, SudokuAllPossibleValues, SudokuPossibleValue, SudokuPossibleValues } from './ValueTypes';

/**
 * Implements a set of Helper methods for solving the puzzles.
 * TODO: Document them!
 */
export class Helpers {
  static arrayContainsAll(arr1: SudokuPossibleValues, arr2: SudokuPossibleValues): boolean {
    return arr2.every((arr2Item) => arr1.includes(arr2Item));
  }

  static arrayHasSameMembers(arr1: SudokuPossibleValues, arr2: SudokuPossibleValues): boolean {
    return Helpers.arrayContainsAll(arr1, arr2) && Helpers.arrayContainsAll(arr2, arr1);
  }

  static locationsMatch(loc1: GridLocation, loc2: GridLocation): boolean {
    return loc1.column === loc2.column && loc1.row === loc2.row;
  }

  static sudokuValuesWithout(exclusions: SudokuPossibleValues): SudokuPossibleValue[] {
    return SudokuAllPossibleValues.filter((v) => !exclusions.includes(v));
  }

  static locationArraysMatch(loc1: GridLocation[] | undefined, loc2: GridLocation[] | undefined): boolean {
    if (!loc1 || !loc2) return false;

    if (loc1.length !== loc2.length) return false;

    return loc1.every((l1) => loc2.findIndex((l2) => Helpers.locationsMatch(l1, l2)) !== -1);
  }

  static orderCells(cells: Cell[]): Cell[] {
    // sort by row and then by column
    return cells.sort((a, b) => {
      return a.location.row !== b.location.row
        ? a.location.row - b.location.row
        : a.location.column - b.location.column;
    });
  }
}
