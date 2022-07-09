import { Grid, CellValueChange } from '../Grid';
import { SudokuSolverStrategy } from '../SudokuSolverOptions';
import { CollapsedValueSolver } from './CollapsedValuesSolver';
import { HiddenPairsSolver } from './HiddenPairsSolver';
import { ObviousPairsSolver } from './ObviousPairsSolver';
import { PointingPairsSolver } from './PointingPairsSolver';
import { SingleValuesSolver } from './SingleValuesSolver';

/**
 * Implements a class that keeps all of the solvers in one place to make it easier to work with them.
 */
export class SolverList {
  /**
   * A list of solvers including the entry point and order we want them run in
   */
  static solvers: { order: number; strategy: SudokuSolverStrategy; solve: (targetGrid: Grid) => CellValueChange[] }[] =
    [
      { order: 1, strategy: SudokuSolverStrategy.CollapsedValues, solve: CollapsedValueSolver.solve },
      { order: 2, strategy: SudokuSolverStrategy.SingleValues, solve: SingleValuesSolver.solve },
      { order: 3, strategy: SudokuSolverStrategy.ObviousPairs, solve: ObviousPairsSolver.solve },
      { order: 4, strategy: SudokuSolverStrategy.HiddenPairs, solve: HiddenPairsSolver.solve },
      { order: 5, strategy: SudokuSolverStrategy.PointingPairs, solve: PointingPairsSolver.solve },
    ];
}