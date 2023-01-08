import {
  BaseGameSettings,
  BoatDirection,
  GameArsenal,
  GameBoat,
  GameBoats,
  GameBoatSettings,
  GameMode,
  GamePlayer,
  GamePreset,
  GameSettings,
  GameWeapon,
  PlayerBoards,
  PresetName,
  Turn,
} from '@interfaces/engine.interface';
import { GuestPlayer, LoggedPlayer } from '@interfaces/player.interface';
import { WeaponName, WeaponType } from '@interfaces/weapon.interface';
import Boat from '@boat/boat.entity';
import { BoatName } from '@interfaces/boat.interface';
import { DEFAULT_AUTHORISED_FLEET } from '@shared/game-instance.const';

// INFO Datasets must be functions to ensure that the values don't mutate
export const validRaft: () => GameBoat = () => {
  return {
    emplacement: [
      [3, 1],
      [2, 1],
      [1, 1],
    ],
    hit: [],
    isSunk: false,
    name: BoatName.RAFT,
  };
};

export const validGalley: () => GameBoat = () => {
  return {
    emplacement: [
      [1, 5],
      [1, 4],
      [1, 3],
    ],
    hit: [],
    isSunk: false,
    name: BoatName.GALLEY,
  };
};

export const validFrigate: () => GameBoat = () => {
  return {
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
    name: BoatName.FRIGATE,
  };
};

export const validShallop: () => GameBoat = () => {
  return {
    emplacement: [
      [1, 5],
      [1, 4],
    ],
    hit: [],
    isSunk: false,
    name: BoatName.SHALLOP,
  };
};

export const invalidGalley1: () => GameBoat = () => {
  return {
    emplacement: [
      [11, 3],
      [2, 4],
      [3, 238917837298],
    ],
    hit: [],
    isSunk: false,
    name: BoatName.GALLEY,
  };
};

export const invalidBoatPlacement2: () => GameBoat = () => {
  return {
    emplacement: [
      [2, 3],
      [2, 4],
      [3, 2],
    ],
    hit: [],
    isSunk: false,
    name: BoatName.SHALLOP,
  };
};

export const invalidBoatPlacement3: () => GameBoat = () => {
  return {
    emplacement: [
      [2, 3],
      [2, 5],
      [2, 2],
    ],
    hit: [],
    isSunk: false,
    name: BoatName.SHALLOP,
  };
};

export const invalidBoatPlacement4: () => GameBoat = () => {
  return {
    emplacement: [
      [2, 3],
      [2, 3],
      [2, 2],
    ],
    hit: [],
    isSunk: false,
    name: BoatName.SHALLOP,
  };
};

export const invalidBoatPlacement5: () => GameBoat = () => {
  return {
    emplacement: [
      [1, 3],
      [4, 3],
      [3, 3],
    ],
    hit: [],
    isSunk: false,
    name: BoatName.SHALLOP,
  };
};

export const invalidBoatPlacement6: () => GameBoat = () => {
  return {
    emplacement: [
      [1, 3],
      [3, 3],
      [3, 3],
    ],
    hit: [],
    isSunk: false,
    name: BoatName.SHALLOP,
  };
};

export const invalidBoatPlacement7: () => GameBoat = () => {
  return {
    emplacement: [
      [1, 3],
      [3, 3],
    ],
    hit: [],
    isSunk: false,
    name: BoatName.SHALLOP,
  };
};

export const guestPlayer1: () => GuestPlayer = () => {
  return {
    id: 'drakenline_0',
    isHost: true,
    pseudo: 'Drakenline',
    socketId: 'wFH34DKHHdQAlanXAAA1',
  };
};

export const guestPlayer2: () => GuestPlayer = () => {
  return {
    id: 'nonma_1',
    isHost: false,
    pseudo: 'Nonma',
    socketId: 'wFH34DKHHdQAlanXAAA2',
  };
};

export const loggedPlayer1: () => LoggedPlayer = () => {
  return {
    character: 'assets/character/1.webp',
    id: '4fdec5bd-db9d-4134-bfba-c817af87c906',
    isHost: false,
    level: {
      media: 'assets/level/1.webp',
      rank: 1,
    },
    pseudo: 'Nonma',
    socketId: 'wFH34DKHHdQAlanXAAA3',
    xp: 110,
  };
};

export const loggedPlayer2: () => LoggedPlayer = () => {
  return {
    character: 'assets/character/1.webp',
    id: 'ed100997-2d11-4e38-baf7-bef2021b484b',
    isHost: false,
    level: {
      media: 'assets/level/1.webp',
      rank: 1,
    },
    pseudo: 'Mwrlz',
    socketId: 'wFH34DKHHdQAlanXAAA4',
    xp: 160,
  };
};

export const gameSettings1: () => GameSettings = () => {
  const oneVersusOneWeapons = oneVersusOneWeapons1();

  return {
    authorisedFleet: DEFAULT_AUTHORISED_FLEET,
    boardDimensions: 10,
    hasBoatsSafetyZone: false,
    mode: GameMode.ONE_VERSUS_ONE,
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

export const oneVersusOneWeapons1: () => WeaponType[] = () => {
  return [gameWeaponBomb(), gameWeaponTriple()];
};

export const gameWeaponBomb: () => WeaponType = () => {
  return {
    damageArea: [[0, 0]],
    id: 1,
    maxAmmunition: -1,
    name: WeaponName.BOMB,
    requiredLevel: 1,
  };
};

const gameWeaponTriple: () => WeaponType = () => {
  return {
    damageArea: [
      [1, 0],
      [0, 0],
      [-1, 0],
    ],

    id: 2,
    maxAmmunition: 1,
    name: WeaponName.TRIPLE,
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
    damageArea: [[0, 0]],
    name: WeaponName.BOMB,
  };
};

export const fakeWeapon: () => GameWeapon = () => {
  return {
    ammunitionRemaining: -1,
    damageArea: [
      [1, -1],
      [0, 0],
      [2, 4],
      [0, 1],
      [1, 0],
      [1, 1],
      [-1, 1],
    ],

    name: WeaponName.BOMB,
  };
};

const triple1: () => GameWeapon = () => {
  return {
    ammunitionRemaining: 1,
    damageArea: [
      [1, 0],
      [0, 0],
      [-1, 0],
    ],
    name: WeaponName.TRIPLE,
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
  const boat1 = validRaft();
  const boat2 = validGalley();
  const boat3 = validFrigate();

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

export const validPlayerFleet: () => GameBoat[] = () => {
  return [
    validRaft(),
    validRaft(),
    validRaft(),
    validRaft(),
    validShallop(),
    validShallop(),
    validShallop(),
    validFrigate(),
    validFrigate(),
    validGalley(),
  ];
};

export const gameBoatSettingsRaft = (): GameBoatSettings => {
  return {
    bowCells: [[1, 1]],
    direction: BoatDirection.EAST,
    name: BoatName.RAFT,
  };
};

export const gameBoatSettingsHugeRaft = (): GameBoatSettings => {
  return {
    bowCells: [
      [1, 1],
      [1, 2],
    ],
    direction: BoatDirection.EAST,
    name: BoatName.RAFT,
  };
};

export const gameBoatSettingsGalley = (): GameBoatSettings => {
  return {
    bowCells: [[5, 8]],
    direction: BoatDirection.NORTH,
    name: BoatName.GALLEY,
  };
};

export const gameBoatSettingsFrigate = (): GameBoatSettings => {
  return {
    bowCells: [[5, 1]],
    direction: BoatDirection.SOUTH,
    name: BoatName.FRIGATE,
  };
};

export const gameBoatSettingsHugeFrigate = (): GameBoatSettings => {
  return {
    bowCells: [
      [5, 1],
      [6, 1],
    ],
    direction: BoatDirection.SOUTH,
    name: BoatName.FRIGATE,
  };
};

export const storedRaft = (): Boat => {
  return { beam: 1, id: 1, lengthOverall: 1, name: BoatName.RAFT };
};

export const storedFrigate = (): Boat => {
  return { beam: 1, id: 1, lengthOverall: 3, name: BoatName.FRIGATE };
};

export const storedHugeRaft = (): Boat => {
  return { beam: 2, id: 1, lengthOverall: 1, name: BoatName.RAFT };
};

export const storedHugeFrigate = (): Boat => {
  return { beam: 2, id: 1, lengthOverall: 3, name: BoatName.FRIGATE };
};

export const baseGameSettings = (): BaseGameSettings => {
  return {
    firstPlayer: guestPlayer1(),
    mode: GameMode.ONE_VERSUS_ONE,
    weapons: [gameWeaponBomb()],
  };
};

export const exampleGamePreset = (): GamePreset => {
  return {
    fleetPreset: [
      [4, BoatName.RAFT],
      [3, BoatName.FRIGATE],
    ],
    name: PresetName.CLASSIC,
  };
};
