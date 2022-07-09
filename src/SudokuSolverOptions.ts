export enum SudokuSolverStrategy {
  CollapsedValues,
  HiddenPairs,
  ObviousPairs,
  PointingPairs,
  SingleValues,
}

export interface SudokuSolverOptions {
  includeStrategies?: SudokuSolverStrategy[];
  includeBacktracking?: boolean;
}

export function deriveOptions(providedOptions: SudokuSolverOptions): SudokuSolverOptions {
    return {
      includeBacktracking: true,
      includeStrategies: Object.values(SudokuSolverStrategy).filter(
        (v) => typeof v !== 'string',
      ) as SudokuSolverStrategy[],
      ...providedOptions,
    };
}