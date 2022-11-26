'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const {
        puzzle,
        coordinate,
        value
      } = req.body

      let conflict = []

      if (
        !puzzle ||
        !coordinate ||
        !value
      ) return res.json({
        error: 'Required field(s) missing'
      })

      if (solver.validate(puzzle) !== true)
        return res.json({
          error: solver.validate(puzzle)
        })

      if (!/^[A-Ia-i][1-9]$/i.test(coordinate))
        return res.json({
          error: 'Invalid coordinate'
        })

      if (!/^[1-9]$/.test(value))
        return res.json({
          error: 'Invalid value'
        })
      
      if (!solver.checkRowPlacement(puzzle, coordinate[0], coordinate[1], value))
        conflict.push('row')

      if (!solver.checkColPlacement(puzzle, coordinate[0], coordinate[1], value))
        conflict.push('column')

      if(!solver.checkRegionPlacement(puzzle, coordinate[0], coordinate[1], value))
        conflict.push('region')

      if (conflict.length === 0)
        return res.json({
          valid: true
        })
      else return res.json({
        valid: false,
        conflict: conflict
      })
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      const { puzzle } = req.body

      if (!puzzle)
        return res.json({
          error: 'Required field missing'
        })

      if (solver.validate(puzzle) !== true)
        return res.json({
          error: solver.validate(puzzle)
        })

      const solution = solver.solve(puzzle)

      if (!solution)
        return res.json({
          error: 'Puzzle cannot be solved'
        })

      return res.json({
        solution: solution
      })
    });
};
