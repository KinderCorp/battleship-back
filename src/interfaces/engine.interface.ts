import { GuestPlayer, LoggedPlayer } from '@interfaces/player.interface';

export enum GameMode {
  OneVersusOne = '1v1',
}

export enum GameState {
  waitingToStart = 'WAITING_TO_START',
  placingBoats = 'PLACING_BOATS',
  playing = 'PLAYING',
  finished = 'FINISHED',
}

export interface BoatPlacement {
  boatName: string;
  emplacement: [number, number][];
}

export interface BaseGameConfiguration {
  gameMode: GameMode;
  state: GameState;
}

export interface GameConfiguration extends BaseGameConfiguration {
  boardDimensions: number;
  boats: {
    player1: BoatPlacement[];
    player2: BoatPlacement[];
  };
  players: GamePlayer[];
  weapons: number[];
  hasBoatsSafetyZone: boolean;
  timePerTurn: number;
}

export type GameBoard = [number[], number[]];

export type GamePlayer = LoggedPlayer | GuestPlayer;

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
