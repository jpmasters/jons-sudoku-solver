# Jon's Sudoku Solver

This package is a work in progress library to solve classic 9x9 Sudoku puzzles.

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
