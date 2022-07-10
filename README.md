# Jon's Sudoku Solver

This package is a work in progress library to solve classic 9x9 Sudoku puzzles.

Most Sudoku solvers implement a backtracking algorithm which guarantees a solution but can take a long time to get there.

This package can do that however before it does, it tries a number of methods human Sudoku solvers would try first, to reduce the work the backtracking algorithm needs to perform.

For many easy and intermediate level puzzles, it can reach a solution without needing to do any backtracking or recursion at all. This _should_ make things a lot faster and less processor hungry.

This is just a quick spare / vacation time project but I am hoping to extend the library to include more sophisticated solvers and perhaps features that might make it a useful starting point to build a Sudoku game.

If you have any feedback, ideas, comments [please feel free to let me know](https://github.com/jpmasters/jons-sudoku-solver/discussions). I can't promise I'll be able to get back to you straightaway but I'll do my best!

## Install from NPM

```
npm i jons-sudoku-solver
```

## Usage

The most basic usage in Javascript is to import and use the package as follows.

```javascript
const { SudokuSolver } = require('jons-sudoku-solver');

testPuzzle = [
  [0, 9, 6, 0, 0, 0, 0, 3, 0],
  [0, 0, 8, 0, 0, 0, 0, 0, 0],
  [0, 5, 0, 2, 0, 4, 0, 9, 0],
  [0, 0, 1, 6, 7, 2, 0, 0, 0],
  [8, 0, 0, 0, 0, 0, 3, 0, 0],
  [0, 0, 9, 0, 0, 0, 0, 0, 0],
  [0, 0, 2, 0, 1, 0, 8, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 4],
  [0, 0, 0, 0, 0, 8, 1, 6, 5],
];

solvedPuzzle = SudokuSolver.solve(testPuzzle);

console.table(solvedPuzzle);
```

This code generates the output:

```bash
┌─────────┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
│ (index) │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │
├─────────┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
│    0    │ 4 │ 9 │ 6 │ 1 │ 5 │ 7 │ 2 │ 3 │ 8 │
│    1    │ 2 │ 1 │ 8 │ 3 │ 9 │ 6 │ 5 │ 4 │ 7 │
│    2    │ 7 │ 5 │ 3 │ 2 │ 8 │ 4 │ 6 │ 9 │ 1 │
│    3    │ 5 │ 3 │ 1 │ 6 │ 7 │ 2 │ 4 │ 8 │ 9 │
│    4    │ 8 │ 2 │ 7 │ 5 │ 4 │ 9 │ 3 │ 1 │ 6 │
│    5    │ 6 │ 4 │ 9 │ 8 │ 3 │ 1 │ 7 │ 5 │ 2 │
│    6    │ 9 │ 6 │ 2 │ 4 │ 1 │ 5 │ 8 │ 7 │ 3 │
│    7    │ 1 │ 8 │ 5 │ 7 │ 6 │ 3 │ 9 │ 2 │ 4 │
│    8    │ 3 │ 7 │ 4 │ 9 │ 2 │ 8 │ 1 │ 6 │ 5 │
└─────────┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
```

The SudokuSolver.solve() method can also take optional parameters to allow the calling application to control which solvers should be included in the solving process. You can also control whether or not you want to use the Backtracking solver to finish off the puzzle if the solvers don't get the job done.

```javascript
const { SudokuSolver, SudokuSolverStrategy } = require('jons-sudoku-solver');

testPuzzle = [
  [0, 9, 6, 0, 0, 0, 0, 3, 0],
  [0, 0, 8, 0, 0, 0, 0, 0, 0],
  [0, 5, 0, 2, 0, 4, 0, 9, 0],
  [0, 0, 1, 6, 7, 2, 0, 0, 0],
  [8, 0, 0, 0, 0, 0, 3, 0, 0],
  [0, 0, 9, 0, 0, 0, 0, 0, 0],
  [0, 0, 2, 0, 1, 0, 8, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 4],
  [0, 0, 0, 0, 0, 8, 1, 6, 5],
];

var options = {
  /**
   * An optional array of SudokuSolverStrategy values representing the solvers to include.
   * If an array isn't provided, it will include all solvers by default. To run
   * the backtracking algorithm on its own, specify an empty array i.e. [].
   */
  includeStrategies: [SudokuSolverStrategy.NakedSingles, SudokuSolverStrategy.HiddenSingles],

  /**
   * An optional value whether to complete puzzles using backtracking. If the value is
   * not specified or set to true, backtracking will be used to fill in any unknown
   * cells. If it is explicitly set to false, it will not run backtracking. Note that
   * this might result in outputting incomplete puzzles but it's useful when writing new
   * solver classes.
   */
  includeBacktracking: false,
};

solvedPuzzle = SudokuSolver.solve(testPuzzle, options);

console.table(solvedPuzzle);
```

If you run the above example you'll see that there aren't enough strategies enabled to solve the puzzle.

```bash
┌─────────┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
│ (index) │ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │
├─────────┼───┼───┼───┼───┼───┼───┼───┼───┼───┤
│    0    │ 0 │ 9 │ 6 │ 0 │ 5 │ 0 │ 0 │ 3 │ 8 │
│    1    │ 0 │ 1 │ 8 │ 0 │ 0 │ 0 │ 0 │ 0 │ 0 │
│    2    │ 0 │ 5 │ 0 │ 2 │ 8 │ 4 │ 6 │ 9 │ 1 │
│    3    │ 0 │ 0 │ 1 │ 6 │ 7 │ 2 │ 0 │ 8 │ 9 │
│    4    │ 8 │ 0 │ 0 │ 0 │ 0 │ 0 │ 3 │ 0 │ 0 │
│    5    │ 0 │ 0 │ 9 │ 8 │ 0 │ 0 │ 0 │ 0 │ 0 │
│    6    │ 0 │ 0 │ 2 │ 0 │ 1 │ 0 │ 8 │ 7 │ 3 │
│    7    │ 1 │ 8 │ 0 │ 0 │ 0 │ 0 │ 9 │ 2 │ 4 │
│    8    │ 0 │ 0 │ 0 │ 0 │ 2 │ 8 │ 1 │ 6 │ 5 │
└─────────┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
```

Missing values are indicated in the output with a 0. This could be useful output if you're developing or debugging solver strategies.

## Build from source

```bash
# clone the repo
git clone https://github.com/jpmasters/jons-sudoku-solver.git

# cd into the new folder
cd jons-sudoku-solver

# install the dependencies
npm install

# check that the tests run correctly
npm run test
```
