// angular.module('myApp', ['ngTouch', 'ui.bootstrap']).factory('gameLogic', function () {
//

module gameLogic {
  'use strict';

  /** Returns the initial Connect6 board, which is a 19x19 matrix containing ''. */
  export function getInitialBoard() : string[][]{
    return [['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
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
  }

  /** Returns an object contains come game data including the winner */
  export function getInitialGameData():IGameData {
    return {
      totalMove: 0,
      winner: '',
      moveIndex: 1 // set initial index to 1;
    };
  }

  /** Return true if the game ended in a tie when there is no empty cells */
  function isTie(gameData:IGameData) {
    //reserved for checking tie
    /*var i, j;
    for (i = 0; i < 19; i++) {
      for (j = 0; j < 19; j++) {
        if (board[i][j] === '') {
          return false;
        }
      }
    }*/
    return gameData.totalMove >= 361;
  }

  /**
   * Return true if there this move can win the game.
   *  A move that can win the game is the move that connects more than 6 pieces.
   */
  function isWinner(board:string[][], row:number, col:number, cur:string) {
    var i:number, j:number;
    //check col
    i = row - 1;
    j = row + 1;
    while (i >= 0 && board[i][col] === cur) {
      i--;
    }
    while (j < board.length && board[j][col] === cur) {
      j++;
    }
    if (j - i - 1 >= 6) {
      return true;
    }

    //check row
    i = col - 1;
    j = col + 1;
    while (i >= 0 && board[row][i] === cur) {
      i--;
    }
    while (j < board.length && board[row][j] === cur) {
      j++;
    }
    if (j - i - 1 >= 6) {
      return true;
    }

    //check main diagonal
    i = -1;
    j = 1;
    while (row + i >= 0 && col + i >= 0 && board[row + i][col + i] === cur) {
      i--;
    }
    while (row + j < board.length && col + j < board.length && board[row + j][col + j] === cur) {
      j++;
    }
    if (j - i - 1 >= 6) {
      return true;
    }

    //check back diagonal
    i = -1;
    j = 1;
    while (row + i >= 0 && col - i < board.length && board[row + i][col - i] === cur) {
      i--;
    }
    while (row + j < board.length && col - j >= 0 && board[row + j][col - j] === cur) {
      j++;
    }
    if (j - i - 1 >= 6) {
      return true;
    }

    //No six in a row, return false.
    return false;
  }

  /**
   * Return true if there this move can cause threats such as four in a row
   * or five in a row.
   */
  function isThreat(board:string[][], row:number, col:number, cur:string){
    var i:number, j:number, diff:number, count = 0;
    //check col
    i = row - 1;
    j = row + 1;

    while (i >= 0 && board[i][col] === cur) {
      i--;
    }
    while (j < board.length && board[j][col] === cur) {
      j++;
    }
    diff = j - i - 1;
    if (diff === 5 && (j < board.length && board[j][col] === "" ||
        i >= 0 && board[i][col] === "") || diff === 6) {
      return 1;
    }
    if (diff === 3 && j < board.length && board[j][col] === "" &&
        i >= 0 && board[i][col] === "" || diff === 4) {
      count++;
    }

    //check row
    i = col - 1;
    j = col + 1;
    while (i >= 0 && board[row][i] === cur) {
      i--;
    }
    while (j < board.length && board[row][j] === cur) {
      j++;
    }
    diff = j - i - 1;
    if (diff === 5 && (j < board.length && board[row][j] === "" ||
        i >= 0 && board[row][i] === "") || diff === 6) {
      return 1;
    }
    if (diff === 3 && j < board.length && board[row][j] === "" &&
        i >= 0 && board[row][i] === "" || diff === 4) {
      count++;
    }

    //check main diagonal
    i = -1;
    j = 1;
    while (row + i >= 0 && col + i >= 0 && board[row + i][col + i] === cur) {
      i--;
    }
    while (row + j < board.length && col + j < board.length && board[row + j][col + j] === cur) {
      j++;
    }
    diff = j - i - 1;
    if (diff === 5 && (row + j < board.length && board[row + j][col + j] === "" ||
        row + i >= 0 && board[row + i][col + i] === "") ||
        diff === 6) {
      return 1;
    }
    if (diff === 3 && row + j < board.length && board[row + j][col + j] === "" &&
        row + i >= 0 && board[row + i][col + i] === "" || diff === 4) {
      count++;
    }

    //check back diagonal
    i = -1;
    j = 1;
    while (row + i >= 0 && col - i < board.length && board[row + i][col - i] === cur) {
      i--;
    }
    while (row + j < board.length && col - j >= 0 && board[row + j][col - j] === cur) {
      j++;
    }
    diff = j - i - 1;
    if (diff === 5 && (row + j < board.length && board[row + j][col - j] === "" ||
        row + i >= 0 && board[row + i][col - i] === "") ||
        diff === 6) {
      return 1;
    }
    if (diff === 3 && row + j < board.length && board[row + j][col - j] === "" &&
        row + i >= 0 && board[row + i][col - i] === "" || diff === 4) {
      count++;
    }
    //No six in a row, return false.
    return count >= 2 ? 2 : 0;
   }

  /**
   * Returns the move that should be performed when player
   * with index turnIndexBeforeMove makes a move in cell row X col.
   */
  export function createMove(board:string[][], row:number, col:number, turnIndexBeforeMove:number, gameData:IGameData) {
    if (board === undefined) {
      board = getInitialBoard();
    }
    if (gameData === undefined) {
      gameData = getInitialGameData();
    }
    if (board[row][col] !== '') {
      throw new Error("One can only make a move in an empty position!");
    }

    //If the cell is empty, it will never be a tie, thus just check winner
    if (gameData.winner !== '') {
      throw new Error("Can only make a move if the game is not over!");
    }

    var boardAfterMove = angular.copy(board);
    var gameDataAfterMove = angular.copy(gameData);
    var firstOperation:IOperation;
    var winner:string;

    //Player has two moves each turn, thus give first two moves to 'X' and the other two as 'O'
    //Each turn increase move index and mod 4.
    //The first turn only has one move, thus we could give the initial move index as 1.
    gameDataAfterMove.moveIndex = (gameDataAfterMove.moveIndex + 1) % 4;
    gameDataAfterMove.totalMove++; // increase total moves;
    boardAfterMove[row][col] = turnIndexBeforeMove === 0 ? 'X' : 'O';
    winner = isWinner(boardAfterMove, row, col, boardAfterMove[row][col]) ? boardAfterMove[row][col] : '';

    if (winner !== '' || isTie(gameDataAfterMove)) {
      // Game over.
      firstOperation = {endMatch: {endMatchScores:
        winner === 'X' ? [1, 0] : winner === 'O' ? [0, 1] : [0, 0]}};
    } else {
      firstOperation = {setTurn: {turnIndex: gameDataAfterMove.moveIndex === 0 || gameDataAfterMove.moveIndex === 1 ? 0 : 1 }};
    }

    gameDataAfterMove.winner = winner;
    return [firstOperation,
            {set: {key: 'board', value: boardAfterMove}},
            {set: {key: 'delta', value: {row: row, col: col}}},
            {set: {key: 'gameData', value: gameDataAfterMove}}];
  }

  /**
   * Returns all the possible moves for the given board and turnIndexBeforeMove.
   * Returns an empty array if the game is over.
   */
  export function getDifferentMoves(board:string[][], turnIndexBeforeMove:number, delta:IDelta, gameData:IGameData) {
    var possibleMoves:IMove[] = [];
    var winningMoves:IMove[] = []; // moves can lead to win
    var threatMoves:IMove[] = [];  // moves can lead opponent to win
    var twoThreeMoves:IMove[] = [];
    var oppTwoThreeMoves:IMove[] = [];

    if(delta === undefined) {
      delta = {row : 9, col : 8};
    }
    var row = delta.row, col = delta.col, max = Math.max(18 - row, row, 18 - col, col) * 2 + 1;
    var n = 0, m = 0, i = 0;
    while (true) {
      if (++n === max) {
        break;
      }
      for (i = 0; i < n; i++) {
        addMove(row, ++col, board, turnIndexBeforeMove, gameData,
            winningMoves, threatMoves, possibleMoves, oppTwoThreeMoves, twoThreeMoves);
      }
      if (++m === max) {
        break;
      }
      for (i = 0; i < m; i++) {
        addMove(++row, col, board, turnIndexBeforeMove, gameData,
            winningMoves, threatMoves, possibleMoves, oppTwoThreeMoves, twoThreeMoves);
      }
      if (++n === max) {
        break;
      }
      for (i = 0; i < n; i++) {
        addMove(row, --col, board, turnIndexBeforeMove, gameData,
            winningMoves, threatMoves, possibleMoves, oppTwoThreeMoves, twoThreeMoves);
      }
      if (++m === max) {
        break;
      }
      for(i = 0; i < m; i++){
        addMove(--row, col, board, turnIndexBeforeMove, gameData,
            winningMoves, threatMoves, possibleMoves, oppTwoThreeMoves, twoThreeMoves);
      }
    }
    return {
      winMoves : winningMoves,
      threatMoves : threatMoves.concat(oppTwoThreeMoves.concat(twoThreeMoves)),
      possibleMoves : possibleMoves
    };
  }

  export function getPossibleMoves(board:string[][], turnIndexBeforeMove:number, delta:IDelta, gameData:IGameData) {
    var allMoves = getDifferentMoves(board, turnIndexBeforeMove, delta, gameData);
    return allMoves.winMoves.concat(allMoves.threatMoves.concat(allMoves.possibleMoves));
  }

  function addMove(row:number, col:number, board:string[][], turnIndexBeforeMove:number, gameData:IGameData,
    winningMoves:IMove[], threatMoves:IMove[], possibleMoves:IMove[], oppTwoThreeMoves:IMove[], twoThreeMoves:IMove[]) {
    if (row < 0 || row > 18 || col < 0 || col > 18) {
      return ;
    }
    var move:IMove;
    var oppoPiece:string = turnIndexBeforeMove === 0 ? 'O' : 'X'; // pretend this is opponent's move
    var piece:string = turnIndexBeforeMove === 0 ? 'X' : 'O';
    try {
      move = createMove(board, row, col, turnIndexBeforeMove, gameData);
      var oppThreat = isThreat(board, row, col, oppoPiece);
      var threat = isThreat(board, row, col, piece);
      if (move[0].endMatch || threat === 1 && (gameData.moveIndex === 2 || gameData.moveIndex === 0)) {
        winningMoves.push(move);
      } else if (oppThreat === 1) {
        threatMoves.push(move);
      } else if (oppThreat === 2) {
        oppTwoThreeMoves.push(move);
      } else if (threat === 2) {
        twoThreeMoves.push(move);
      } else {
        possibleMoves.push(move);
      }
    } catch (ignore) {
      // The cell in that position was full.
    }
  }

  export function isMoveOk(params:IUpdateUI) {
    var move = params.move;
    var turnIndexBeforeMove = params.turnIndexBeforeMove;
    var stateBeforeMove = params.stateBeforeMove;
    try {
      var deltaValue = move[2].set.value;
      var row = deltaValue.row;
      var col = deltaValue.col;
      var board = stateBeforeMove.board;
      var gameData = stateBeforeMove.gameData;
      var expectedMove = createMove(board, row, col, turnIndexBeforeMove, gameData);
      if (!angular.equals(move, expectedMove)) {
        return false;
      }
    } catch (e) {
      // if there are any exceptions then the move is illegal
      return false;
    }
    return true;
  }

}
