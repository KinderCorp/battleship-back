import { GuestPlayer, LoggedPlayer } from '@interfaces/player.interface';
import Boat from '@boat/boat.entity';
import { BoatName } from '@interfaces/boat.interface';
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
  FINISHED = 'finished',
}

export enum BoatDirection {
  NORTH = 'north',
  EAST = 'east',
  SOUTH = 'south',
  WEST = 'west',
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

// TASK I don't like this name, find better. It's the boats position that frontend sends.
export interface GameBoatConfiguration {
  bowCells: Cell[];
  direction: BoatDirection;
  name: BoatName;
}

export interface BaseGameSettings {
  gameMode: GameMode;
  firstPlayer: GamePlayer;
}

export interface GameBoats extends Versus<GameBoat> {
  [playerId: string]: GameBoat[];
}

export type Versus<T> = {
  [playerId: string]: T[];
};

export interface GameSettings extends Omit<BaseGameSettings, 'firstPlayer'> {
  authorisedFleet: AuthorisedFleet;
  boardDimensions: number;
  hasBoatsSafetyZone: boolean;
  timePerTurn: number;
  weapons: WeaponType[];
}

export type GameBoard = [x: number[], y: number[]];

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

export interface PodiumRecap {
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

export interface TurnRecap {
  shotRecap: ShotRecap;
  turn: Turn;
  isGameOver: boolean;
}

export interface FinalTurnRecap extends Omit<TurnRecap, 'turn'> {
  podiumRecap: PodiumRecap;
}

export interface ShotRecap {
  hitCells: Cell[];
  missCells: Cell[];
  weapon: GameWeapon;
}

export type AuthorisedFleet = {
  authorisedNumber: number;
  boat: { lengthCell: number; name: BoatName; src: string; widthCell: number };
}[];

export type PlayersWithSettings = {
  players: GamePlayer[];
  settings: GameSettings;
};

export interface GameItems {
  boats: Boat[];
}

export enum SocketEventsListening {
  CREATE_GAME = 'create-game',
  LEAVE_ROOM = 'leave-room',
  PLAYERS_READY_TO_PLACE_BOATS = 'players-ready-to-place-boats',
  PLAYER_JOINING_GAME = 'player-joining-game',
  SHOOT = 'shoot',
  START_GAME = 'start-game',
  VALIDATE_PLAYER_BOATS_PLACEMENT = 'validate-player-boats-placement',
}

export enum SocketEventsEmitting {
  ALL_PLAYERS_HAVE_PLACED_THEIR_BOATS = 'all-players-have-placed-their-boats',
  CLOSED_ROOM = 'closed-room',
  END_GAME = 'end-game',
  ERROR_CELL_ALREADY_HIT = 'error-cell-already-hit',
  ERROR_GAME_IS_FULL = 'error-game-is-full',
  ERROR_GAME_NOT_FOUND = 'error-game-not-found',
  ERROR_GAME_NOT_STARTED = 'error-game-not-started',
  ERROR_INVALID_BOARD_GAME_DIMENSIONS = 'error-invalid-board-game-dimensions',
  ERROR_INVALID_BOAT = 'error-invalid-boat',
  ERROR_INVALID_NUMBER_OF_PLAYERS = 'error-invalid-number-of-players',
  ERROR_MISSING_PLAYER = 'error-missing-player',
  ERROR_NOT_HANDLED = 'error-not-handled',
  ERROR_NO_ACTION_REMAINING = 'error-no-action-remaining',
  ERROR_NO_AMMUNITION_REMAINING = 'error-no-ammunition-remaining',
  ERROR_OUT_OF_BOUNDS = 'error-out-of-bounds',
  ERROR_PLAYER_ALREADY_JOINED = 'error-player-already-joined',
  ERROR_PLAYER_IS_NOT_ADMIN = 'error-player-is-not-admin',
  ERROR_PLAYER_NOT_FOUND = 'error-player-not-found',
  ERROR_UNABLE_TO_CREATE_GAME = 'error-unable-to-create-game',
  ERROR_UNKNOWN_SERVER = 'error-unknown-server',
  ERROR_WEAPON_NOT_FOUND = 'error-weapon-not-found',
  GAME_ALREADY_CREATED = 'game-already-created',
  GAME_CREATED = 'game-created',
  GAME_INFORMATION = 'game-information',
  GAME_STARTED = 'game-started',
  ONE_PLAYER_HAS_PLACED_HIS_BOATS = 'one-player-has-placed-his-boats',
  PLAYER_DISCONNECTED = 'player-disconnected',
  PLAYER_JOINED = 'player-joined',
  SHOT = 'shot',
  START_PLACING_BOATS = 'start-placing-boats',
}

export type MaxNumberOfPlayers = 2;
