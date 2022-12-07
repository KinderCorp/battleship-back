import {
  GameArsenal,
  GameBoat,
  GameBoats,
  GameMode,
  GamePlayer,
  GameSettings,
  GameState,
  GameWeapon,
  PlayerBoards,
  Turn,
  Versus,
} from '@interfaces/engine.interface';
import { GuestPlayer, LoggedPlayer } from '@interfaces/player.interface';
import { WeaponName, WeaponType } from '@interfaces/weapon.interface';

// INFO Datasets must be functions to ensure that the values don't mutate

const validBoatName = 'destroyer';

export const validBoatPlacement1: () => GameBoat = () => {
  return {
    boatName: validBoatName,
    emplacement: [
      [3, 1],
      [2, 1],
      [1, 1],
    ],
    hit: [],
    isSunk: false,
  };
};

export const validBoatPlacement2: () => GameBoat = () => {
  return {
    boatName: validBoatName,
    emplacement: [
      [1, 5],
      [1, 4],
      [1, 3],
    ],
    hit: [],
    isSunk: false,
  };
};

export const validBoatPlacement3: () => GameBoat = () => {
  return {
    boatName: validBoatName,
    emplacement: [
      [5, 5],
      [5, 4],
      [5, 3],
    ],
    hit: [
      [5, 5],
      [5, 4],
      [5, 3],
    ],
    isSunk: true,
  };
};

export const validBoatPlacement4: () => GameBoat = () => {
  return {
    boatName: validBoatName,
    emplacement: [
      [1, 5],
      [1, 4],
    ],
    hit: [],
    isSunk: false,
  };
};

export const invalidBoatPlacement1: () => GameBoat = () => {
  return {
    boatName: validBoatName,
    emplacement: [
      [11, 3],
      [2, 4],
      [3, 238917837298],
    ],
    hit: [],
    isSunk: false,
  };
};

export const invalidBoatPlacement2: () => GameBoat = () => {
  return {
    boatName: validBoatName,
    emplacement: [
      [2, 3],
      [2, 4],
      [3, 2],
    ],
    hit: [],
    isSunk: false,
  };
};

export const invalidBoatPlacement3: () => GameBoat = () => {
  return {
    boatName: validBoatName,
    emplacement: [
      [2, 3],
      [2, 5],
      [2, 2],
    ],
    hit: [],
    isSunk: false,
  };
};

export const invalidBoatPlacement4: () => GameBoat = () => {
  return {
    boatName: validBoatName,
    emplacement: [
      [2, 3],
      [2, 3],
      [2, 2],
    ],
    hit: [],
    isSunk: false,
  };
};

export const invalidBoatPlacement5: () => GameBoat = () => {
  return {
    boatName: validBoatName,
    emplacement: [
      [1, 3],
      [4, 3],
      [3, 3],
    ],
    hit: [],
    isSunk: false,
  };
};

export const invalidBoatPlacement6: () => GameBoat = () => {
  return {
    boatName: validBoatName,
    emplacement: [
      [1, 3],
      [3, 3],
      [3, 3],
    ],
    hit: [],
    isSunk: false,
  };
};

export const invalidBoatPlacement7: () => GameBoat = () => {
  return {
    boatName: validBoatName,
    emplacement: [
      [1, 3],
      [3, 3],
    ],
    hit: [],
    isSunk: false,
  };
};

export const guestPlayer1: () => GuestPlayer = () => {
  return {
    id: 'drakenline_0',
    pseudo: 'Drakenline',
  };
};

export const guestPlayer2: () => GuestPlayer = () => {
  return {
    id: 'nonma_1',
    pseudo: 'Nonma',
  };
};

export const loggedPlayer1: () => LoggedPlayer = () => {
  return {
    character: 'assets/character/1.webp',
    id: '4fdec5bd-db9d-4134-bfba-c817af87c906',
    level: {
      media: 'assets/level/1.webp',
      rank: 1,
    },
    pseudo: 'Nonma',
    xp: 110,
  };
};

export const loggedPlayer2: () => LoggedPlayer = () => {
  return {
    character: 'assets/character/1.webp',
    id: 'ed100997-2d11-4e38-baf7-bef2021b484b',
    level: {
      media: 'assets/level/1.webp',
      rank: 1,
    },
    pseudo: 'Mwrlz',
    xp: 160,
  };
};

export const gameSettings1: () => GameSettings = () => {
  const oneVersusOneWeapons = oneVersusOneWeapons1();

  return {
    boardDimensions: 10,
    gameMode: GameMode.ONE_VERSUS_ONE,
    hasBoatsSafetyZone: false,
    state: GameState.WAITING_TO_START,
    timePerTurn: 60,
    weapons: oneVersusOneWeapons,
  };
};

export const masterPlayerBoards1: () => PlayerBoards = () => {
  return {
    drakenline_0: [
      [3, 1],
      [2, 1],
      [1, 1],
      [5, 5],
      [5, 4],
      [5, 3],
    ],
    nonma_1: [
      [3, 1],
      [2, 1],
      [1, 1],
      [1, 5],
      [1, 4],
      [1, 3],
    ],
  };
};

export const visiblePlayerBoards1: () => PlayerBoards = () => {
  return {
    drakenline_0: [],
    nonma_1: [],
  };
};

export const visiblePlayerBoards2: () => PlayerBoards = () => {
  return {
    drakenline_0: [
      [1, 1],
      [2, 1],
    ],
    nonma_1: [[10, 1]],
  };
};

export const oneVersusOneWeapons1: () => Versus<WeaponType> = () => {
  const bomb = gameWeaponBomb();
  const triple = gameWeaponTriple();

  return {
    drakenline_0: [bomb, triple],
    nonma_1: [bomb, triple],
  };
};

const gameWeaponBomb: () => WeaponType = () => {
  return {
    damageArea: {
      b: [],
      bl: [],
      br: [],
      l: [],
      o: [0, 0],
      r: [],
      t: [],
      tl: [],
      tr: [],
    },
    id: 1,
    maxAmmunition: -1,
    name: WeaponName.bomb,
    requiredLevel: 1,
  };
};

const gameWeaponTriple: () => WeaponType = () => {
  return {
    damageArea: {
      b: [1, 0],
      bl: [],
      br: [],
      l: [],
      o: [0, 0],
      r: [],
      t: [-1, 0],
      tl: [],
      tr: [],
    },
    id: 2,
    maxAmmunition: 1,
    name: WeaponName.triple,
    requiredLevel: 1,
  };
};

export const gameArsenal1: () => GameArsenal = () => {
  const bombWeapon = bomb();
  const tripleWeapon = triple1();

  return {
    drakenline_0: [bombWeapon, tripleWeapon],
    nonma_1: [bombWeapon, tripleWeapon],
  };
};

export const bomb: () => GameWeapon = () => {
  return {
    ammunitionRemaining: -1,
    damageArea: {
      b: [],
      bl: [],
      br: [],
      l: [],
      o: [0, 0],
      r: [],
      t: [],
      tl: [],
      tr: [],
    },
    name: WeaponName.bomb,
  };
};

export const fakeWeapon: () => GameWeapon = () => {
  return {
    ammunitionRemaining: -1,
    damageArea: {
      b: [1, -1],
      bl: [0, 0],
      br: [2, 4],
      l: [0, 1],
      o: [],
      r: [1, 0],
      t: [1, 1],
      tl: [-1, 1],
      tr: [],
    },
    name: WeaponName.bomb,
  };
};

const triple1: () => GameWeapon = () => {
  return {
    ammunitionRemaining: 1,
    damageArea: {
      b: [1, 0],
      bl: [],
      br: [],
      l: [],
      o: [0, 0],
      r: [],
      t: [-1, 0],
      tl: [],
      tr: [],
    },
    name: WeaponName.triple,
  };
};

export const turn1: () => Turn = () => {
  return {
    actionRemaining: 1,
    isTurnOf: guestPlayer1(),
    nextPlayer: guestPlayer2(),
  };
};

export const fleets1: () => GameBoats = () => {
  const boat1 = validBoatPlacement1();
  const boat2 = validBoatPlacement2();
  const boat3 = validBoatPlacement3();

  return {
    drakenline_0: [boat1, boat3],
    nonma_1: [boat1, boat2],
  };
};

export const players1: () => GamePlayer[] = () => {
  const guest1 = guestPlayer1();
  const guest2 = guestPlayer2();

  return [guest1, guest2];
};
