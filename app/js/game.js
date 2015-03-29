angular.module('myApp')
  .controller('Ctrl', ['$scope', '$log', '$timeout',
    'gameService', 'stateService', 'gameLogic', 'aiService', 
    'resizeGameAreaService', 
    function ($scope, $log, $timeout,
      gameService, stateService, gameLogic, aiService, 
      resizeGameAreaService) {

    'use strict';

    resizeGameAreaService.setWidthToHeight(1);

    function sendComputerMove() {
      var possibleMoves = gameLogic.getPossibleMoves($scope.board, $scope.turnIndex, $scope.gameData);
      var index = Math.floor(Math.random() * possibleMoves.length);
      gameService.makeMove(possibleMoves[index]);
      //gameService.makeMove(
          //aiService.createComputerMove($scope.board, $scope.turnIndex, $scope.gameData,
              // 0.3 seconds for the AI to choose a move
          //{millisecondsLimit: 300}));
    }

    function updateUI(params) {
      $scope.board = params.stateAfterMove.board;
      $scope.gameData =  params.stateAfterMove.gameData;  //get game data
      $scope.delta = params.stateAfterMove.delta;
      $scope.playMode = params.playMode;
      $scope.indexBeforMove = params.turnIndexBeforeMove;
      if ($scope.board === undefined) {
        $scope.board = gameLogic.getInitialBoard();
      }
      if ($scope.gameData === undefined) {
        $scope.gameData = gameLogic.getInitialGameData();
      }
      $scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
        params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
      $scope.turnIndex = params.turnIndexAfterMove;

      // Is it the computer's turn?
      if ($scope.isYourTurn && 
          params.playersInfo[params.yourPlayerIndex].playerId === '') {
        $scope.isYourTurn = false; // to make sure the UI won't send another move.

        // Wait 100 milliseconds until animation ends.
        $timeout(sendComputerMove, 600);
      }
    }

    window.e2e_test_stateService = stateService;

    $scope.cellClicked = function (row, col) {
      $log.info(["Clicked on cell:", row, col]);
      if (!$scope.isYourTurn) {
        return;
      }
      try {
        var move = gameLogic.createMove($scope.board, row, col, $scope.turnIndex,  $scope.gameData);
        $scope.isYourTurn = false; // to prevent making another move
        gameService.makeMove(move);
      } catch (e) {
        $log.info(["Cell is already full in position:", row, col]);
        return;
      }
    };
    
    $scope.shouldShowImage = function (row, col) {
      var cell = $scope.board[row][col];
      return cell !== "";
    };

    $scope.getImageSrc = function (row, col) {
      var cell = $scope.board[row][col];
      return cell === "X" ? "imgsrc/black.png"
          : cell === "O" ? "imgsrc/white.png" : "";
    };

    $scope.getBoardImageSrc = function (row, col) {
      if (row === 0 ) {
        if (col === 0) {
          return "imgsrc/topLeft.png";
        } else if (col === 18) {
          return "imgsrc/topRight.png";
        } else {
          return "imgsrc/top.png";
        }
      } 
      if (row === 18 ) {
        if (col === 0) {
          return "imgsrc/bottomLeft.png";
        } else if (col === 18) {
          return "imgsrc/bottomRight.png";
        } else {
          return "imgsrc/bottom.png";
        }
      } 
      if ( col === 0 && 0 < row && row < 18 ){
        return "imgsrc/left.png";
      }
      if ( col === 18 && 0 < row && row < 18 ){
        return "imgsrc/right.png";
      }
      return "imgsrc/cross.png";
    };

    function shouldSlowlyAppear (row, col) {
      var valid = $scope.delta !== undefined && $scope.delta.row === row && 
          $scope.delta.col === col;
      return valid && ($scope.playMode === "passAndPlay" ||
          $scope.playMode === "playAgainstTheComputer" && $scope.indexBeforMove === 0 ||
          $scope.playMode === "playBlack" && $scope.indexBeforMove === 1 || 
          $scope.playMode === "playWhite" && $scope.indexBeforMove === 0);
    }

    function shouldAnimation (row, col) {
      var valid = $scope.delta !== undefined && $scope.delta.row === row && 
          $scope.delta.col === col;
      return  valid && ($scope.playMode === "playAgainstTheComputer" && $scope.indexBeforMove === 1 ||
          $scope.playMode === "playBlack" && $scope.indexBeforMove === 0 || 
          $scope.playMode === "playWhite" && $scope.indexBeforMove === 1);
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
      if (!$scope.isYourTurn) {
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
      $scope.$apply(function () {
        var msg = "Dragged to " + row + "x" + col;
        $log.info(msg);
        $scope.msg = msg;
      });
    }

    $scope.getPreviewSrc = function () {
      return  $scope.turnIndex === 1 ? "imgsrc/white.png" : "imgsrc/black.png";
    };

    window.handleDragEvent = handleDragEvent;
    $scope.rows = getIntegersTill(rowsNum);
    $scope.cols = getIntegersTill(colsNum);
    $scope.rowsNum = rowsNum;
    $scope.colsNum = colsNum;

    gameService.setGame({
      gameDeveloperEmail: "wuping.lei@nyu.edu",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      isMoveOk: gameLogic.isMoveOk,
      updateUI: updateUI
    });
  }]);
