class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length !== 81)
      return 'Expected puzzle to be 81 characters long'

    const regex = /^[0-9.]*$/

    if (regex.test(puzzleString)) return true
    
    return 'Invalid characters in puzzle'
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let rowNum = row.charCodeAt() - 65
    let colNum = column - 1

    let index = (rowNum * 9) + colNum
    if (puzzleString[index] === value)
      return true

    if (puzzleString.substr(rowNum * 9, 9).includes(value))
      return false
    
    return true
  }

  checkColPlacement(puzzleString, row, column, value) {
    let rowNum = row.charCodeAt() - 65
    let colNum = column - 1

    let index = (rowNum * 9) + colNum
    if (puzzleString[index] === value)
      return true

    let colArr = []

    for (let i = 0; i < 9; i++)
      colArr.push(puzzleString.substr((i * 9) + parseInt(column) - 1, 1))

    if (colArr.includes(value))
      return false
    
    return true
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let rowNum = row.charCodeAt() - 65
    let colNum = column - 1

    let index = (rowNum * 9) + colNum
    if (puzzleString[index] === value)
      return true

    let regionArr = []
    index = 0

    switch (rowNum) {
      case 0: case 1: case 2: rowNum = 0
        break

      case 3: case 4: case 5: rowNum = 3
        break

      case 6: case 7: case 8: rowNum = 6
        break
    
      default:
        break
    }

    switch (colNum) {
      case 0: case 1: case 2: colNum = 0
        break

      case 3: case 4: case 5: colNum = 3
        break

      case 6: case 7: case 8: colNum = 6
        break
    
      default:
        break
    }
    
    index = rowNum * 9

    for (let i = 0; i < 3; i++) {
      for (let j = index + colNum; j < index + colNum + 3; j++) {
        regionArr.push(puzzleString.substr(j, 1))
      }
      index += 9
    }

    if (regionArr.includes(value))
      return false
  
    return true
  }

  solve(puzzleString, unremovableNum = [], index = 0, tryNum = 1) {
    if (index === 0)
      if (this.validate(puzzleString) !== true)
        return false

    let puzzleArray = puzzleString.split('')
    
    if (index === puzzleArray.length) 
      return puzzleArray.join('')

    if (unremovableNum.length === 0)
      for (let i = 0; i < puzzleArray.length; i++)
        if (puzzleArray[i] !== '.')
          unremovableNum.push(i)

    if ((puzzleArray[index] !== '.') && (unremovableNum.includes(index)))
      return this.solve(puzzleArray.join(''), unremovableNum, index + 1)

    let row = String.fromCharCode(Math.floor(index / 9) + 65)
    let column = index % 9

    for (let attempt = tryNum; attempt < 10; attempt++) {
      let attemptStr = attempt.toString()

      if (
        this.checkRowPlacement(puzzleArray.join(''), row, column + 1, attemptStr) &&
        this.checkColPlacement(puzzleArray.join(''), row, column + 1, attemptStr) &&
        this.checkRegionPlacement(puzzleArray.join(''), row, column + 1, attemptStr)
      ) {
        puzzleArray[index] = attemptStr
        return this.solve(puzzleArray.join(''), unremovableNum, index + 1)
      }
    }
    puzzleArray[index] = '.'

    if (index > 0) {
      let backtrack = index - 1
      while(unremovableNum.includes(backtrack))
        backtrack -= 1

      return this.solve(puzzleArray.join(''), unremovableNum, backtrack, parseInt(puzzleArray[backtrack]) + 1)
    } 
    return false
  }
}

module.exports = SudokuSolver;