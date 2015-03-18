angular.module('myApp')
  .controller('Ctrl', ['$window', '$scope', '$log', '$timeout',
    'gameService', 'gameLogic', 'aiService', 'resizeGameAreaService',
    function ($window, $scope, $log, $timeout,
      gameService, gameLogic, aiService, resizeGameAreaService) {

    'use strict';
    
    resizeGameAreaService.setWidthToHeight(1);

    function sendComputerMove() {
      var possibleMoves = gameLogic.getPossibleMoves($scope.board, $scope.turnIndex, $scope.gameData);
      var index = Math.floor((Math.random() * possibleMoves.length));
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
      if ($scope.isYourTurn
          && params.playersInfo[params.yourPlayerIndex].playerId === '') {
        $scope.isYourTurn = false; // to make sure the UI won't send another move.

        // Wait 100 milliseconds until animation ends.
        $timeout(sendComputerMove, 100);
      }
    }

    // Before getting any updateUI, we show an empty board to a viewer (so you can't perform moves).
    updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});

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

    $scope.shouldSlowlyAppear = function (row, col) {
      return $scope.delta !== undefined
          && $scope.delta.row === row && $scope.delta.col === col;
    };

    gameService.setGame({
      gameDeveloperEmail: "wuping.lei@nyu.edu",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      isMoveOk: gameLogic.isMoveOk,
      updateUI: updateUI
    });
  }]);
