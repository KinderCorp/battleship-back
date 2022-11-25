export enum ApiErrorCodes {
  insertionFailed = 'INSERTION_FAILED',
  notFound = 'NOT_FOUND',
  wrongParams = 'WRONG_PARAMS',
}

// TASK Create ApiErrorMessages

export enum GameEngineErrorCodes {
  missingPlayer = 'MISSING_PLAYER',
  invalidNumberOfPlayers = 'INVALID_NUMBER_OF_PLAYERS',
  invalidBoat = 'INVALID_BOAT',
  missingBoatName = 'MISSING_BOAT_NAME',
  outOfBounds = 'OUT_OF_BOUNDS',
}

export enum GameEngineErrorMessages {
  missingPlayer = 'Missing player',
  invalidNumberOfPlayers = 'Invalid number of players',
  twoPlayersRequired = 'A game requires 2 players',
  invalidBoat = 'Invalid boat',
  missingBoatName = 'Missing boat name',
  outOfBounds = 'Out of bounds',
}
