import { Cell } from '../Cell';
import { CellCollection } from '../CellCollection';
import { CellValue } from '../CellValue';
import { emptyPuzzle } from '../EmptyPuzzle';
import { Grid, CellValueChange } from '../Grid';
import { Helpers } from '../Helpers';
import { SolverHelpers } from '../solvers/SolverHelpers';
import { GridLocation } from '../ValueTypes';

test('Apply changes works', () => {
  const sourceGrid = Grid.fromGrid([
    [1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  let targetGrid = Grid.fromGrid(emptyPuzzle);

  let cl: CellValueChange[] = sourceGrid.differences(targetGrid);

  const updatedGrid = SolverHelpers.applyChangeList(targetGrid, cl);
  expect(updatedGrid.toPuzzleArray()).toEqual(sourceGrid.toPuzzleArray());
});

test('scanBlock works in groups of 3', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 5, column: 1 }, new CellValue([5, 7, 8])),
    new Cell({ row: 5, column: 2 }, new CellValue([1, 5])),
    new Cell({ row: 5, column: 3 }, new CellValue([1, 2, 3, 5])),
    new Cell({ row: 5, column: 4 }, new CellValue([2, 5, 6, 8])),
    new Cell({ row: 5, column: 5 }, new CellValue([4])),
    new Cell({ row: 5, column: 6 }, new CellValue([1, 2, 3, 8, 9])),
    new Cell({ row: 5, column: 7 }, new CellValue([6, 9])),
    new Cell({ row: 5, column: 8 }, new CellValue([5, 7, 8])),
    new Cell({ row: 5, column: 9 }, new CellValue([5, 7, 8])),
  ]);

  const samplesToLookFor: { locations: GridLocation[]; found: boolean }[] = [
    {
      locations: [
        { row: 5, column: 1 },
        { row: 5, column: 2 },
        { row: 5, column: 3 },
      ],
      found: false,
    },
    {
      locations: [
        { row: 5, column: 4 },
        { row: 5, column: 5 },
        { row: 5, column: 6 },
      ],
      found: false,
    },
    {
      locations: [
        { row: 5, column: 7 },
        { row: 5, column: 8 },
        { row: 5, column: 9 },
      ],
      found: false,
    },
    {
      locations: [
        { row: 5, column: 1 },
        { row: 5, column: 6 },
        { row: 5, column: 9 },
      ],
      found: false,
    },
  ];

  const foundTriples: Cell[][] = SolverHelpers.scanBlock(cc, 3, (cells) => {
    const foundLocs: GridLocation[] = cells.map((c) => c.location);
    samplesToLookFor.forEach((sample) => {
      if (Helpers.locationArraysMatch(foundLocs, sample.locations)) {
        sample.found = true;
      }
    });

    return (
      Helpers.arrayHasSameMembers(cells[0].value.potentialValues, cells[1].value.potentialValues) &&
      Helpers.arrayHasSameMembers(cells[0].value.potentialValues, cells[2].value.potentialValues)
    );
  });

  expect(samplesToLookFor.every((sample) => sample.found)).toBeTruthy();
  expect(foundTriples.length).toBe(1);
  expect(foundTriples[0].length).toBe(3);
  expect(foundTriples[0][0].value.potentialValues).toEqual([5, 7, 8]);
});

test('scanBlock throws when block is the wrong length', () => {
  const cc: CellCollection = new CellCollection([
    new Cell({ row: 5, column: 1 }, new CellValue([5, 7, 8])),
    new Cell({ row: 5, column: 2 }, new CellValue([1, 5])),
    new Cell({ row: 5, column: 3 }, new CellValue([1, 2, 3, 5])),
  ]);

  expect(() => {
    SolverHelpers.scanBlock(cc, 2, () => {
      return true;
    });
  }).toThrowError();
});
