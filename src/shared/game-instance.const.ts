import { BoatName } from '@interfaces/boat.interface';
import { GameBoard } from '@interfaces/engine.interface';

export const DEFAULT_BOARD_GAME: GameBoard = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
];

export const MIN_BOARD_GAME_DIMENSIONS = 10;
export const MAX_BOARD_GAME_DIMENSIONS = 10;

export const GAME_INSTANCE_UID_LENGTH = 20;

/**
 * INFO This const is temporary
 * Remove this const when Api calls are done
 */
export const DEFAULT_AUTHORIZED_FLEET = [
  {
    authorizedNumber: 4,
    boat: {
      length: 1,
      name: BoatName.RAFT,
      src: 'images/boats/boat-1x1.png',
      width: 1,
    },
  },
  {
    authorizedNumber: 3,
    boat: {
      length: 2,
      name: BoatName.SHALLOP,
      src: 'images/boats/boat-2x1.png',
      width: 1,
    },
  },
  {
    authorizedNumber: 2,
    boat: {
      length: 3,
      name: BoatName.FRIGATE,
      src: 'images/boats/boat-3x1.png',
      width: 1,
    },
  },
  {
    authorizedNumber: 1,
    boat: {
      length: 4,
      name: BoatName.GALLEY,
      src: 'images/boats/boat-4x1.png',
      width: 1,
    },
  },
];
