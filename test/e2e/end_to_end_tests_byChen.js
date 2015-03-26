/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('Connect6', function() {

  'use strict';

  beforeEach(function() {
    browser.get('http://localhost:9000/app/game.min.html');
  });

  function getDiv(row, col) {
    return element(by.id('e2e_test_div_x' + row + 'x' + col));
  }

  function getImg(row, col) {
    return element(by.id('e2e_test_img_x' + row + 'x' + col));
  }

  function expectPiece(row, col, pieceKind) {
    var piece = pieceKind === 'X' ? "black" : pieceKind === 'O' ? "white" : '';
    expect(getImg(row, col).isDisplayed()).toEqual(pieceKind === "" ? false : true);
    expect(getImg(row, col).getAttribute("src")).toEqual(
      pieceKind === "" ? null : "http://localhost:9000/app/imgsrc/" + piece + ".png");
  }
  
  /*// Check every element each time, slowest.
  function expectBoard(board) {
    for (var row = 0; row < 19; row++) {
      for (var col = 0; col < 19; col++) {
        expectPiece(row, col, board[row][col]);
      }
    }
  }
  
  //better way to check the whole board.
  function expectBoardWhole(board) {
    element.all(by.css('.piece')).each(function(element) {
      element.getAttribute("id").then(function (id) {
        var cordinates = id.split("x");
        var row = cordinates[1];
        var col = cordinates[2];
        var piece = board[row][col] === 'X' ? "black" : board[row][col] === 'O' ? "white" : "";
        expect(element.isDisplayed()).toEqual(piece === "" ? false : true);
        expect(element.getAttribute("src")).toEqual(
          piece === "" ? null : "http://localhost:9000/app/imgsrc/" + piece + ".png");
      });
    });
  }*/

  //cheating way to check whole board, fastest .
  function expectBoardCheat(board) {
    element.all(by.css('.piece')).each(function(element, index) {
      var row = Math.floor(index / 19);
      var col = index % 19;
      var piece = board[row][col] === 'X' ? "black" : board[row][col] === 'O' ? "white" : "";
      expect(element.isDisplayed()).toEqual(piece === "" ? false : true);
      expect(element.getAttribute("src")).toEqual(
        piece === "" ? null : "http://localhost:9000/app/imgsrc/" + piece + ".png");
    });
  }

  function clickDivAndExpectPiece(row, col, pieceKind) {
    getDiv(row, col).click();
    expectPiece(row, col, pieceKind);
  }

  // playMode is either: 'passAndPlay', 'playAgainstTheComputer', 'onlyAIs',
  // or a number representing the playerIndex (-2 for viewer, 0 for Black player, 1 for White player, etc)
  function setMatchState(matchState, playMode) {
    browser.executeScript(function(matchStateInJson, playMode) {
      var stateService = window.e2e_test_stateService;
      stateService.setMatchState(angular.fromJson(matchStateInJson));
      stateService.setPlayMode(angular.fromJson(playMode));
      angular.element(document).scope().$apply(); // to tell angular that things changes.
    }, JSON.stringify(matchState), JSON.stringify(playMode));
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
    if (pieces) {
      for (i = 0; i < pieces.length; i++) {
        pos = pieces[i].pos;
        piece = pieces[i].piece;
        board[pos[0]][pos[1]] = piece;
      }
    }
    return board;
  }

  it('should have a title', function () {
    expect(browser.getTitle()).toEqual('Connect6');
  });

  it('should have an empty Connect6 board', function () {
    expectBoardCheat(getBoard());
  });

  it('should show Black if I click in 18x18', function () {
    clickDivAndExpectPiece(18, 18, "X");
    expectBoardCheat(getBoard([
      {pos: [18, 18], piece: 'X'}]));
  });

  it('should ignore clicking on a non-empty cell', function () {
    clickDivAndExpectPiece(0, 0, "X");
    clickDivAndExpectPiece(0, 0, "X"); // clicking on a non-empty cell doesn't do anything.
    clickDivAndExpectPiece(18, 18, "O");
    clickDivAndExpectPiece(9, 10, "O");
    expectBoardCheat(getBoard([
      {pos: [0, 0], piece: 'X'},
      {pos: [18, 18], piece: 'O'},
      {pos: [9, 10], piece: 'O'}]));
  });

  it('should end game if white wins', function () {
    clickDivAndExpectPiece(8, 7, "X");
    var row = 9;
    for (var col = 7; col < 12; col++) {
      var piece = row === 9 ? "O" : "X";
      clickDivAndExpectPiece(row, col, piece);
      clickDivAndExpectPiece(row, col + 1, piece);
      row = 17 - row;
    }
    getDiv(8, 12).click();
    // After the game ends, player black click (in cell 12x8) will be ignored.
    expectPiece(8, 12, "");

    expectBoardCheat(getBoard([
      {pos: [8, 7], piece: 'X'},
      {pos: [8, 8], piece: 'X'},
      {pos: [8, 9], piece: 'X'},
      {pos: [8, 10], piece: 'X'},
      {pos: [8, 11], piece: 'X'},
      {pos: [9, 7], piece: 'O'},
      {pos: [9, 8], piece: 'O'},
      {pos: [9, 9], piece: 'O'},
      {pos: [9, 10], piece: 'O'},
      {pos: [9, 11], piece: 'O'},
      {pos: [9, 12], piece: 'O'}]));
  });

  it('should end game if Black wins', function () {
    clickDivAndExpectPiece(0, 0, "X");
    clickDivAndExpectPiece(9, 8, "O");
    clickDivAndExpectPiece(10, 13, "O");
    var row = 8;
    for (var col = 8; col < 13; col++) {
      var piece = row === 8 ? "X" : "O";
      clickDivAndExpectPiece(row, col, piece);
      clickDivAndExpectPiece(row, col+1, piece);
      row = 17 - row;
    }
    getDiv(12, 12).click();
    // After the game ends, player white click (in cell 12x12) will be ignored.
    expectPiece(12, 12, "");

    expectBoardCheat(getBoard([
      {pos: [0, 0], piece: 'X'},
      {pos: [8, 8], piece: 'X'},
      {pos: [8, 9], piece: 'X'},
      {pos: [8, 10], piece: 'X'},
      {pos: [8, 11], piece: 'X'},
      {pos: [8, 12], piece: 'X'},
      {pos: [8, 13], piece: 'X'},
      {pos: [9, 8], piece: 'O'},
      {pos: [9, 9], piece: 'O'},
      {pos: [9, 10], piece: 'O'},
      {pos: [9, 11], piece: 'O'},
      {pos: [9, 12], piece: 'O'},
      {pos: [10, 13], piece: 'O'}]));
  });

  it('can start from a match that is about to end, and win', function () {
    var boardBefore = getBoard([
        {pos: [0, 0], piece: 'X'},
        {pos: [1, 0], piece: 'X'},
        {pos: [2, 0], piece: 'X'},
        {pos: [3, 0], piece: 'X'},
        {pos: [4, 0], piece: 'X'},
        {pos: [0, 1], piece: 'O'},
        {pos: [1, 1], piece: 'O'},
        {pos: [2, 1], piece: 'O'},
        {pos: [3, 1], piece: 'O'}]);

    var currentBoard = getBoard([
        {pos: [0, 0], piece: 'X'},
        {pos: [1, 0], piece: 'X'},
        {pos: [2, 0], piece: 'X'},
        {pos: [3, 0], piece: 'X'},
        {pos: [4, 0], piece: 'X'},
        {pos: [0, 1], piece: 'O'},
        {pos: [1, 1], piece: 'O'},
        {pos: [2, 1], piece: 'O'},
        {pos: [3, 1], piece: 'O'},
        {pos: [4, 1], piece: 'O'}]);

    var boardAfter = getBoard([
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
        {pos: [5, 1], piece: 'O'}]);

    var currentDelta = {row: 4, col: 1};
    var deltaBefore = {row: 4, col: 0};
    var currenGameData = {totalMove: 10, winner: '', moveIndex: 3};
    var gameDataBefore = {totalMove: 9, winner: '', moveIndex: 2};

    var matchState = {
      turnIndexBeforeMove: 1,
      turnIndex: 1,
      endMatchScores: null,
      lastMove: [{setTurn: {turnIndex: 1}},
            {set: {key: 'board', value: currentBoard}},
            {set: {key: 'delta', value: currentDelta}},
            {set: {key: 'gameData', value: currenGameData}}],
      lastState: {board: boardBefore, delta: deltaBefore, gameData: gameDataBefore},
      currentState: {board: currentBoard, delta: currentDelta, gameData: currenGameData},
      lastVisibleTo: {},
      currentVisibleTo: {},
    };

    setMatchState(matchState, 'passAndPlay');
    expectBoardCheat(currentBoard);
    clickDivAndExpectPiece(5, 1, "O"); // winning click!
    clickDivAndExpectPiece(5, 2, ""); // can't click after game ended
    expectBoardCheat(boardAfter);
  });

  it('cannot play if it is not your turn', function () {
    var boardBefore = getBoard([
        {pos: [6, 10], piece: 'X'},
        {pos: [7, 10], piece: 'X'},
        {pos: [8, 10], piece: 'X'},
        {pos: [9, 10], piece: 'X'},
        {pos: [10, 10], piece: 'X'},
        {pos: [6, 11], piece: 'O'},
        {pos: [7, 11], piece: 'O'},
        {pos: [8, 11], piece: 'O'},
        {pos: [9, 11], piece: 'O'}]);

    var currentBoard = getBoard([
        {pos: [6, 10], piece: 'X'},
        {pos: [7, 10], piece: 'X'},
        {pos: [8, 10], piece: 'X'},
        {pos: [9, 10], piece: 'X'},
        {pos: [10, 10], piece: 'X'},
        {pos: [6, 11], piece: 'O'},
        {pos: [7, 11], piece: 'O'},
        {pos: [8, 11], piece: 'O'},
        {pos: [9, 11], piece: 'O'},
        {pos: [10, 11], piece: 'O'}]);

    var currentDelta = {row: 10, col: 11};
    var deltaBefore = {row: 10, col: 10};
    var currenGameData = {totalMove: 10, winner: '', moveIndex: 3};
    var gameDataBefore = {totalMove: 9, winner: '', moveIndex: 2};

    var matchState = {
      turnIndexBeforeMove: 1,
      turnIndex: 1,
      endMatchScores: null,
      lastMove: [{setTurn: {turnIndex: 1}},
            {set: {key: 'board', value: currentBoard}},
            {set: {key: 'delta', value: currentDelta}},
            {set: {key: 'gameData', value: currenGameData}}],
      lastState: {board: boardBefore, delta: deltaBefore, gameData: gameDataBefore},
      currentState: {board: currentBoard, delta: currentDelta, gameData: currenGameData},
      lastVisibleTo: {},
      currentVisibleTo: {},
    };

    setMatchState(matchState, 0);
    expectBoardCheat(currentBoard);
    clickDivAndExpectPiece(11, 11, ""); // cant do winning click!
    expectBoardCheat(currentBoard);
  });

  it('can start from a match that ended', function () {
    var boardBefore = getBoard([
        {pos: [6, 8], piece: 'X'},
        {pos: [7, 8], piece: 'X'},
        {pos: [8, 8], piece: 'X'},
        {pos: [9, 8], piece: 'X'},
        {pos: [10, 8], piece: 'X'},
        {pos: [7, 9], piece: 'O'},
        {pos: [8, 9], piece: 'O'},
        {pos: [9, 9], piece: 'O'},
        {pos: [10, 9], piece: 'O'},
        {pos: [11, 9], piece: 'O'}]);


    var currentBoard = getBoard([
        {pos: [6, 8], piece: 'X'},
        {pos: [7, 8], piece: 'X'},
        {pos: [8, 8], piece: 'X'},
        {pos: [9, 8], piece: 'X'},
        {pos: [10, 8], piece: 'X'},
        {pos: [7, 9], piece: 'O'},
        {pos: [8, 9], piece: 'O'},
        {pos: [9, 9], piece: 'O'},
        {pos: [10, 9], piece: 'O'},
        {pos: [11, 9], piece: 'O'},
        {pos: [12, 9], piece: 'O'}]);

    var currentDelta = {row: 12, col: 9};
    var deltaBefore = {row: 11, col: 9};
    var currenGameData = {totalMove: 11, winner: 'O', moveIndex: 0};
    var gameDataBefore = {totalMove: 10, winner: '', moveIndex: 3};

    var matchState = {
      turnIndexBeforeMove: 1,
      turnIndex: -2,
      endMatchScores: [0, 1],
      lastMove: [{endMatch: {endMatchScores: [0, 1]}},
          {set: {key: 'board', value: currentBoard}},
          {set: {key: 'delta', value: currentDelta}},
          {set: {key: 'gameData', value: currenGameData}}],
      lastState: {board: boardBefore, delta: deltaBefore, gameData: gameDataBefore},
      currentState: {board: currentBoard, delta: currentDelta, gameData: currenGameData},
      lastVisibleTo: {},
      currentVisibleTo: {},
    };

    setMatchState(matchState, 'passAndPlay');
    expectBoardCheat(currentBoard);
    clickDivAndExpectPiece(2, 1, ""); // can't click after game ended
    expectBoardCheat(currentBoard);
  });

  it('can start from a match that ended with AI', function () {
    var boardBefore = getBoard([
        {pos: [6, 8], piece: 'X'},
        {pos: [7, 8], piece: 'X'},
        {pos: [8, 8], piece: 'X'},
        {pos: [9, 8], piece: 'X'},
        {pos: [10, 8], piece: 'X'},
        {pos: [7, 9], piece: 'O'},
        {pos: [8, 9], piece: 'O'},
        {pos: [9, 9], piece: 'O'},
        {pos: [10, 9], piece: 'O'},
        {pos: [11, 9], piece: 'O'}]);


    var currentBoard = getBoard([
        {pos: [6, 8], piece: 'X'},
        {pos: [7, 8], piece: 'X'},
        {pos: [8, 8], piece: 'X'},
        {pos: [9, 8], piece: 'X'},
        {pos: [10, 8], piece: 'X'},
        {pos: [7, 9], piece: 'O'},
        {pos: [8, 9], piece: 'O'},
        {pos: [9, 9], piece: 'O'},
        {pos: [10, 9], piece: 'O'},
        {pos: [11, 9], piece: 'O'},
        {pos: [12, 9], piece: 'O'}]);

    var currentDelta = {row: 12, col: 9};
    var deltaBefore = {row: 11, col: 9};
    var currenGameData = {totalMove: 11, winner: 'O', moveIndex: 0};
    var gameDataBefore = {totalMove: 10, winner: '', moveIndex: 3};

    var matchState = {
      turnIndexBeforeMove: 1,
      turnIndex: -2,
      endMatchScores: [0, 1],
      lastMove: [{endMatch: {endMatchScores: [0, 1]}},
          {set: {key: 'board', value: currentBoard}},
          {set: {key: 'delta', value: currentDelta}},
          {set: {key: 'gameData', value: currenGameData}}],
      lastState: {board: boardBefore, delta: deltaBefore, gameData: gameDataBefore},
      currentState: {board: currentBoard, delta: currentDelta, gameData: currenGameData},
      lastVisibleTo: {},
      currentVisibleTo: {},
    };

    setMatchState(matchState, 'playAgainstTheComputer');
    expectBoardCheat(currentBoard);
    browser.sleep(1000); // AI can't move after game ended
    expectBoardCheat(currentBoard);
  });

  it('should end the game in tie', function () {
    var board = getBoard();
    var piece = 'X';
    var index = 1;
    var row;
    var col;
    for (row = 0; row < 18; row = row + 2) {
      for (col = 0; col < 19; col++) {
        clickDivAndExpectPiece(row, col, piece);
        board[row][col] = piece;
        index = (index + 1) % 4;
        piece = index === 0 || index === 1 ? 'X' : 'O';
        clickDivAndExpectPiece(row + 1, col, piece);
        board[row + 1][col] = piece;
        index = (index + 1) % 4;
        piece = index === 0 || index === 1 ? 'X' : 'O';
      }
    }
    for (col = 0; col < 19; col++) {
      clickDivAndExpectPiece(18, col, piece);
      board[18][col] = piece;
      index = (index + 1) % 4;
      piece = index === 0 || index === 1 ? 'X' : 'O';
    }
    getDiv(0, 0).click();
    // After the game ends, click (in cell 0x0) will be ignored.
    expectPiece(0, 0, "X");
    expectBoardCheat(board);
  });
});
