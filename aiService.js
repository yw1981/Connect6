'use strict';

angular.module('myApp').factory('aiService', function (alphaBetaService, gameLogic) {

  function getStateScoreForIndex0(move, playerIndex) {
    if (move[0].endMatch) {
      var endMatchScores = move[0].endMatch.endMatchScores;
      return endMatchScores[0] > endMatchScores[1] ? Number.POSITIVE_INFINITY
          : endMatchScores[0] < endMatchScores[1] ? Number.NEGATIVE_INFINITY
          : 0;
    }
    return 0;
  }

  function getNextStates(move, playerIndex) {
    return gameLogic.getPossibleMoves(move[1].set.value, playerIndex, move[3].set.value);
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
  function createComputerMove(board, playerIndex, gameData, alphaBetaLimits) {
    // We use alpha-beta search, where the search states are TicTacToe moves.
    // Recal that a TicTacToe move has 3 operations:
    // 1) endMatch or setTurn
    // 2) {set: {key: 'board', value: ...}}
    // 3) {set: {key: 'delta', value: ...}}]
    // 4) {set: {key: 'gameData', value: ...}}]
    return alphaBetaService.alphaBetaDecision(
      [null, {set: {key: 'board', value: board}}, null, {set: {key: 'gameData', value: gameData}}],
      playerIndex,
      getNextStates,
      getStateScoreForIndex0,
      // If you want to see debugging output in the console, then pass
      // getDebugStateToString instead of null
      null,
      alphaBetaLimits
    );
  }

  return {createComputerMove: createComputerMove};
});