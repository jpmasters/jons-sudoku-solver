import { Grid, CellValueChange } from '../Grid';
import { SudokuSolverStrategy } from '../SudokuSolverOptions';
import { NakedSinglesSolver } from './NakedSinglesSolver';
import { HiddenPairsSolver } from './HiddenPairsSolver';
import { NakedPairsSolver } from './NakedPairsSolver';
import { PointingPairsSolver } from './PointingPairsSolver';
import { HiddenSinglesSolver } from './HiddenSinglesSolver';
import { NakedTriplesSolver } from './NakedTriplesSolver';

/**
 * Implements a class that keeps all of the solvers in one place to make it easier to work with them.
 */
export class SolverList {
  /**
   * A list of solvers including the entry point and order we want them run in
   */
  static solvers: { order: number; strategy: SudokuSolverStrategy; solve: (targetGrid: Grid) => CellValueChange[] }[] =
    [
      { order: 1, strategy: SudokuSolverStrategy.NakedSingles, solve: NakedSinglesSolver.solve },
      { order: 2, strategy: SudokuSolverStrategy.HiddenSingles, solve: HiddenSinglesSolver.solve },
      { order: 3, strategy: SudokuSolverStrategy.NakedPairs, solve: NakedPairsSolver.solve },
      { order: 4, strategy: SudokuSolverStrategy.HiddenPairs, solve: HiddenPairsSolver.solve },
      { order: 5, strategy: SudokuSolverStrategy.NakedTriples, solve: NakedTriplesSolver.solve },
      { order: 6, strategy: SudokuSolverStrategy.PointingPairs, solve: PointingPairsSolver.solve },
    ];
}
