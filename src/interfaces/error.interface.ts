export enum ApiErrorCodes {
  INSERTION_FAILED = 'insertion-failed',
  NOT_FOUND_ENTITY = 'not-found-entity',
  WRONG_PARAMS = 'wrong-params',
}

export enum ApiErrorMessages {
  INSERTION_FAILED = 'Fail to insert',
  NOT_FOUND_ENTITY = 'The entity has not been found',
}

export enum GameEngineErrorCodes {
  CELL_ALREADY_HIT = 'cell-already-hit',
  GAME_NOT_STARTED = 'game-not-started',
  INVALID_BOARD_GAME_DIMENSIONS = 'invalid-board-game-dimensions',
  INVALID_BOAT = 'invalid-boat',
  INVALID_GAME_MODE = 'invalid-game-mode',
  INVALID_NUMBER_OF_PLAYERS = 'invalid-number-of-player',
  MISSING_PLAYER = 'missing-player',
  NO_ACTION_REMAINING = 'no-action-remaining',
  NO_AMMUNITION_REMAINING = 'no-ammunition-remaining',
  OUT_OF_BOUNDS = 'out-of-bounds',
  PLAYER_NOT_FOUND = 'player-not-found',
  UNAUTHORISED_FLEET = 'unauthorised-fleet',
  WEAPON_NOT_FOUND = 'weapon-not-found',
}

export enum GameEngineErrorMessages {
  CELL_ALREADY_HIT = 'Cell already hit',
  GAME_NOT_STARTED = 'The game is not started',
  INVALID_BOARD_GAME_DIMENSIONS = 'Invalid board game dimensions',
  INVALID_BOAT = 'Invalid boat',
  INVALID_GAME_MODE = 'The game mode is invalid',
  INVALID_NUMBER_OF_PLAYERS = 'Invalid number of players',
  NO_ACTION_REMAINING = 'There is no action remaining',
  NO_AMMUNITION_REMAINING = 'No ammunition remaining',
  OUT_OF_BOUNDS = 'Out of bounds',
  PLAYER_NOT_FOUND = 'The player has not been found',
  TWO_PLAYERS_REQUIRED = 'A game requires 2 players',
  UNAUTHORISED_FLEET = 'The fleet is unauthorised',
  WEAPON_NOT_FOUND = 'The weapon has not been found',
}
