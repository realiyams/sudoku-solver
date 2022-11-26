const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

let testPuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
let solvedPuzzle = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
let invalidPuzzle = 'someInvalidCharacter..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
let not_81_length_puzzle = '1.5..2.84..63.12.7.2..5'

suite('Unit Tests', () => {
  test('handles a valid puzzle string of 81 characters', (done) => {
    assert.equal(solver.validate(testPuzzle), true)
    done()
  })

  test('handles a puzzle string with invalid characters (not 1-9 or .)', (done) => {
    assert.equal(solver.validate(invalidPuzzle), 'Invalid characters in puzzle')
    done()
  })

  test('handles a puzzle string that is not 81 characters in length', (done) => {
    assert.equal(solver.validate(not_81_length_puzzle), 'Expected puzzle to be 81 characters long')
    done()
  })

  test('handles a valid row placement', (done) => {
    assert.equal(solver.checkRowPlacement(testPuzzle, 'A', '2', '3'), true)
    done()
  })

  test('handles an invalid row placement', (done) => {
    assert.equal(solver.checkRowPlacement(testPuzzle, 'A', '2', '1'), false)
    done()
  })

  test('handles a valid column placement', (done) => {
    assert.equal(solver.checkColPlacement(testPuzzle, 'B', '5', '8'), true)
    done()
  })

  test('handles an invalid column placement', (done) => {
    assert.equal(solver.checkColPlacement(testPuzzle, 'B', '2', '6'), false)
    done()
  })

  test('handles a valid region (3x3 grid) placement', (done) => {
    assert.equal(solver.checkRegionPlacement(testPuzzle, 'B', '2', '3'), true)
    done()
  })

  test('handles an invalid region (3x3 grid) placement', (done) => {
    assert.equal(solver.checkColPlacement(testPuzzle, 'H', '5', '1'), false)
    done()
  })

  test('Valid puzzle strings pass the solver', (done) => {
    assert.notEqual(solver.solve(testPuzzle), false)
    done()
  })

  test('Invalid puzzle strings fail the solver', (done) => {
    assert.equal(solver.solve(invalidPuzzle), false)   
    done()
  })

  test('Solver returns the expected solution for an incomplete puzzle', (done) => {
    assert.equal(solver.solve(testPuzzle), solvedPuzzle)
    done()
  })
});
