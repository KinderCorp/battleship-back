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
  [playerName: string]: Cell[];
};

export interface GameBoat {
  boatName: string;
  hit: Cell[];
  isSunk: boolean;
  emplacement: Cell[];
}

export interface BaseGameConfiguration {
  gameMode: GameMode;
  state: GameState;
}

export interface GameBoats extends OneVersusOne<GameBoat> {
  [playerName: string]: GameBoat[];
}

export interface OneVersusOneBoats extends GameBoats {
  player0: GameBoat[];
  player1: GameBoat[];
}

export interface OneVersusOneWeapons extends OneVersusOne<WeaponType> {
  player0: WeaponType[];
  player1: WeaponType[];
}

type OneVersusOne<T> = {
  [playerName: string]: T[];
};

export interface GameConfiguration extends BaseGameConfiguration {
  boardDimensions: number;
  boats: OneVersusOneBoats;
  players: GamePlayer[];
  weapons: OneVersusOneWeapons;
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
  [playerName: string]: GameWeapon[];
};

export interface Turn {
  actionRemaining: IntRange<0, 2>;
  isTurnOf: string;
  nextPlayer: string;
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
