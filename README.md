# Jon's Sudoku Solver

This package is a work in progress library to solve classic 9x9 Sudoku puzzles.

Most Sudoku solvers implement a backtracking algorithm which guarantees a solution but can take a long time to get there.

This package can do that however before it does, it tries a number of methods human Sudoku solvers would try first, to reduce the work the backtracking algorithm needs to perform.

For many easy and intermediate level puzzles, it can reach a solution without needing to do any backtracking or recursion at all. This _should_ make things a lot faster and less processor hungry.

This is just a quick spare / vacation time project but I am hoping to extend the library to include more sophisticated solvers and perhaps features that might make it a useful starting point to build a Sudoku game.

If you have any feedback, ideas, comments please feel free to let me know. I can't promise I'll be able to get back to you straightaway but I'll do my best!

## Install from NPM

```
npm i jons-sudoku-solver
```

## Usage

```javascript
const solver = require('jons-sudoku-solver');

testPuzzle = [
  [0, 0, 2, 6, 0, 4, 0, 0, 0],
  [0, 7, 0, 0, 0, 2, 0, 0, 0],
  [0, 0, 6, 3, 0, 0, 0, 8, 0],
  [0, 9, 0, 0, 0, 0, 0, 0, 0],
  [5, 2, 7, 9, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 8, 0, 4, 0],
  [0, 0, 0, 0, 0, 0, 4, 0, 5],
  [0, 4, 0, 0, 0, 1, 0, 6, 0],
  [0, 0, 1, 0, 7, 0, 9, 0, 0],
];

solvedPuzzle = solver.solve(testPuzzle);

console.log(solvedPuzzle);
```
