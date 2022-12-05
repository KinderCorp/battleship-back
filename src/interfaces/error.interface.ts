// TASK Reformalise nomenclature

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

export enum GameEngineErrorCodes {
  missingPlayer = 'MISSING_PLAYER',
  invalidNumberOfPlayers = 'INVALID_NUMBER_OF_PLAYERS',
  invalidBoat = 'INVALID_BOAT',
  missingBoatName = 'MISSING_BOAT_NAME',
  outOfBounds = 'OUT_OF_BOUNDS',
  invalidBoardGameDimensions = 'INVALID_BOARD_GAME_DIMENSIONS',
  cellAlreadyHit = 'CELL_ALREADY_HIT',
  gameNotStarted = 'GAME_NOT_STARTED',
  noAmmunitionRemaining = 'NO_AMMUNITION_REMAINING',
  WEAPON_NOT_FOUND = 'weapon-not-found',
  PLAYER_NOT_FOUND = 'player-not-found',
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
  noAmmunitionRemaining = 'No ammunition remaining',
  WEAPON_NOT_FOUND = 'The weapon has not been found',
  PLAYER_NOT_FOUND = 'The player has not been found',
}
