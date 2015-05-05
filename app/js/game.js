angular.module('myApp')
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
