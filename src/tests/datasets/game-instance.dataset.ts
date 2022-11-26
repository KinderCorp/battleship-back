import {
  GameBoat,
  GameConfiguration,
  GameMode,
  GameState,
  PlayerBoards,
} from '@interfaces/engine.interface';
import { GuestPlayer, LoggedPlayer } from '@interfaces/player.interface';

const validBoatName = 'destroyer';

export const validBoatPlacement1: GameBoat = {
  boatName: validBoatName,
  emplacement: [
    [3, 1],
    [2, 1],
    [1, 1],
  ],
};

export const validBoatPlacement2: GameBoat = {
  boatName: validBoatName,
  emplacement: [
    [1, 5],
    [1, 4],
    [1, 3],
  ],
};

export const invalidBoatPlacement1: GameBoat = {
  boatName: validBoatName,
  emplacement: [
    [11, 3],
    [2, 4],
    [3, 238917837298],
  ],
};

export const invalidBoatPlacement2: GameBoat = {
  boatName: validBoatName,
  emplacement: [
    [2, 3],
    [2, 4],
    [3, 2],
  ],
};

export const invalidBoatPlacement3: GameBoat = {
  boatName: validBoatName,
  emplacement: [
    [2, 3],
    [2, 5],
    [2, 2],
  ],
};
export const invalidBoatPlacement4: GameBoat = {
  boatName: validBoatName,
  emplacement: [
    [2, 3],
    [2, 3],
    [2, 2],
  ],
};

export const invalidBoatPlacement5: GameBoat = {
  boatName: validBoatName,
  emplacement: [
    [1, 3],
    [4, 3],
    [3, 3],
  ],
};

export const invalidBoatPlacement6: GameBoat = {
  boatName: validBoatName,
  emplacement: [
    [1, 3],
    [3, 3],
    [3, 3],
  ],
};

export const guestPlayer1: GuestPlayer = {
  id: 'Drakenline_1',
  pseudo: 'Drakenline',
};

export const guestPlayer2: GuestPlayer = {
  id: 'Nonma_1',
  pseudo: 'Nonma',
};

export const loggedPlayer1: LoggedPlayer = {
  character: 'assets/character/1.webp',
  id: '4fdec5bd-db9d-4134-bfba-c817af87c906',
  level: {
    media: 'assets/level/1.webp',
    rank: 1,
  },
  pseudo: 'Nonma',
  xp: 110,
};

export const loggedPlayer2: LoggedPlayer = {
  character: 'assets/character/1.webp',
  id: 'ed100997-2d11-4e38-baf7-bef2021b484b',
  level: {
    media: 'assets/level/1.webp',
    rank: 1,
  },
  pseudo: 'Mwrlz',
  xp: 160,
};

export const gameConfiguration1: GameConfiguration = {
  boardDimensions: 10,
  boats: {
    player1: [validBoatPlacement1, validBoatPlacement2],
    player2: [validBoatPlacement1, validBoatPlacement2],
  },
  gameMode: GameMode.OneVersusOne,
  hasBoatsSafetyZone: false,
  players: [guestPlayer1, guestPlayer2],
  state: GameState.waitingToStart,
  timePerTurn: 60,
  weapons: [0, 1, 2],
};

export const playerBoards1: PlayerBoards = {
  player1: [
    [3, 1],
    [2, 1],
    [1, 1],
    [1, 5],
    [1, 4],
    [1, 3],
  ],
  player2: [
    [3, 1],
    [2, 1],
    [1, 1],
    [1, 5],
    [1, 4],
    [1, 3],
  ],
};
