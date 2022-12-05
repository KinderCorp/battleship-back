// TASK Reformalise nomenclature

export enum ApiErrorCodes {
  insertionFailed = 'INSERTION_FAILED',
  notFound = 'NOT_FOUND',
  notFoundEntity = 'NOT_FOUND_ENTITY',
  unknownError = 'UNKNOWN_ERROR',
  wrongParams = 'WRONG_PARAMS',
}

export enum ApiErrorMessages {
  insertionFailed = 'Fail to insert',
  notFoundEntity = 'The entity has not been found',
}

export enum GameEngineErrorCodes {
  NO_ACTION_REMAINING = 'no-action-remaining',
  PLAYER_NOT_FOUND = 'player-not-found',
  WEAPON_NOT_FOUND = 'weapon-not-found',
  cellAlreadyHit = 'CELL_ALREADY_HIT',
  gameNotStarted = 'GAME_NOT_STARTED',
  invalidBoardGameDimensions = 'INVALID_BOARD_GAME_DIMENSIONS',
  invalidBoat = 'INVALID_BOAT',
  invalidNumberOfPlayers = 'INVALID_NUMBER_OF_PLAYERS',
  missingBoatName = 'MISSING_BOAT_NAME',
  missingPlayer = 'MISSING_PLAYER',
  noAmmunitionRemaining = 'NO_AMMUNITION_REMAINING',
  outOfBounds = 'OUT_OF_BOUNDS',
}

export enum GameEngineErrorMessages {
  NO_ACTION_REMAINING = 'There is no action remaining',
  PLAYER_NOT_FOUND = 'The player has not been found',
  WEAPON_NOT_FOUND = 'The weapon has not been found',
  cellAlreadyHit = 'Cell already hit',
  gameNotStarted = 'The game is not started',
  invalidBoardGameDimensions = 'Invalid board game dimensions',
  invalidBoat = 'Invalid boat',
  invalidNumberOfPlayers = 'Invalid number of players',
  missingBoatName = 'Missing boat name',
  missingPlayer = 'Missing player',
  noAmmunitionRemaining = 'No ammunition remaining',
  outOfBounds = 'Out of bounds',
  twoPlayersRequired = 'A game requires 2 players',
}
