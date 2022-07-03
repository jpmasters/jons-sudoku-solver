import { SudokuAllPossibleValues, SudokuPossibleValue, SudokuPossibleValues } from './ValueTypes';

/**
 * This class represents a cell in a Sudoku grid and holds all the potential
 * values that the cell can have. It is designed to be immutable.
 * TODO: Might be better to reimplement this class to use an array of values rather than an array of flags.
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
    this._valuePotentials = Array(9).fill(false);
    value.forEach((v) => {
      this._valuePotentials[v - 1] = true;
    });
  }

  /**
   * Returns a deep copy of the CellValue.
   * @returns A dseep copy of the CellValue.
   */
  copy(): CellValue {
    let rv = new CellValue();
    rv._valuePotentials = [...this._valuePotentials];
    return rv;
  }

  /**
   * Returns a copy of the CellValue with the specified potential removed.
   * @param value The potential to remove from the value.
   * @returns A new CellValue with the updated potentials.
   */
  removePotential(value: SudokuPossibleValue): CellValue {
    let rv = this.copy();
    rv._valuePotentials[value - 1] = false;
    return rv;
  }

  /**
   * Gets the 9 possible cell value probabilities (0 - 1) as a zero based array.
   * E.g. if the probability that the cell contains a 3 is 50% then the value at
   * index 4 contains 0.5.
   */
  get valuePotentials(): boolean[] {
    return [...this._valuePotentials];
  }

  private _valuePotentials: boolean[];

  /**
   * Returns a value indicating whether or not the cell has a known value.
   */
  get hasKnownValue(): boolean {
    return this._valuePotentials.filter((v) => v).length === 1;
  }

  /**
   * Gets the value of the cell if it has 100% settled. Throws an exception if not.
   */
  get value(): SudokuPossibleValue {
    if (!this.hasKnownValue) throw Error('Cell value is not known. Check hasKnownValue first.');

    // search for a potential of 100%
    const i = this._valuePotentials.findIndex((v) => v);

    // otherwise return the cell value
    return (i + 1) as unknown as SudokuPossibleValue;
  }
}
