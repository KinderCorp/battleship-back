import { GuestPlayer, LoggedPlayer } from '@interfaces/player.interface';
import { IntRange } from '@interfaces/shared.interface';
import Weapon from '@weapon/weapon.entity';
import { WeaponType } from '@interfaces/weapon.interface';

export enum GameMode {
  ONE_VERSUS_ONE = 'one-versus-one',
}

export enum GameState {
  WAITING_TO_RIVAL = 'waiting-to-rival',
  WAITING_TO_START = 'waiting-to-start',
  PLACING_BOATS = 'placing-boats',
  PLAYING = 'playing',
  FINISHED = 'FINISHED',
}

export type Cell = [x: number, y: number];

export type PlayerBoards = {
  [playerId: string]: Cell[];
};

export interface GameBoat {
  boatName: string;
  hit: Cell[];
  isSunk: boolean;
  emplacement: Cell[];
}

export interface BaseGameSettings {
  gameMode: GameMode;
  firstPlayer: GamePlayer;
  state: GameState;
}

export interface GameBoats extends OneVersusOne<GameBoat> {
  [playerId: string]: GameBoat[];
}

// TASK Search how to indicate the number of key value pairs
// TASK This type in misnamed, rename it
export type OneVersusOne<T> = {
  [playerId: string]: T[];
};

export interface GameSettings extends Omit<BaseGameSettings, 'firstPlayer'> {
  boardDimensions: number;
  boats: GameBoats;
  players: GamePlayer[];
  weapons: OneVersusOne<WeaponType>;
  hasBoatsSafetyZone: boolean;
  timePerTurn: number;
}

export type GameBoard = [number[], number[]];

export type GamePlayer = LoggedPlayer | GuestPlayer;

export interface GameWeapon
  extends Omit<Weapon, 'id' | 'maxAmmunition' | 'requiredLevel'> {
  ammunitionRemaining: number;
}

export type GameArsenal = {
  [playerId: string]: GameWeapon[];
};

export interface Turn {
  actionRemaining: IntRange<0, 2>;
  isTurnOf: GamePlayer;
  nextPlayer: GamePlayer;
}

export interface EndGameRecap {
  loser: GamePlayer[];
  winner: GamePlayer[];
}

export interface Room {
  instanceId: string;
}

export interface RoomData<T> extends Room {
  data: T;
}

export interface ShootParameters {
  targetedPlayerId: GamePlayer['id'];
  weaponName: GameWeapon['name'];
  originCell: Cell;
}

export interface ShotRecap {
  hitCells: Cell[];
  missCells: Cell[];
  weapon: GameWeapon;
}

export enum SocketEventsListening {
  CREATE_GAME = 'create-game',
  PLAYER_JOINING_GAME = 'player-joining-game',
  PLAYER_READY_TO_PLACE_BOATS = 'player-ready-to-place-boats',
  SHOOT = 'shoot',
  START_GAME = 'start-game',
  VALIDATE_PLAYER_BOATS_PLACEMENT = 'validate-player-boats-placement',
}

export enum SocketEventsEmitting {
  ALL_PLAYERS_HAVE_PLACED_THEIR_BOATS = 'all-players-have-placed-their-boats',
  END_GAME = 'end-game',
  ERROR_GAME_IS_FULL = 'error-game-is-full',
  ERROR_GAME_NOT_FOUND = 'error-game-not-found',
  ERROR_WEAPON_NOT_FOUND = 'error-weapon-not-found',
  ERROR_PLAYER_NOT_FOUND = 'error-player-not-found',
  ERROR_INVALID_BOARD_GAME_DIMENSIONS = 'error-invalid-board-game-dimensions',
  ERROR_INVALID_NUMBER_OF_PLAYERS = 'error-invalid-number-of-players',
  ERROR_INVALID_BOAT = 'error-invalid-boat',
  ERROR_MISSING_PLAYER = 'error-missing-player',
  ERROR_GAME_NOT_STARTED = 'error-game-not-started',
  ERROR_OUT_OF_BOUNDS = 'error-out-of-bounds',
  ERROR_CELL_ALREADY_HIT = 'error-cell-already-hit',
  ERROR_NO_AMMUNITION_REMAINING = 'error-no-ammunition-remaining',
  ERROR_UNABLE_TO_CREATE_GAME = 'error-unable-to-create-game',
  ERROR_UNKNOWN_SERVER = 'error-unknown-server',
  GAME_CREATED = 'game-created',
  GAME_STARTED = 'game-started',
  ONE_PLAYER_HAS_PLACED_HIS_BOATS = 'one-player-has-placed-his-boats',
  PLAYER_JOINED = 'player-joined',
  SHOT = 'shot',
  START_PLACING_BOATS = 'start-placing-boats',
}

// TASK Move comment below in readme
/**
 * Classic rules for battleship
 *
 * Grid of 10x10 cells
 *
 * 1 boat of 2
 * 2 boat of 3
 * 1 boat of 4
 * 1 boat of 5
 */
