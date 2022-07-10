import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { CellValueChange } from '../Grid';
import { Helpers } from '../Helpers';
import { SolverHelpers } from './SolverHelpers';

export class NakedTriplesSolver {
  static solveForBlock(block: CellCollection): CellValueChange[] {
    const grps: Cell[][] = SolverHelpers.scanBlock(block, 3, (cells) => {
      return new Set(cells.map((c) => c.value.potentialValues).flat()).size === 3;
    });

    const rv: CellValueChange[] = [];

    grps.forEach((nakedTriple) => {
      rv.push(
        ...block.cells
          .filter((blockCell) => {
            return nakedTriple.every((tripleCell) => !Helpers.locationsMatch(tripleCell.location, blockCell.location));
          })
          .map<CellValueChange>((cell) => {
            const triplePotentials = Array.from(new Set(nakedTriple.map((c) => c.value.potentialValues).flat()));
            return {
              location: { ...cell.location },
              valuesToRemove: triplePotentials
                .filter((p) => cell.value.potentialValues.includes(p))
                .sort((a, b) => a - b),
            };
          })
          .filter((cvc) => cvc.valuesToRemove.length),
      );
    });

    return rv;
  }
}
