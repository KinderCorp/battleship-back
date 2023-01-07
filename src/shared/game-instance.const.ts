import { AuthorisedFleet, GameBoard } from '@interfaces/engine.interface';
import { BoatName } from '@interfaces/boat.interface';

export const DEFAULT_BOARD_GAME: GameBoard = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
];

export const MIN_BOARD_GAME_DIMENSIONS = 10;
export const MAX_BOARD_GAME_DIMENSIONS = 10;

export const GAME_INSTANCE_UID_LENGTH = 20;

/**
 * INFO This const is temporary
 * TASK Remove this const when Api calls are done
 */
export const DEFAULT_AUTHORISED_FLEET: AuthorisedFleet = [
  {
    authorisedNumber: 4,
    boat: {
      beam: 1,
      lengthOverall: 1,
      name: BoatName.RAFT,
      src: '/images/boats/boat-1x1.png',
    },
  },
  {
    authorisedNumber: 3,
    boat: {
      beam: 1,
      lengthOverall: 2,
      name: BoatName.SHALLOP,
      src: '/images/boats/boat-2x1.png',
    },
  },
  {
    authorisedNumber: 2,
    boat: {
      beam: 1,
      lengthOverall: 3,
      name: BoatName.FRIGATE,
      src: '/images/boats/boat-3x1.png',
    },
  },
  {
    authorisedNumber: 1,
    boat: {
      beam: 1,
      lengthOverall: 4,
      name: BoatName.GALLEY,
      src: '/images/boats/boat-4x1.png',
    },
  },
];
