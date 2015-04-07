describe("aiService", function() {

  'use strict';

  var _aiService;

  beforeEach(module("myApp"));

  beforeEach(inject(function (aiService) {
    _aiService = aiService;
  }));

  /** Get the board needed, params is the list of pieces {pos:[row, col], piece:''} */
  function getBoard(pieces) {
    var board = [['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
                 ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '']];

    //set all the pieces 
    var i;
    var pos;
    var piece;
    for (i = 0; i < pieces.length; i++) {
      pos = pieces[i].pos;
      piece = pieces[i].piece;
      board[pos[0]][pos[1]] = piece;
    }
    return board;
  }

  it("X finds an immediate winning move", function() {
    var state = {board: getBoard([
          //[['X', 'O', 'O', '', ... ],
          // ['X', 'O', '', ... ],
          // ['X', 'O', '', ... ],
          // ['',  'O', '', ... ],
          // ['X', 'O', '', ... ],
          // ['X',  '', '', ... ], ... ]
          {pos: [0, 0], piece: 'X'},
          {pos: [1, 0], piece: 'X'},
          {pos: [2, 0], piece: 'X'},
          {pos: [4, 0], piece: 'X'},
          {pos: [5, 0], piece: 'X'},
          {pos: [0, 1], piece: 'O'},
          {pos: [0, 2], piece: 'O'},
          {pos: [1, 1], piece: 'O'},
          {pos: [2, 1], piece: 'O'},
          {pos: [3, 1], piece: 'O'},
          {pos: [4, 1], piece: 'O'}]),
          delta: {row: 4, col: 1},
          gameData: {totalMove: 11, winner: '', moveIndex: 0}
        };
    var move = _aiService.createComputerMove(
       state, 0, {maxDepth: 1});
    var expectedMove =
        [{endMatch: {endMatchScores: [1, 0]}},
          {set: {key: 'board', value: getBoard([
          //[['X', 'O', 'O', '', ... ],
          // ['X', 'O', '', ... ],
          // ['X', 'O', '', ... ],
          // ['X', 'O', '', ... ],
          // ['X', 'O', '', ... ],
          // ['X',  '', '', ... ], ... ]
          {pos: [0, 0], piece: 'X'},
          {pos: [1, 0], piece: 'X'},
          {pos: [2, 0], piece: 'X'},
          {pos: [3, 0], piece: 'X'},
          {pos: [4, 0], piece: 'X'},
          {pos: [5, 0], piece: 'X'},
          {pos: [0, 1], piece: 'O'},
          {pos: [0, 2], piece: 'O'},
          {pos: [1, 1], piece: 'O'},
          {pos: [2, 1], piece: 'O'},
          {pos: [3, 1], piece: 'O'},
          {pos: [4, 1], piece: 'O'}])}},
          {set: {key: 'delta', value: {row: 3, col: 0}}},
          {set: {key: 'gameData', value: {totalMove: 12, winner: 'X', moveIndex: 1}}}];
    expect(angular.equals(move, expectedMove)).toBe(true);
  });
/*
  it("O finds an immediate winning move", function() {
    var move = _aiService.createComputerMove(
        [['', '', 'O'],
         ['O', 'X', 'X'],
         ['O', 'X', 'O']], 1, {maxDepth: 1});
    expect(angular.equals(move[2].set.value, {row: 0, col: 0})).toBe(true);
  });

  it("X prevents an immediate win", function() {
    var move = _aiService.createComputerMove(
        [['X', '', ''],
         ['O', 'O', ''],
         ['X', '', '']], 0, {maxDepth: 2});
    expect(angular.equals(move[2].set.value, {row: 1, col: 2})).toBe(true);
  });

  it("O prevents an immediate win", function() {
    var move = _aiService.createComputerMove(
        [['X', 'X', ''],
         ['O', '', ''],
         ['', '', '']], 1, {maxDepth: 2});
    expect(angular.equals(move[2].set.value, {row: 0, col: 2})).toBe(true);
  });

  it("O prevents another immediate win", function() {
    var move = _aiService.createComputerMove(
        [['X', 'O', ''],
         ['X', 'O', ''],
         ['', 'X', '']], 1, {maxDepth: 2});
    expect(angular.equals(move[2].set.value, {row: 2, col: 0})).toBe(true);
  });

  it("X finds a winning move that will lead to winning in 2 steps", function() {
    var move = _aiService.createComputerMove(
        [['X', '', ''],
         ['O', 'X', ''],
         ['', '', 'O']], 0, {maxDepth: 3});
    expect(angular.equals(move[2].set.value, {row: 0, col: 1})).toBe(true);
  });

  it("O finds a winning move that will lead to winning in 2 steps", function() {
    var move = _aiService.createComputerMove(
        [['', 'X', ''],
         ['X', 'X', 'O'],
         ['', 'O', '']], 1, {maxDepth: 3});
    expect(angular.equals(move[2].set.value, {row: 2, col: 2})).toBe(true);
  });

  it("O finds a cool winning move that will lead to winning in 2 steps", function() {
    var move = _aiService.createComputerMove(
        [['X', 'O', 'X'],
         ['X', '', ''],
         ['O', '', '']], 1, {maxDepth: 3});
    expect(angular.equals(move[2].set.value, {row: 2, col: 1})).toBe(true);
  });

  it("O finds the wrong move due to small depth", function() {
    var move = _aiService.createComputerMove(
        [['X', '', ''],
         ['', '', ''],
         ['', '', '']], 1, {maxDepth: 3});
    expect(angular.equals(move[2].set.value, {row: 0, col: 1})).toBe(true);
  });

  it("O finds the correct move when depth is big enough", function() {
    var move = _aiService.createComputerMove(
        [['X', '', ''],
         ['', '', ''],
         ['', '', '']], 1, {maxDepth: 6});
    expect(angular.equals(move[2].set.value, {row: 1, col: 1})).toBe(true);
  });

  it("X finds a winning move that will lead to winning in 2 steps", function() {
    var move = _aiService.createComputerMove(
        [['', '', ''],
         ['O', 'X', ''],
         ['', '', '']], 0, {maxDepth: 5});
    expect(angular.equals(move[2].set.value, {row: 0, col: 0})).toBe(true);
  });*/

});