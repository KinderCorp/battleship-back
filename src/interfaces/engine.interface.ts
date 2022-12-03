import { GuestPlayer, LoggedPlayer } from '@interfaces/player.interface';
import { IntRange } from '@interfaces/shared.interface';
import Weapon from '@weapon/weapon.entity';
import { WeaponType } from '@interfaces/weapon.interface';

export enum GameMode {
  OneVersusOne = '1v1',
}

export enum GameState {
  waitingToRival = 'WAITING_TO_RIVAL',
  waitingToStart = 'WAITING_TO_START',
  placingBoats = 'PLACING_BOATS',
  playing = 'PLAYING',
  finished = 'FINISHED',
}

export type Cell = [number, number];

export type PlayerBoards = {
  [playerId: string]: Cell[];
};

export interface GameBoat {
  boatName: string;
  hit: Cell[];
  isSunk: boolean;
  emplacement: Cell[];
}

export interface BaseGameConfiguration {
  gameMode: GameMode;
  firstPlayer: GamePlayer;
  state: GameState;
}

export interface GameBoats extends OneVersusOne<GameBoat> {
  [playerId: string]: GameBoat[];
}

// TASK Search how to indicate the number of key value pairs
export type OneVersusOne<T> = {
  [playerId: string]: T[];
};

export interface GameConfiguration
  extends Omit<BaseGameConfiguration, 'firstPlayer'> {
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

// TASK Move this in readme
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
