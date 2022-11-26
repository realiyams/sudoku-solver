const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let testPuzzle = '5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
let failedPuzzle = '9..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'
let solution = '568913724342687519197254386685479231219538467734162895926345178473891652851726943'
let invalidPuzzle = 'someInvalidCharacter..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
let not_81_length_puzzle = '1.5..2.84..63.12.7.2..5'

suite('Functional Tests', () => {
  suite('POST request to /api/solve', () => {
    test('Solve a puzzle with valid puzzle string', (done) => {
      chai.request(server)
      .post('/api/solve')
      .send({
        puzzle: testPuzzle
      })
      .end((err, res) => {
        assert.equal(res.status, 200)
        assert.equal(res.body.solution, solution)
        done();
      })
    })

    test('Solve a puzzle with missing puzzle string', (done) => {
      chai.request(server)
      .post('/api/solve')
      .send({

      })
      .end((err, res) => {
        assert.equal(res.body.error, 'Required field missing')
        done();
      })
    })

    test('Solve a puzzle with invalid characters', (done) => {
      chai.request(server)
      .post('/api/solve')
      .send({
        puzzle: invalidPuzzle
      })
      .end((err, res) => {
        assert.equal(res.body.error, 'Invalid characters in puzzle')
        done();
      })
    })

    test('Solve a puzzle with incorrect length', (done) => {
      chai.request(server)
      .post('/api/solve')
      .send({
        puzzle: not_81_length_puzzle
      })
      .end((err, res) => {
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
        done();
      })
    })

    test('Solve a puzzle that cannot be solved', (done) => {
      chai.request(server)
      .post('/api/solve')
      .send({
        puzzle: failedPuzzle
      })
      .end((err, res) => {
        assert.equal(res.body.error, 'Puzzle cannot be solved')
        done();
      })
    })
  })

  suite('POST request to /api/check', () => {
    test('Check a puzzle placement with all fields', (done) => {
      chai.request(server)
      .post('/api/check')
      .send({
        puzzle: testPuzzle,
        coordinate: 'A2',
        value: '4',
      })
      .end((err, res) => {
        assert.equal(res.body.valid, true)
        done();
      })
    })

    test('Check a puzzle placement with single placement conflict', (done) => {
      chai.request(server)
      .post('/api/check')
      .send({
        puzzle: testPuzzle,
        coordinate: 'A2',
        value: '1',
      })
      .end((err, res) => {
        assert.equal(res.body.valid, false)
        assert.equal(res.body.conflict.length, 1)
        done();
      })
    })

    test('Check a puzzle placement with multiple placement conflicts', (done) => {
      chai.request(server)
      .post('/api/check')
      .send({
        puzzle: testPuzzle,
        coordinate: 'A2',
        value: '2',
      })
      .end((err, res) => {
        assert.equal(res.body.valid, false)
        assert.equal(res.body.conflict.length, 2)
        done();
      })
    })

    test('Check a puzzle placement with all placement conflicts', (done) => {
      chai.request(server)
      .post('/api/check')
      .send({
        puzzle: testPuzzle,
        coordinate: 'A2',
        value: '9',
      })
      .end((err, res) => {
        assert.equal(res.body.valid, false)
        assert.equal(res.body.conflict.length, 3)
        done();
      })
    })

    test('Check a puzzle placement with missing required fields', (done) => {
      chai.request(server)
      .post('/api/check')
      .send({

      })
      .end((err, res) => {
        assert.equal(res.body.error, 'Required field(s) missing')
        done();
      })
    })

    test('Check a puzzle placement with invalid characters', (done) => {
      chai.request(server)
      .post('/api/check')
      .send({
        puzzle: invalidPuzzle,
        coordinate: 'A2',
        value: '9',
      })
      .end((err, res) => {
        assert.equal(res.body.error, 'Invalid characters in puzzle')
        done();
      })
    })

    test('Check a puzzle placement with incorrect length', (done) => {
      chai.request(server)
      .post('/api/check')
      .send({
        puzzle: not_81_length_puzzle,
        coordinate: 'A2',
        value: '9',
      })
      .end((err, res) => {
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
        done();
      })
    })

    test('Check a puzzle placement with invalid placement coordinate', (done) => {
      chai.request(server)
      .post('/api/check')
      .send({
        puzzle: testPuzzle,
        coordinate: 'J10',
        value: '9',
      })
      .end((err, res) => {
        assert.equal(res.body.error, 'Invalid coordinate')
        done();
      })
    })

    test('Check a puzzle placement with invalid placement value', (done) => {
      chai.request(server)
      .post('/api/check')
      .send({
        puzzle: testPuzzle,
        coordinate: 'A2',
        value: 'B',
      })
      .end((err, res) => {
        assert.equal(res.body.error, 'Invalid value')
        done();
      })
    })
  })
});

