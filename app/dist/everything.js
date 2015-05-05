angular.module('myApp', ['ngTouch', 'ui.bootstrap']).factory('gameLogic', function () {

  'use strict';

  /** Returns the initial Connect6 board, which is a 19x19 matrix containing ''. */
  function getInitialBoard() {
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
  function getInitialGameData() {
    return {
      totalMove: 0,
      winner: '',
      moveIndex: 1 // set initial index to 1;
    };
  }

  /** Return true if the game ended in a tie when there is no empty cells */
  function isTie(gameData) {
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
  function isWinner(board, row, col, cur) {
    var i, j;
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
  function isThreat(board, row, col, cur){
    var i, j, diff, count = 0;
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
  function createMove(board, row, col, turnIndexBeforeMove, gameData) {
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
    var firstOperation;
    var winner;

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
  function getDifferentMoves(board, turnIndexBeforeMove, delta, gameData) {
    var possibleMoves = [];
    var winningMoves = []; // moves can lead to win
    var threatMoves = [];  // moves can lead opponent to win
    var twoThreeMoves = [];
    var oppTwoThreeMoves = [];

    if(delta === undefined) {
      delta = {row : 9, col : 8};
    }
    var row = delta.row, col = delta.col, max = Math.max(18 - row, row, 18 - col, col) * 2 + 1;
    var n = 0, m = 0, i;
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

  function getPossibleMoves(board, turnIndexBeforeMove, delta, gameData) {
    var allMoves = getDifferentMoves(board, turnIndexBeforeMove, delta, gameData);
    return allMoves.winMoves.concat(allMoves.threatMoves.concat(allMoves.possibleMoves));
  }

  function addMove(row, col, board, turnIndexBeforeMove, gameData, 
    winningMoves, threatMoves, possibleMoves, oppTwoThreeMoves, twoThreeMoves) {
    if (row < 0 || row > 18 || col < 0 || col > 18) {
      return ;
    }
    var move;
    var oppoPiece = turnIndexBeforeMove === 0 ? 'O' : 'X'; // pretend this is opponent's move
    var piece = turnIndexBeforeMove === 0 ? 'X' : 'O';
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

  function isMoveOk(params) {
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

  return {
    getInitialBoard: getInitialBoard,
    getInitialGameData: getInitialGameData,
    getPossibleMoves: getPossibleMoves,
    getDifferentMoves: getDifferentMoves,
    createMove: createMove,
    isMoveOk: isMoveOk
  };
});
;angular.module('myApp')
  .controller('Ctrl', ['$rootScope', '$scope', '$log', '$timeout',
    'gameService', 'stateService', 'gameLogic', 'aiService', 
    'resizeGameAreaService', '$translate', 'dragAndDropService',
    function ($rootScope, $scope, $log, $timeout,
      gameService, stateService, gameLogic, aiService, 
      resizeGameAreaService, $translate, dragAndDropService) {

    'use strict';
    console.log("Translation of 'RULES_OF_CONNECT6' is " + $translate('RULES_OF_CONNECT6'));

    resizeGameAreaService.setWidthToHeight(1);
    $scope.isHelpModalShown = false;
    var canMakeMove = false;
    var isComputerTurn = false;
    var state = null;
    var turnIndex = null;
    var turnIndexBefore = null;
    var playMode = null;
    var animationEnded = true;

    function animationEndedCallback() {
      $rootScope.$apply(function () {
        $log.info("Animation ended");
        animationEnded = true;
        if (isComputerTurn) {
          sendComputerMove();
        }
      });
    }

    function sendComputerMove() {
      gameService.makeMove(
        aiService.createComputerMove(state, turnIndex,
        {maxDepth: 1}));
    }

    document.addEventListener("animationend", animationEndedCallback, false); // standard
    document.addEventListener("webkitAnimationEnd", animationEndedCallback, false); // WebKit
    document.addEventListener("oanimationend", animationEndedCallback, false); // Opera

    function updateUI(params) {
      animationEnded = false;
      state = params.stateAfterMove;
      playMode = params.playMode;
      turnIndexBefore = params.turnIndexBeforeMove;
      if (state.board === undefined) {
        $scope.isHelpModalShown = false;
        animationEnded = true;  //first time need to be true
        state.board = gameLogic.getInitialBoard();
      }
      if (state.gameData === undefined) {
        state.gameData = gameLogic.getInitialGameData();
      }
      canMakeMove = params.turnIndexAfterMove >= 0 && // game is ongoing
        params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
      turnIndex = params.turnIndexAfterMove;

      // Is it the computer's turn?
      isComputerTurn = canMakeMove && 
          params.playersInfo[params.yourPlayerIndex].playerId === '';
      if (isComputerTurn) {
        canMakeMove = false; // to make sure the UI won't send another move.
        //$timeout(sendComputerMove, 700);
        if (state.delta === undefined) {
          // there is not going to be an animation, so call sendComputerMove() now (can happen in ?onlyAIs mode)
          sendComputerMove();
        }
      }
    }

    window.e2e_test_stateService = stateService;

    $scope.cellClicked = function (row, col) {
      $log.info(["Clicked on cell:", row, col]);
      if (!canMakeMove) {
        return;
      }
      try {
        var move = gameLogic.createMove(state.board, row, col, turnIndex,  state.gameData);
        canMakeMove = false; // to prevent making another move
        gameService.makeMove(move);
      } catch (e) {
        $log.info(["Cell is already full in position:", row, col]);
        return;
      }
    };
    
    $scope.shouldShowImage = function (row, col) {
      var cell = state.board[row][col];
      return cell !== "";
    };

    $scope.getImageSrc = function (row, col) {
      var cell = state.board[row][col];
      return cell === "X" ? "imgsrc/black.png"
          : cell === "O" ? "imgsrc/white.png" : "";
    };

    function shouldSlowlyAppear (row, col) {
      var valid = !animationEnded && state.delta !== undefined && state.delta.row === row && 
          state.delta.col === col;
      return valid && 
          (playMode === "playAgainstTheComputer" && turnIndexBefore === 0 ||
          playMode === "passAndPlay" ||
          playMode === "playBlack" && turnIndexBefore === 1 || 
          playMode === "playWhite" && turnIndexBefore === 0);
    }

    function shouldAnimation (row, col) {
      var valid = !animationEnded && state.delta !== undefined && state.delta.row === row && 
          state.delta.col === col;
      return valid && !shouldSlowlyAppear(row, col);
    }

    $scope.getClass = function (row, col) {
      return {piece : true, animation: shouldAnimation(row, col),
          slowlyAppear: shouldSlowlyAppear(row, col)};
    };
    
    function getIntegersTill(number) {
      var res = [];
      for (var i = 0; i < number; i++) {
        res.push(i);
      }
      return res;
    }
    var draggingLines = document.getElementById("draggingLines");
    var horizontalDraggingLine = document.getElementById("horizontalDraggingLine");
    var verticalDraggingLine = document.getElementById("verticalDraggingLine");
    var clickToDragPiece = document.getElementById("clickToDragPiece");
    var gameArea = document.getElementById("gameArea");
    var rowsNum = 19;
    var colsNum = 19;

    function handleDragEvent(type, clientX, clientY) {
      //if not your turn, dont handle event
      if (!canMakeMove || !animationEnded) {
        return;
      }
      // Center point in gameArea
      var x = clientX - gameArea.offsetLeft;
      var y = clientY - gameArea.offsetTop;
      // Is outside gameArea?
      if (x < 0 || y < 0 || x >= gameArea.clientWidth || y >= gameArea.clientHeight) {
        clickToDragPiece.style.display = "none";
        draggingLines.style.display = "none";
        return;
      }

      clickToDragPiece.style.display = "inline";
      draggingLines.style.display = "inline";
      
      // Inside gameArea. Let's find the containing square's row and col
      var col = Math.floor(colsNum * x / gameArea.clientWidth);
      var row = Math.floor(rowsNum * y / gameArea.clientHeight);

      var centerXY = getSquareCenterXY(row, col);
      verticalDraggingLine.setAttribute("x1", centerXY.x);
      verticalDraggingLine.setAttribute("x2", centerXY.x);
      horizontalDraggingLine.setAttribute("y1", centerXY.y);
      horizontalDraggingLine.setAttribute("y2", centerXY.y);
      var topLeft = getSquareTopLeft(row, col);
      clickToDragPiece.style.left = topLeft.left + "px";
      clickToDragPiece.style.top = topLeft.top + "px";

      if (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup") {
        // drag ended
        clickToDragPiece.style.display = "none";
        draggingLines.style.display = "none";
        dragDone(row, col);
      }
    }
    function getSquareWidthHeight() {
      return {
        width: gameArea.clientWidth / colsNum,
        height: gameArea.clientHeight / rowsNum
      };
    }

    function getSquareTopLeft(row, col) {
      var size = getSquareWidthHeight();
      return {top: row * size.height, left: col * size.width};
    }

    function getSquareCenterXY(row, col) {
      var size = getSquareWidthHeight();
      return {
        x: col * size.width + size.width / 2,
        y: row * size.height + size.height / 2
      };
    }

    function dragDone(row, col) {
      $scope.cellClicked(row, col);
      $log.info("Dragged to " + row + "x" + col);
    }

    $scope.getPreviewSrc = function () {
      return  turnIndex === 1 ? "imgsrc/white.png" : "imgsrc/black.png";
    };

    window.handleDragEvent = handleDragEvent;
    $scope.rows = getIntegersTill(rowsNum);
    $scope.cols = getIntegersTill(colsNum);
    $scope.rowsNum = rowsNum;
    $scope.colsNum = colsNum;
    dragAndDropService.addDragListener("gameArea", handleDragEvent);

    gameService.setGame({
      gameDeveloperEmail: "wuping.lei@nyu.edu",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      isMoveOk: gameLogic.isMoveOk,
      updateUI: updateUI
    });
  }]);
;angular.module('myApp').factory('aiService',
  ["alphaBetaService", "gameLogic", 
    function (alphaBetaService, gameLogic) {

  'use strict';

  function getStateScoreForIndex0(move) {
    if (move[0].endMatch) {
      var endMatchScores = move[0].endMatch.endMatchScores;
      return endMatchScores[0] > endMatchScores[1] ? Number.POSITIVE_INFINITY
          : endMatchScores[0] < endMatchScores[1] ? Number.NEGATIVE_INFINITY
          : 0;
    }
    var board = move[1].set.value;
    var row = move[2].set.value.row;
    var col = move[2].set.value.col;
    var black = getPieces(board, row, col, "X");
    var white = getPieces(board, row, col, "O");
    return white - black;
  }
  
  //get consecutive piece around the row x col
  function getPieces(board, row, col, piece) {
    var i, j, sum = 0;
    //check row
    i = row - 1;
    j = row + 1;
    while (i >= 0 && board[i][col] === piece) {
      i--;
    }
    while (j < board.length && board[j][col] === piece) {
      j++;
    }
    //sum = Math.max(sum, j - i - 2);
    sum += j - i - 2;

    //check column
    i = col - 1;
    j = col + 1;
    while (i >= 0 && board[row][i] === piece) {
      i--;
    }
    while (j < board.length && board[row][j] === piece) {
      j++;
    }
    //sum = Math.max(sum, j - i - 2);
    sum += j - i - 2;

    //check main diagonal
    i = -1;
    j = 1;
    while (row + i >= 0 && col + i >= 0 && board[row + i][col + i] === piece) {
      i--;
    }
    while (row + j < board.length && col + j < board.length && board[row + j][col + j] === piece) {
      j++;
    }
    //sum = Math.max(sum, j - i - 2);
    sum += j - i - 2;

    //check back diagonal
    i = -1;
    j = 1;
    while (row + i >= 0 && col - i < board.length && board[row + i][col - i] === piece) {
      i--;
    }
    while (row + j < board.length && col - j >= 0 && board[row + j][col - j] === piece) {
      j++;
    }
    //sum = Math.max(sum, j - i - 2);
    sum += j - i - 2;
    return sum;
  }

  function getNextStates(move, playerIndex) {
    return gameLogic.getPossibleMoves(move[1].set.value, playerIndex, move[2].set.value, move[3].set.value);
  }

  function getDebugStateToString(move) {
    return "\n" + move[1].set.value.join("\n") + "\n";
  }

  /**
   * Returns the move that the computer player should do for the given board.
   * alphaBetaLimits is an object that sets a limit on the alpha-beta search,
   * and it has either a millisecondsLimit or maxDepth field:
   * millisecondsLimit is a time limit, and maxDepth is a depth limit.
   */
  function createComputerMove(state, playerIndex, alphaBetaLimits) {
    var allMoves = gameLogic.getDifferentMoves(state.board, playerIndex, state.delta, state.gameData);
    var winMoves = allMoves.winMoves;
    var threatMoves = allMoves.threatMoves;
    if (winMoves.length !== 0) {
      return winMoves[0];
    } else if (threatMoves.length !== 0) {
      return threatMoves[0];
    } else {
      // We use alpha-beta search, where the search states are TicTacToe moves.
      // Recal that a TicTacToe move has 3 operations:
      // 1) endMatch or setTurn
      // 2) {set: {key: 'board', value: ...}}
      // 3) {set: {key: 'delta', value: ...}}]
      // 4) {set: {key: 'gameData', value: ...}}]
      return alphaBetaService.alphaBetaDecision(
        [null, {set: {key: 'board', value: state.board}},
          {set: {key: 'delta', value: state.delta}},
          {set: {key: 'gameData', value: state.gameData}}],
        playerIndex,
        getNextStates,
        getStateScoreForIndex0,
        // If you want to see debugging output in the console, then pass
        // getDebugStateToString instead of null
        window.location.search === '?debug' ? getDebugStateToString : null,
        alphaBetaLimits
      );
    }
  }

  return {createComputerMove: createComputerMove};
}]);
