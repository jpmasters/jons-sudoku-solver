import { GridLocation, SudokuAllPossibleValues, SudokuPossibleValue, SudokuPossibleValues } from './ValueTypes';

/**
 * Describes a cell within a Sudoku grid.
 */
export class Cell {
  /**
   * Instantiates a new instance of a Cell. You must provide a location
   * for the cell. You can also specify an initial value. If you don't
   * then the cell is initialised to all potential values.
   * @param location The location of the cel in the grid.
   * @param values Optional initial cell potential values.
   */
  constructor(location: GridLocation, values: SudokuPossibleValues = SudokuAllPossibleValues) {
    this._valuePotentials = [...values].sort((a, b) => a - b);
    this.location = { ...location };
  }

  /**
   * Holds the vaue potentials as an array of possible Sudoku values (1-9).
   */
  private _valuePotentials: SudokuPossibleValue[];

  /**
   * Gets the location for the cell.
   */
  readonly location: GridLocation;

  /**
   * Returns a deep copy of the Cell.
   * @returns A deep copy of the Cell.
   */
  copy(): Cell {
    return new Cell({ ...this.location }, [...this._valuePotentials]);
  }

  /**
   * Returns a copy of the CellValue with the specified potential removed.
   * @param values The potential values to remove from the value.
   * @returns A new CellValue with the updated potentials.
   */
  removePotentials(values: SudokuPossibleValue[]): Cell {
    return new Cell(
      { ...this.location },
      this._valuePotentials.filter((v) => !values.includes(v)),
    );
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
