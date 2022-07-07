import { SudokuAllPossibleValues, SudokuPossibleValue, SudokuPossibleValues } from './ValueTypes';

/**
 * This class represents a cell in a Sudoku grid and holds all the potential
 * values that the cell can have. It is designed to be immutable. The reasoning is
 * that humans solve Sudoku puzzles by eliminating possibilities. This library works
 * the same way.
 */
export class CellValue {
  /**
   * Holds the vaue potentials as an array of possible Sudoku values (1-9).
   */
  private _valuePotentials: SudokuPossibleValue[];

  /**
   * Instantiates a new instance of a Sudoku grid cell. The cell is designed to
   * be immutable. If the cell is constructed without initial values, it will
   * create it with all potential values.
   *
   * @param values Optional initial cell value.
   */
  constructor(values: SudokuPossibleValues = SudokuAllPossibleValues) {
    this._valuePotentials = [...values].sort((a, b) => a - b);
  }

  /**
   * Returns a deep copy of the CellValue.
   * @returns A reference to a new CellValue object.
   */
  copy(): CellValue {
    const rv = new CellValue();
    rv._valuePotentials = [...this._valuePotentials];
    return rv;
  }

  /**
   * Returns a copy of the CellValue with the specified potential removed.
   * @param values The potential values to remove from the value.
   * @returns A new CellValue with the updated potentials.
   */
  removePotentials(values: SudokuPossibleValue[]): CellValue {
    return new CellValue(this._valuePotentials.filter((v) => !values.includes(v)));
  }

  /**
   * Returns the potential values as an array of SudokuPossibleValues.
   */
  get potentialValues(): SudokuPossibleValue[] {
    return [...this._valuePotentials];
  }

  /**
   * Returns a value indicating whether or not the cell has a known value.
   */
  get hasKnownValue(): boolean {
    return this._valuePotentials.length === 1;
  }

  /**
   * Gets the value of the cell if it has 100% settled. Throws an exception if not.
   */
  get value(): SudokuPossibleValue {
    if (!this.hasKnownValue) throw Error('Cell value is not known. Check hasKnownValue first.');

    return this._valuePotentials[0];
  }
}
