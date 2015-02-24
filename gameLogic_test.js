describe("In Connect6", function () {
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
  function getTyingBoard() {
    return [['', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O'],
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
            ['X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O'],
            ['O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X'],
            ['X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O', 'O', 'X', 'X', 'X', 'X', 'X', 'O', 'O', 'O', 'O']];
  }

  // check four coners
  it("placing X in 0x0 from initial state is legal", function () {
    expectMoveOk(0, {},
      [{setTurn: {turnIndex : 1}},
        {set: {key: 'board', value: getBoard([
          {pos: [0, 0], piece: 'X'}])}},
        {set: {key: 'delta', value: {row: 0, col: 0}}},
        {set: {key: 'gameData', value: {totalMove: 1, winner: '', moveIndex: 2}}}]);
  });

  it("placing X in 18x0 from initial state is legal", function () {
    expectMoveOk(0, {},
      [{setTurn: {turnIndex : 1}},
        {set: {key: 'board', value: getBoard([
          {pos: [18, 0], piece: 'X'}])}},
        {set: {key: 'delta', value: {row: 18, col: 0}}},
        {set: {key: 'gameData', value: {totalMove: 1, winner: '', moveIndex: 2}}}]);
  });

  it("placing X in 0x18 from initial state is legal", function () {
    expectMoveOk(0, {},
      [{setTurn: {turnIndex : 1}},
        {set: {key: 'board', value: getBoard([
          {pos: [0, 18], piece: 'X'}])}},
        {set: {key: 'delta', value: {row: 0, col: 18}}},
        {set: {key: 'gameData', value: {totalMove: 1, winner: '', moveIndex: 2}}}]);
  });

  it("placing X in 18x18 from initial state is legal", function () {
    expectMoveOk(0, {},
      [{setTurn: {turnIndex : 1}},
        {set: {key: 'board', value: getBoard([
          {pos: [18, 18], piece: 'X'}])}},
        {set: {key: 'delta', value: {row: 18, col: 18}}},
        {set: {key: 'gameData', value: {totalMove: 1, winner: '', moveIndex: 2}}}]);
  });

  it("placing X in 0x1 after X placed X in 0x0 is illegal", function () {
    expectIllegalMove(1,
      {board: getBoard([
        {pos: [0, 0], piece: 'X'}]),
        delta: {row: 0, col: 0},
        gameData: {totalMove: 1, winner: '', moveIndex: 2}},
      [{setTurn: {turnIndex : 1}},
        {set: {key: 'board', value: getBoard([
          //[['X', 'X', '', ... ],
          // ['', '', '', ... ], ... ]
          {pos: [0, 0], piece: 'X'},
          {pos: [0, 1], piece: 'X'}])}},
        {set: {key: 'delta', value: {row: 0, col: 1}}},
        {set: {key: 'gameData', value: {totalMove: 2, winner: '', moveIndex: 3}}}]);
  });

  it("placing O in 0x1 after X placed X in 0x0 is legal", function () {
    expectMoveOk(1,
      {board: getBoard([
        {pos: [0, 0], piece: 'X'}]),
        delta: {row: 0, col: 0},
        gameData: {totalMove: 1, winner: '', moveIndex: 2}},
      //note that turnIndex is still 1
      [{setTurn: {turnIndex : 1}},
        {set: {key: 'board', value: getBoard([
          //[['X', 'O', '', ... ],
          // ['', '', '', ... ], ... ]
          {pos: [0, 0], piece: 'X'},
          {pos: [0, 1], piece: 'O'}])}},
        {set: {key: 'delta', value: {row: 0, col: 1}}},
        {set: {key: 'gameData', value: {totalMove: 2, winner: '', moveIndex: 3}}}]);
  });

  //player can move twice
  it("placing O in 1x1 is legal", function () {
    expectMoveOk(1,
      {board: getBoard([
        //[['X', 'O', '', ... ],
        // ['', '', '', ... ], ... ]
        {pos: [0, 0], piece: 'X'},
        {pos: [0, 1], piece: 'O'}]),
        delta: {row: 0, col: 1},
        gameData: {totalMove: 2, winner: '', moveIndex: 3}},
      //note that turnIndex is still 1
      [{setTurn: {turnIndex : 0}},
        {set: {key: 'board', value: getBoard([
          //[['X', 'O', '', ... ],
          // ['',  'O', '', ... ], ... ]
          {pos: [0, 0], piece: 'X'},
          {pos: [0, 1], piece: 'O'},
          {pos: [1, 1], piece: 'O'}])}},
        {set: {key: 'delta', value: {row: 1, col: 1}}},
        {set: {key: 'gameData', value: {totalMove: 3, winner: '', moveIndex: 0}}}]);
  });

  //player trying to move three times is illegal
  it("placing O in 0x2 after two moves is illegal", function () {
    expectIllegalMove(0,
      {board: getBoard([
        //[['X', 'O', '', ... ],
        // ['',  'O', '', ... ], ... ]
        {pos: [0, 0], piece: 'X'},
        {pos: [0, 1], piece: 'O'},
        {pos: [1, 1], piece: 'O'}]),
        delta: {row: 1, col: 1},
        gameData: {totalMove: 3, winner: '', moveIndex: 0}},
      [{setTurn: {turnIndex : 0}},
        {set: {key: 'board', value: getBoard([
          //[['X', 'O', 'O', ... ],
          // ['',  'O', '', ... ], ... ]
          {pos: [0, 0], piece: 'X'},
          {pos: [0, 1], piece: 'O'},
          {pos: [0, 2], piece: 'O'},
          {pos: [1, 1], piece: 'O'}])}},
        {set: {key: 'delta', value: {row: 0, col: 2}}},
        {set: {key: 'gameData', value: {totalMove: 4, winner: '', moveIndex: 1}}}]);
  });

  it("placing an O in a non-empty position is illegal", function () {
    expectIllegalMove(1,
      {board: getBoard([
        //[['X', '', '', ... ], ... ]
        {pos: [0, 0], piece: 'X'}]),
        delta: {row: 0, col: 0},
        gameData: {totalMove: 1, winner: '', moveIndex: 2}},
      [{setTurn: {turnIndex : 1}},
        {set: {key: 'board', value: getBoard([
          //[['O', '', '', ...], ... ]
          {pos: [0, 0], piece: 'O'}])}},
        {set: {key: 'delta', value: {row: 0, col: 0}}},
        {set: {key: 'gameData', value: {totalMove: 2, winner: '', moveIndex: 3}}}]);
  });

  //'O' wins the game, cannot move 'X'
  it("cannot move after the game is over", function () {
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
        gameData: {totalMove: 11, winner: 'O', moveIndex: 0}},
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

  it("placing O in 3x0 is legal", function () {
    expectMoveOk(1,
      {board: getBoard([
        //[['X', 'O', '', ... ],
        // ['X', 'O', '', ... ],
        // ['O', 'X', '', ... ],
        // ['', '', '', ... ], ... ]
        {pos: [0, 0], piece: 'X'},
        {pos: [1, 0], piece: 'X'},
        {pos: [2, 1], piece: 'X'},
        {pos: [0, 1], piece: 'O'},
        {pos: [1, 1], piece: 'O'},
        {pos: [2, 0], piece: 'O'}]),
        delta: {row: 2, col: 0},
        gameData: {totalMove: 6, winner: '', moveIndex: 3}},
      [{setTurn: {turnIndex : 0}},
        {set: {key: 'board', value: getBoard([
          //[['X', 'O', '', ... ],
          // ['X', 'O', '', ... ],
          // ['O', 'X', '', ... ], 
          // ['O', '', '', ... ], ... ]
          {pos: [0, 0], piece: 'X'},
          {pos: [1, 0], piece: 'X'},
          {pos: [2, 1], piece: 'X'},
          {pos: [0, 1], piece: 'O'},
          {pos: [1, 1], piece: 'O'},
          {pos: [2, 0], piece: 'O'},
          {pos: [3, 0], piece: 'O'}])}},
        {set: {key: 'delta', value: {row: 3, col: 0}}},
        {set: {key: 'gameData', value: {totalMove: 7, winner: '', moveIndex: 0}}}]);
  });

  // wins by connect 6 in a column
  it("X wins by placing X in 3x0 is legal", function () {
    expectMoveOk(0,
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
        {set: {key: 'gameData', value: {totalMove: 12, winner: 'X', moveIndex: 1}}}]);
  });

  //wins by connect 6 in a row
  it("X wins by placing X in 0x2 is legal", function () {
    expectMoveOk(0,
      {board: getBoard([
        //[['X', 'X', '',  'X', 'X', 'X', ... ],
        // ['O', 'O', 'O', 'O', 'O', '', ... ],
        // ['O', '', '', ... ], ... ]
        {pos: [0, 0], piece: 'X'},
        {pos: [0, 1], piece: 'X'},
        {pos: [0, 3], piece: 'X'},
        {pos: [0, 4], piece: 'X'},
        {pos: [0, 5], piece: 'X'},
        {pos: [1, 0], piece: 'O'},
        {pos: [1, 1], piece: 'O'},
        {pos: [1, 2], piece: 'O'},
        {pos: [1, 3], piece: 'O'},
        {pos: [1, 4], piece: 'O'},
        {pos: [2, 1], piece: 'O'}]),
        delta: {row: 2, col: 1},
        gameData: {totalMove: 11, winner: '', moveIndex: 0}},
      [{endMatch: {endMatchScores: [1, 0]}},
        {set: {key: 'board', value: getBoard([
          //[['X', 'X', 'X', 'X', 'X', 'x', '', ... ],
          // ['O', 'O', 'O', 'O', 'O', '', ... ],
          // ['O', '', '', ... ], ... ]
          {pos: [0, 0], piece: 'X'},
          {pos: [0, 1], piece: 'X'},
          {pos: [0, 2], piece: 'X'},
          {pos: [0, 3], piece: 'X'},
          {pos: [0, 4], piece: 'X'},
          {pos: [0, 5], piece: 'X'},
          {pos: [1, 0], piece: 'O'},
          {pos: [1, 1], piece: 'O'},
          {pos: [1, 2], piece: 'O'},
          {pos: [1, 3], piece: 'O'},
          {pos: [1, 4], piece: 'O'},
          {pos: [2, 1], piece: 'O'}])}},
        {set: {key: 'delta', value: {row: 0, col: 2}}},
        {set: {key: 'gameData', value: {totalMove: 12, winner: 'X', moveIndex: 1}}}]);
  });

  //wins by connect 6 in main diagonal
  it("O wins by placing O in 1x1 is legal", function () {
    expectMoveOk(1,
      {board: getBoard([
        //[['O', 'X', 'X', 'X', 'X', 'X', '', ... ],
        // ['', '', '', ... ],
        // ['', '', 'O', '', ... ],
        // ['', '', '', 'O', '', ... ],
        // ['', '', '', '', 'O', '', ... ],
        // ['', '', '', '', '', 'O', '', ... ], ... ]
        {pos: [0, 1], piece: 'X'},
        {pos: [0, 2], piece: 'X'},
        {pos: [0, 3], piece: 'X'},
        {pos: [0, 4], piece: 'X'},
        {pos: [0, 5], piece: 'X'},
        {pos: [0, 0], piece: 'O'},
        {pos: [2, 2], piece: 'O'},
        {pos: [3, 3], piece: 'O'},
        {pos: [4, 4], piece: 'O'},
        {pos: [5, 5], piece: 'O'}]),
        delta: {row: 4, col: 4},
        gameData: {totalMove: 10, winner: '', moveIndex: 3}},
      [{endMatch: {endMatchScores: [0, 1]}},
        {set: {key: 'board', value: getBoard([
          //[['O', 'X', 'X', 'X', 'X', 'X', '', ... ],
          // ['', 'O', '', ... ],
          // ['', '', 'O', '', ... ],
          // ['', '', '', 'O', '', ... ],
          // ['', '', '', '', 'O', '', ... ],
          // ['', '', '', '', '', 'O', '', ... ], ... ]
          {pos: [0, 1], piece: 'X'},
          {pos: [0, 2], piece: 'X'},
          {pos: [0, 3], piece: 'X'},
          {pos: [0, 4], piece: 'X'},
          {pos: [0, 5], piece: 'X'},
          {pos: [0, 0], piece: 'O'},
          {pos: [1, 1], piece: 'O'},
          {pos: [2, 2], piece: 'O'},
          {pos: [3, 3], piece: 'O'},
          {pos: [4, 4], piece: 'O'},
          {pos: [5, 5], piece: 'O'}])}},
        {set: {key: 'delta', value: {row: 1, col: 1}}},
        {set: {key: 'gameData', value: {totalMove: 11, winner: 'O', moveIndex: 0}}}]);
  });

  //wins by connect 6 in back diagonal
  it("O wins by placing O in 5x1 is legal", function () {
    expectMoveOk(1,
      {board: getBoard([
        //[['X', 'X', 'X', 'X', 'X', '', ... ],
        // ['', '', '', '', '', 'O', '', ... ],
        // ['', '', '', '', 'O', '', ... ],
        // ['', '', '', 'O', '', ... ],
        // ['', '', 'O', '', ... ],
        // ['', '', '', ... ],
        // ['O', '', ...], ... ]
        {pos: [0, 0], piece: 'X'},
        {pos: [0, 1], piece: 'X'},
        {pos: [0, 2], piece: 'X'},
        {pos: [0, 3], piece: 'X'},
        {pos: [0, 4], piece: 'X'},
        {pos: [1, 5], piece: 'O'},
        {pos: [2, 4], piece: 'O'},
        {pos: [3, 3], piece: 'O'},
        {pos: [4, 2], piece: 'O'},
        {pos: [6, 0], piece: 'O'}]),
        delta: {row: 6, col: 0},
        gameData: {totalMove: 10, winner: '', moveIndex: 3}},
      [{endMatch: {endMatchScores: [0, 1]}},
        {set: {key: 'board', value: getBoard([
          //[['X', 'X', 'X', 'X', 'X', '', ... ],
          // ['', '', '', '', '', 'O', '', ... ],
          // ['', '', '', '', 'O', '', ... ],
          // ['', '', '', 'O', '', ... ],
          // ['', '', 'O', '', ... ],
          // ['', 'O', '', ... ],
          // ['O', '', ...], ... ]
          {pos: [0, 0], piece: 'X'},
          {pos: [0, 1], piece: 'X'},
          {pos: [0, 2], piece: 'X'},
          {pos: [0, 3], piece: 'X'},
          {pos: [0, 4], piece: 'X'},
          {pos: [1, 5], piece: 'O'},
          {pos: [2, 4], piece: 'O'},
          {pos: [3, 3], piece: 'O'},
          {pos: [4, 2], piece: 'O'},
          {pos: [5, 1], piece: 'O'},
          {pos: [6, 0], piece: 'O'}])}},
        {set: {key: 'delta', value: {row: 5, col: 1}}},
        {set: {key: 'gameData', value: {totalMove: 11, winner: 'O', moveIndex: 0}}}]);
  });

  it("the game ties when there are no more empty cells", function () {
    var tyingBoard = getTyingBoard();
    var tieBoard = angular.copy(tyingBoard);
    tieBoard[0][0] = 'X'; // placing X on 0x0 cause a tie.
    expectMoveOk(0,
      {board: tyingBoard,
        delta: {row: 0, col: 1},
        gameData: {totalMove: 360, winner: '', moveIndex: 1}},
      [{endMatch: {endMatchScores: [0, 0]}},
        {set: {key: 'board', value: tieBoard}},
        {set: {key: 'delta', value: {row: 0, col: 0}}},
        {set: {key: 'gameData', value: {totalMove: 361, winner: '', moveIndex: 2}}}]);
  });

  it("null move is illegal", function () {
    expectIllegalMove(0, {}, null);
  });

  it("move without board is illegal", function () {
    expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}}]);
  });

  it("move without delta is illegal", function () {
    expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}},
      {set: {key: 'board', value: getBoard([
        {pos: [0, 0], piece: 'X'}])}}]);
  });

  it("move without gamdData is illegal", function () {
    expectIllegalMove(0, {}, [{setTurn: {turnIndex : 1}},
      {set: {key: 'board', value: getBoard([
        {pos: [0, 0], piece: 'X'}])}},
      {set: {key: 'delta', value: {row: 0, col: 0}}}]);
  });

  it("placing X outside the board (in 19x0) is illegal", function () {
    expectIllegalMove(0, {},
      [{setTurn: {turnIndex : 1}},
        {set: {key: 'board', value: getBoard([
          {pos: [0, 0], piece: 'X'}])}},
        {set: {key: 'delta', value: {row: 19, col: 0}}},
        {set: {key: 'gameData', value: {totalMove: 1, winner: '', moveIndex: 2}}}]);
  });

  it("placing X in 0x0 but setTurn to yourself is illegal", function () {
    expectIllegalMove(0, {},
      [{setTurn: {turnIndex : 0}},
        {set: {key: 'board', value: getBoard([
          {pos: [0, 0], piece: 'X'}])}},
        {set: {key: 'delta', value: {row: 0, col: 0}}},
        {set: {key: 'gameData', value: {totalMove: 1, winner: '', moveIndex: 2}}}]);
  });

  it("placing X in 0x0 but setting the board wrong is illegal", function () {
    expectIllegalMove(0, {},
      [{setTurn: {turnIndex : 0}},
        {set: {key: 'board', value: getBoard([
          {pos: [0, 1], piece: 'X'}])}},
        {set: {key: 'delta', value: {row: 0, col: 0}}},
        {set: {key: 'gameData', value: {totalMove: 1, winner: '', moveIndex: 2}}}]);
  });

  it("placing X in 0x0 but setting the delta wrong is illegal", function () {
    expectIllegalMove(0, {},
      [{setTurn: {turnIndex : 0}},
        {set: {key: 'board', value: getBoard([
          {pos: [0, 0], piece: 'X'}])}},
        {set: {key: 'delta', value: {row: 0, col: 1}}},
        {set: {key: 'gameData', value: {totalMove: 1, winner: '', moveIndex: 2}}}]);
  });

  // if total moves is wrong, it will cause problem detecting tie.
  it("placing X in 0x0 but setting the gameData.totalMove wrong is illegal", function () {
    expectIllegalMove(0, {},
      [{setTurn: {turnIndex : 0}},
        {set: {key: 'board', value: getBoard([
          {pos: [0, 0], piece: 'X'}])}},
        {set: {key: 'delta', value: {row: 0, col: 0}}},
        {set: {key: 'gameData', value: {totalMove: 2, winner: '', moveIndex: 2}}}]);
  });

  //if the moveIndex is wrong, player may get more moves
  it("placing X in 0x0 but setting the gameData.moveIndex wrong is illegal", function () {
    expectIllegalMove(0, {},
      [{setTurn: {turnIndex : 0}},
        {set: {key: 'board', value: getBoard([
          {pos: [0, 0], piece: 'X'}])}},
        {set: {key: 'delta', value: {row: 0, col: 0}}},
        {set: {key: 'gameData', value: {totalMove: 1, winner: '', moveIndex: 1}}}]);
  });

  it("getPossibleMoves returns exactly one cell", function () {
    var board = getTyingBoard();
    var gameData = {totalMove: 360, winner: '', moveIndex: 1};
    var tieBoard = angular.copy(board);
    tieBoard[0][0] = 'X';
    var possibleMoves = _gameLogic.getPossibleMoves(board, 0, gameData);
    var expectedMove = [{endMatch: {endMatchScores: [0, 0]}},
        {set: {key: 'board', value: tieBoard}},
        {set: {key: 'delta', value: {row: 0, col: 0}}},
        {set: {key: 'gameData', value: {totalMove: 361, winner: '', moveIndex: 2}}}];
    expect(angular.equals(possibleMoves, [expectedMove])).toBe(true);
  });

});
