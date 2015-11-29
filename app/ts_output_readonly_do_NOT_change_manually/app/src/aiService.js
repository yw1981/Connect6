// angular.module('myApp').factory('aiService',
//   ["alphaBetaService", "gameLogic",
//     function (alphaBetaService:any, gameLogic:any) {
var aiService;
(function (aiService) {
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
        }
        else if (threatMoves.length !== 0) {
            return threatMoves[0];
        }
        else {
            // We use alpha-beta search, where the search states are TicTacToe moves.
            // Recal that a TicTacToe move has 3 operations:
            // 1) endMatch or setTurn
            // 2) {set: {key: 'board', value: ...}}
            // 3) {set: {key: 'delta', value: ...}}]
            // 4) {set: {key: 'gameData', value: ...}}]
            return alphaBetaService.alphaBetaDecision([null, { set: { key: 'board', value: state.board } },
                { set: { key: 'delta', value: state.delta } },
                { set: { key: 'gameData', value: state.gameData } }], playerIndex, getNextStates, getStateScoreForIndex0, 
            // If you want to see debugging output in the console, then pass
            // getDebugStateToString instead of null
            window.location.search === '?debug' ? getDebugStateToString : null, alphaBetaLimits);
        }
    }
    aiService.createComputerMove = createComputerMove;
})(aiService || (aiService = {}));
// }]);
