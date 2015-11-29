
module game {
    export var isHelpModalShown = false;
    export var rowsNum = 19;
    export var colsNum = 19;
    export let rows = getIntegersTill(rowsNum);
    export let cols = getIntegersTill(colsNum);
    var canMakeMove = false;
    var isComputerTurn = false;
    var state:any = null;
    var turnIndex:any = null;
    var turnIndexBefore:any = null;
    var playMode:any = null;
    var animationEnded = true;

    'use strict';

    export function init () {
      console.log("Translation of 'RULES_OF_CONNECT6' is " + translate('RULES_OF_CONNECT6'));

      resizeGameAreaService.setWidthToHeight(1);

      dragAndDropService.addDragListener("gameArea", handleDragEvent);

      gameService.setGame({
        minNumberOfPlayers: 2,
        maxNumberOfPlayers: 2,
        isMoveOk: gameLogic.isMoveOk,
        updateUI: updateUI
      });

      document.addEventListener("animationend", animationEndedCallback, false); // standard
      document.addEventListener("webkitAnimationEnd", animationEndedCallback, false); // WebKit
      document.addEventListener("oanimationend", animationEndedCallback, false); // Opera
    }

    function animationEndedCallback() {
      $rootScope.$apply(function () {
        log.info("Animation ended");
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


    function updateUI(params:any) {
      animationEnded = false;
      state = params.stateAfterMove;
      playMode = params.playMode;
      turnIndexBefore = params.turnIndexBeforeMove;
      if (state.board === undefined) {
        isHelpModalShown = false;
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

    //window.e2e_test_stateService = stateService;

    export function cellClicked (row:any, col:any) {
      log.info(["Clicked on cell:", row, col]);
      if (!canMakeMove) {
        return;
      }
      try {
        var move = gameLogic.createMove(state.board, row, col, turnIndex,  state.gameData);
        canMakeMove = false; // to prevent making another move
        gameService.makeMove(move);
      } catch (e) {
        log.info(["Cell is already full in position:", row, col]);
        return;
      }
    };

    export function shouldShowImage (row:any, col:any) {
      var cell = state.board[row][col];
      return cell !== "";
    };

    export function getImageSrc (row:any, col:any) {
      var cell = state.board[row][col];
      return cell === "X" ? "imgsrc/black.png"
          : cell === "O" ? "imgsrc/white.png" : "";
    };

    function shouldSlowlyAppear (row:any, col:any) {
      var valid = !animationEnded && state.delta !== undefined && state.delta.row === row &&
          state.delta.col === col;
      return valid &&
          (playMode === "playAgainstTheComputer" && turnIndexBefore === 0 ||
          playMode === "passAndPlay" ||
          playMode === "playBlack" && turnIndexBefore === 1 ||
          playMode === "playWhite" && turnIndexBefore === 0);
    }

    function shouldAnimation (row:any, col:any) {
      var valid = !animationEnded && state.delta !== undefined && state.delta.row === row &&
          state.delta.col === col;
      return valid && !shouldSlowlyAppear(row, col);
    }

    export function getClass (row:any, col:any) {
      return {piece : true, animation: shouldAnimation(row, col),
          slowlyAppear: shouldSlowlyAppear(row, col)};
    };

    function getIntegersTill(number:any) {
      var res:any = [];
      for (var i = 0; i < number; i++) {
        res.push(i);
      }
      return res;
    }

    export function handleDragEvent(type:any, clientX:any, clientY:any) {
      log.info("handleDragEvent", canMakeMove, animationEnded, type, clientX, clientY);
      //if not your turn, dont handle event
      if (!canMakeMove || !animationEnded) {
        return;
      }
      var draggingLines = document.getElementById("draggingLines");
      var horizontalDraggingLine = document.getElementById("horizontalDraggingLine");
      var verticalDraggingLine = document.getElementById("verticalDraggingLine");
      var clickToDragPiece = document.getElementById("clickToDragPiece");
      var gameArea = document.getElementById("gameArea");

      function getSquareWidthHeight() {
        return {
          width: gameArea.clientWidth / colsNum,
          height: gameArea.clientHeight / rowsNum
        };
      }

      function getSquareTopLeft(row: number, col:number) {
        var size = getSquareWidthHeight();
        return {top: row * size.height, left: col * size.width};
      }

      function getSquareCenterXY(row:number, col:number) {
        var size = getSquareWidthHeight();
        return {
          x: col * size.width + size.width / 2,
          y: row * size.height + size.height / 2
        };
      }

      function dragDone(row:number, col:number) {
        cellClicked(row, col);
        log.info("Dragged to " + row + "x" + col);
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

      var centerXY:ICenterXY = getSquareCenterXY(row, col);
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


    export function getPreviewSrc() {
      return  turnIndex === 1 ? "imgsrc/white.png" : "imgsrc/black.png";
    };
  }




// angular.module('myApp')
//   .controller('Ctrl', ['$rootScope', '$scope', '$log', '$timeout',
//     'gameService', 'stateService', 'gameLogic', 'aiService',
//     'resizeGameAreaService', '$translate', 'dragAndDropService',
//     function ($rootScope:any, $scope:any, $log:any, $timeout:any,
//       gameService:any, stateService:any, gameLogic:any, aiService:any,
//       resizeGameAreaService:any, $translate:any, dragAndDropService:any) {

// }]);

angular.module('myApp',  ['ngTouch', 'ui.bootstrap', 'gameServices'])
  .run(function() {
      $rootScope['game'] = game;
      translate.setLanguage('en', {
        "RULES_OF_CONNECT6": "Rules of Connect6",
        "RULES_SLIDE1": "You and your opponent take turns to place stones on the board. Black makes the first move and can only place one stone on the board.",
        "RULES_SLIDE2": "After first move, each player (must) place two stones every move.",
        "RULES_SLIDE3": "The first to get six stones in a row, column or diagonal wins.",
        "CLOSE":"Close"
      });
      game.init();
  });
