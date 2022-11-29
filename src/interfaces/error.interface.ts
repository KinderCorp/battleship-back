export enum ApiErrorCodes {
  insertionFailed = 'INSERTION_FAILED',
  notFound = 'NOT_FOUND',
  notFoundEntity = 'NOT_FOUND_ENTITY',
  wrongParams = 'WRONG_PARAMS',
  unknownError = 'UNKNOWN_ERROR',
}

export enum ApiErrorMessages {
  notFoundEntity = 'The entity has not been found',
  insertionFailed = 'Fail to insert',
}

// TASK Create ApiErrorMessages

export enum GameEngineErrorCodes {
  missingPlayer = 'MISSING_PLAYER',
  invalidNumberOfPlayers = 'INVALID_NUMBER_OF_PLAYERS',
  invalidBoat = 'INVALID_BOAT',
  missingBoatName = 'MISSING_BOAT_NAME',
  outOfBounds = 'OUT_OF_BOUNDS',
  invalidBoardGameDimensions = 'INVALID_BOARD_GAME_DIMENSIONS',
  cellAlreadyHit = 'CELL_ALREADY_HIT',
  gameNotStarted = 'GAME_NOT_STARTED',
  noRemainingAmmunition = 'NO_REMAINING_AMMUNITION',
}

export enum GameEngineErrorMessages {
  missingPlayer = 'Missing player',
  invalidNumberOfPlayers = 'Invalid number of players',
  twoPlayersRequired = 'A game requires 2 players',
  invalidBoat = 'Invalid boat',
  missingBoatName = 'Missing boat name',
  outOfBounds = 'Out of bounds',
  invalidBoardGameDimensions = 'Invalid board game dimensions',
  cellAlreadyHit = 'Cell already hit',
  gameNotStarted = 'The game is not started',
  noRemainingAmmunition = 'No remaining ammunition',
}
