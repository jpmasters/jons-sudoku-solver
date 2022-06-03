import { SudokuAllPossibleValues, SudokuPossibleValue, SudokuPossibleValues } from './SudokuValueTypes';

/**
 * This class represents a cell in a Sudoku grid and holds all the potential
 * values that the cell can have. It is designed to be immutable.
 */
export class CellValue {
  /**
   * Instantiates a new instance of a Sudoku grid cell. The cell is designed to
   * be immutable. If the cell is constructed without initial values, it will
   * create it with all potential values.
   *
   * @param value Optional initial cell value.
   */
  constructor(value: SudokuPossibleValues = SudokuAllPossibleValues) {
    this.valuePotentials = Array(9).fill(0);
    value.forEach((v, i, a) => {
      this.valuePotentials[v - 1] = 1 / a.length;
    });
  }

  /**
   * Holds the 9 possible cell value probabilities (0 - 1) as a zero based array.
   * E.g. if the probability that the cell contains a 3 is 50% then the value at
   * index 4 contains 0.5.
   */
  readonly valuePotentials: number[];

  /**
   * Returns a value indicating whether or not the cell has a known value.
   */
  get hasKnownValue(): boolean {
    return this.valuePotentials.includes(1);
  }

  /**
   * Gets the value of the cell if it has 100% settled. Throws an exception if not.
   */
  get value(): SudokuPossibleValue {
    // search for a potential of 100%
    const i = this.valuePotentials.findIndex((v) => v === 1);

    // if we don't find it, throw an exception, it was called before it had settled
    if (i === -1) throw Error('Cell value is not known. Check hasKnownValue first.');

    // otherwise return the cell value
    return (i + 1) as unknown as SudokuPossibleValue;
  }
}
