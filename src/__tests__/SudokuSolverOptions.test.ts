import { deriveOptions, SudokuSolverOptions, SudokuSolverStrategy } from '../SudokuSolverOptions';

test('SudokuSolverOptions provides the correct defaults if not provided', () => {
  const providedOptions: SudokuSolverOptions = {};
  const derivedOptions = deriveOptions(providedOptions);
  const expected: SudokuSolverOptions = {
    includeBacktracking: true,
    includeStrategies: [
      SudokuSolverStrategy.NakedSingles,
      SudokuSolverStrategy.HiddenSingles,
      SudokuSolverStrategy.NakedPairs,
      SudokuSolverStrategy.HiddenPairs,
      SudokuSolverStrategy.NakedTriples,
      SudokuSolverStrategy.HiddenTriples,
      SudokuSolverStrategy.NakedQuads,
      SudokuSolverStrategy.HiddenQuads,
      SudokuSolverStrategy.PointingPairs,
      SudokuSolverStrategy.IntersectionRemoval,
    ],
  };

  expect(derivedOptions).toStrictEqual(expected);
});

test('SudokuSolverOptions includeBacktracking overridden to false', () => {
  const providedOptions: SudokuSolverOptions = { includeBacktracking: false };
  const derivedOptions = deriveOptions(providedOptions);
  const expected: SudokuSolverOptions = {
    includeBacktracking: false,
    includeStrategies: [
      SudokuSolverStrategy.NakedSingles,
      SudokuSolverStrategy.HiddenSingles,
      SudokuSolverStrategy.NakedPairs,
      SudokuSolverStrategy.HiddenPairs,
      SudokuSolverStrategy.NakedTriples,
      SudokuSolverStrategy.HiddenTriples,
      SudokuSolverStrategy.NakedQuads,
      SudokuSolverStrategy.HiddenQuads,
      SudokuSolverStrategy.PointingPairs,
      SudokuSolverStrategy.IntersectionRemoval,
    ],
  };

  expect(derivedOptions).toStrictEqual(expected);
});

test('SudokuSolverOptions includeBacktracking overridden to true', () => {
  const providedOptions: SudokuSolverOptions = { includeBacktracking: true };
  const derivedOptions = deriveOptions(providedOptions);
  const expected: SudokuSolverOptions = {
    includeBacktracking: true,
    includeStrategies: [
      SudokuSolverStrategy.NakedSingles,
      SudokuSolverStrategy.HiddenSingles,
      SudokuSolverStrategy.NakedPairs,
      SudokuSolverStrategy.HiddenPairs,
      SudokuSolverStrategy.NakedTriples,
      SudokuSolverStrategy.HiddenTriples,
      SudokuSolverStrategy.NakedQuads,
      SudokuSolverStrategy.HiddenQuads,
      SudokuSolverStrategy.PointingPairs,
      SudokuSolverStrategy.IntersectionRemoval,
    ],
  };

  expect(derivedOptions).toStrictEqual(expected);
});

test('SudokuSolverOptions includeStrategies overridden', () => {
  const providedOptions: SudokuSolverOptions = {
    includeStrategies: [SudokuSolverStrategy.HiddenPairs, SudokuSolverStrategy.PointingPairs],
  };
  const derivedOptions = deriveOptions(providedOptions);
  const expected: SudokuSolverOptions = {
    includeBacktracking: true,
    includeStrategies: [SudokuSolverStrategy.HiddenPairs, SudokuSolverStrategy.PointingPairs],
  };

  expect(derivedOptions).toStrictEqual(expected);
});

test('SudokuSolverOptions includeStrategies overridden to empty', () => {
  const providedOptions: SudokuSolverOptions = {
    includeStrategies: [],
  };
  const derivedOptions = deriveOptions(providedOptions);
  const expected: SudokuSolverOptions = {
    includeBacktracking: true,
    includeStrategies: [],
  };

  expect(derivedOptions).toStrictEqual(expected);
});
