describe("In Connect6", function () {
  
  'use strict';

  var _gameLogic;

  beforeEach(module("myApp"));

  beforeEach(inject(function (gameLogic) {
    _gameLogic = gameLogic;
  }));

  function expectMoveOk(turnIndexBeforeMove, stateBeforeMove, move) {
    expect(_gameLogic.isMoveOk({turnIndexBeforeMove: turnIndexBeforeMove,
      stateBeforeMove: stateBeforeMove,
      move: move})).toBe(true);
  }

  function expectIllegalMove(turnIndexBeforeMove, stateBeforeMove, move) {
    expect(_gameLogic.isMoveOk({turnIndexBeforeMove: turnIndexBeforeMove,
      stateBeforeMove: stateBeforeMove,
      move: move})).toBe(false);
  }

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

  /** return a tie board without the last move, placing X on 0x0 cause a tie*/
  function getExampleBoard() {
    return [['', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O'],
            ['O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X'],
            ['X', 'X', 'O', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O'],
            ['O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X'],
            ['X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O'],
            ['O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X'],
            ['X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O'],
            ['O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X'],
            ['X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O'],
            ['O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X'],
            ['X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O'],
            ['O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X'],
            ['X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O'],
            ['O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X'],
            ['X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O'],
            ['O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X'],
            ['X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O'],
            ['O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X'],
            ['X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O']];
  }

  it("1. placing X in 0x19 from initial state is illegal", function () {
    expectIllegalMove(0, {},
      [{setTurn: {turnIndex : 1}},
        {set: {key: 'board', value: getBoard([
          {pos: [0, 19], piece: 'X'}])}},
        {set: {key: 'delta', value: {row: 0, col: 0}}},
        {set: {key: 'gameData', value: {totalMove: 1, winner: '', moveIndex: 2}}}]);
  });

  it("2. placing X in 0x0 but setting the gameData.winner wrong is illegal", function () {
    expectIllegalMove(0, {},
      [{setTurn: {turnIndex : 1}},
        {set: {key: 'board', value: getBoard([
          {pos: [0, 0], piece: 'X'}])}},
        {set: {key: 'delta', value: {row: 0, col: 0}}},
        {set: {key: 'gameData', value: {totalMove: 1, winner: 'X', moveIndex: 1}}}]);
  });

  it("3. X wins but gameData.winner set wrong is illegal", function () {
    expectIllegalMove(0,
      {board: getBoard([
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
        gameData: {totalMove: 11, winner: '', moveIndex: 0}},
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
        {set: {key: 'gameData', value: {totalMove: 12, winner: 'O', moveIndex: 1}}}]);
  });

  it("4. X wins but endMatchScores set wrong is legal", function () {
    expectIllegalMove(0,
      {board: getBoard([
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
        gameData: {totalMove: 11, winner: '', moveIndex: 0}},
      [{endMatch: {endMatchScores: [0, 1]}},
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
        {set: {key: 'gameData', value: {totalMove: 12, winner: 'X', moveIndex: 1}}}]);
  });

  it("5. X wins but gameData.totalMove set wrong is illegal", function () {
    expectIllegalMove(0,
      {board: getBoard([
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
        gameData: {totalMove: 11, winner: '', moveIndex: 0}},
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
        {set: {key: 'gameData', value: {totalMove: 13, winner: 'X', moveIndex: 1}}}]);
  });

  it("6. X wins but gameData.moveIndex set wrong is illegal", function () {
    expectIllegalMove(0,
      {board: getBoard([
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
        gameData: {totalMove: 11, winner: '', moveIndex: 0}},
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
        {set: {key: 'gameData', value: {totalMove: 12, winner: 'X', moveIndex: 2}}}]);
  });

  it("7. Win the game in the last step is legal", function () {
    var egBoard = getExampleBoard();
    var finalBoard = angular.copy(egBoard);
    finalBoard[0][0] = 'X'; // placing X on 0x0 cause a tie.
    expectMoveOk(0,
      {board: egBoard,
        delta: {row: 0, col: 1},
        gameData: {totalMove: 360, winner: '', moveIndex: 1}},
      [{endMatch: {endMatchScores: [1, 0]}},
        {set: {key: 'board', value: finalBoard}},
        {set: {key: 'delta', value: {row: 0, col: 0}}},
        {set: {key: 'gameData', value: {totalMove: 361, winner: 'X', moveIndex: 2}}}]);
  });

  /*jshint multistr: true */
  it("8. Even if gameData.winner before move is set wrong, \
      move after game is over is illegal", function () {
    expectIllegalMove(0,
      {board: getBoard([
        //[['X', 'O', '', ... ],
        // ['X', 'O', '', ... ],
        // ['X', 'O', '', ... ],
        // ['X', 'O', '', ... ],
        // ['X', 'O', '', ... ],
        // ['',  'O', '', ... ], ... ]
        {pos: [0, 0], piece: 'X'},
        {pos: [1, 0], piece: 'X'},
        {pos: [2, 0], piece: 'X'},
        {pos: [3, 0], piece: 'X'},
        {pos: [4, 0], piece: 'X'},
        {pos: [0, 1], piece: 'O'},
        {pos: [1, 1], piece: 'O'},
        {pos: [2, 1], piece: 'O'},
        {pos: [3, 1], piece: 'O'},
        {pos: [4, 1], piece: 'O'},
        {pos: [5, 1], piece: 'O'}]),
        delta: {row: 5, col: 1},
        gameData: {totalMove: 11, winner: '', moveIndex: 0}},
      [{setTurn: {turnIndex : 0}},
        {set: {key: 'board', value: getBoard([
          //[['X', 'O', '', ... ],
          // ['X', 'O', '', ... ],
          // ['X', 'O', '', ... ],
          // ['X', 'O', '', ... ],
          // ['X', 'O', '', ... ],
          // ['X', 'O', '', ... ], ... ]
          {pos: [0, 0], piece: 'X'},
          {pos: [1, 0], piece: 'X'},
          {pos: [2, 0], piece: 'X'},
          {pos: [3, 0], piece: 'X'},
          {pos: [4, 0], piece: 'X'},
          {pos: [5, 0], piece: 'X'},
          {pos: [0, 1], piece: 'O'},
          {pos: [1, 1], piece: 'O'},
          {pos: [2, 1], piece: 'O'},
          {pos: [3, 1], piece: 'O'},
          {pos: [4, 1], piece: 'O'},
          {pos: [5, 1], piece: 'O'}])}},
        {set: {key: 'delta', value: {row: 5, col: 0}}},
        {set: {key: 'gameData', value: {totalMove: 12, winner: 'X', moveIndex: 1}}}]);
  });


});
