import { SudokuAllPossibleValues, SudokuPossibleValue, SudokuPossibleValues } from './ValueTypes';

/**
 * This class represents a cell in a Sudoku grid and holds all the potential
 * values that the cell can have. It is designed to be immutable.
 */
export class CellValue {
  /**
   * Holds the vaue potentials as a fixed length array of booleans
   */
  private _valuePotentials: SudokuPossibleValue[];

  /**
   * Instantiates a new instance of a Sudoku grid cell. The cell is designed to
   * be immutable. If the cell is constructed without initial values, it will
   * create it with all potential values.
   *
   * @param value Optional initial cell value.
   */
  constructor(value: SudokuPossibleValues = SudokuAllPossibleValues) {
    this._valuePotentials = [...value].sort((a, b) => a - b);
  }

  /**
   * Returns a deep copy of the CellValue.
   * @returns A dseep copy of the CellValue.
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
    const rv = this.copy();
    values.forEach((val) => {
      if (rv._valuePotentials.includes(val)) {
        rv._valuePotentials.splice(
          rv._valuePotentials.findIndex((v) => v === val),
          1,
        );
      }
    });

    return rv;
  }

  // /**
  //  * Returns a copy of the CellValue with the specified potential removed.
  //  * @param values A list of potential values to add.
  //  * @returns A new CellValue with the updated potentials.
  //  */
  // addPotentials(values: SudokuPossibleValue[]): CellValue {
  //   const rv = new CellValue(
  //     this._valuePotentials.concat([...values]).filter((val, i, arr) => {
  //       return arr.findIndex((v) => v === val) === i;
  //     }),
  //   );

  //   return rv;
  // }

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
