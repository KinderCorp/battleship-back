import { Test, TestingModule } from '@nestjs/testing';
import { BoatName } from '@interfaces/boat.interface';

import {
  bomb,
  fakeWeapon,
  fleets1,
  gameArsenal1,
  gameSettings1,
  guestPlayer1,
  guestPlayer2,
  loggedPlayer1,
  masterPlayerBoards1,
  players1,
  turn1,
  validFrigate,
  validRaft,
  visiblePlayerBoards1,
  visiblePlayerBoards2,
} from '@tests/datasets/game-instance.dataset';
import { Cell, GameMode, GameState } from '@interfaces/engine.interface';
import {
  GameEngineErrorCodes,
  GameEngineErrorMessages,
} from '@interfaces/error.interface';
import GameEngineError from '@shared/game-engine-error';
import GameInstanceService from '@engine/game-instance.service';
import GameInstanceValidatorsService from '@engine/game-instance-validators.service';
import { WeaponName } from '@interfaces/weapon.interface';

const baseGameConfiguration = {
  firstPlayer: guestPlayer1(),
  gameMode: GameMode.ONE_VERSUS_ONE,
  state: GameState.WAITING_TO_RIVAL,
};

// npm run test:unit -- src/tests/game-instance.service.spec.ts --watch

describe('GameInstanceService', () => {
  let service: GameInstanceService;
  let gameInstanceValidatorsService: GameInstanceValidatorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameInstanceValidatorsService],
    }).compile();

    gameInstanceValidatorsService = module.get<GameInstanceValidatorsService>(
      GameInstanceValidatorsService,
    );

    service = new GameInstanceService(
      baseGameConfiguration,
      gameInstanceValidatorsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service.gameSettings.gameMode).toEqual(GameMode.ONE_VERSUS_ONE);
    expect(service.gameState).toEqual(GameState.WAITING_TO_RIVAL);
  });

  it('should start the game', () => {
    const gameSettings = gameSettings1();
    service['gameSettings'] = gameSettings;
    service.players = players1();
    const spyValidateBoats = jest
      .spyOn(gameInstanceValidatorsService, 'validateBoatsOfPlayers')
      .mockReturnValue(true);

    service.startGame();

    expect(spyValidateBoats).toHaveBeenCalledTimes(1);
    expect(service['gameSettings']).toEqual(gameSettings);
    expect(service['masterPlayerBoards']).toBeDefined();
    expect(service['visiblePlayerBoards']).toBeDefined();
    expect(service['gameArsenal']).toBeDefined();
    expect(service['turn']).toBeDefined();
    expect(service.gameState).toEqual(GameState.PLAYING);
  });

  it('should start placing boats', () => {
    const spyValidateBoard = jest
      .spyOn(gameInstanceValidatorsService, 'validateBoardDimensions')
      .mockReturnValue(true);

    const spyValidatePlayers = jest
      .spyOn(gameInstanceValidatorsService, 'validatePlayers')
      .mockReturnValue(true);

    service.startPlacingBoats(gameSettings1());

    expect(spyValidateBoard).toHaveBeenCalledTimes(1);
    expect(spyValidatePlayers).toHaveBeenCalledTimes(1);
    expect(service.gameState).toEqual(GameState.PLACING_BOATS);
  });

  it('should end the game', () => {
    service.endGame();

    expect(service.gameState).toEqual(GameState.FINISHED);
  });

  it('should generate the master player boards', () => {
    expect(service['generateMasterPlayerBoards'](fleets1())).toStrictEqual(
      masterPlayerBoards1(),
    );
  });

  it('should generate the visible player boards', () => {
    const players = [guestPlayer1(), guestPlayer2()];

    expect(service['generateVisiblePlayerBoards'](players)).toStrictEqual(
      visiblePlayerBoards1(),
    );
  });

  it('should thrown an error if the targeted cell has been hit', () => {
    service['visiblePlayerBoards'] = visiblePlayerBoards2();

    expect(() =>
      service['doesCellContainABoat'](guestPlayer1(), [1, 1]),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.CELL_ALREADY_HIT,
        message: GameEngineErrorMessages.CELL_ALREADY_HIT,
      }),
    );
  });

  it('should add the targeted cell to the visible board and not hit a boat', () => {
    service['visiblePlayerBoards'] = visiblePlayerBoards2();
    service['masterPlayerBoards'] = masterPlayerBoards1();

    const doesCellContainABoat = service['doesCellContainABoat'](
      guestPlayer1(),
      [1, 10],
    );

    expect(service['visiblePlayerBoards']['drakenline_0']).toStrictEqual([
      [1, 1],
      [2, 1],
      [1, 10],
    ]);

    expect(doesCellContainABoat).toEqual(false);
  });

  it('should add the targeted cell to the visible board and hit a boat', () => {
    service['visiblePlayerBoards'] = visiblePlayerBoards2();
    service['masterPlayerBoards'] = masterPlayerBoards1();
    service['gameSettings'] = gameSettings1();
    service.fleets = fleets1();
    const targetedPlayer = guestPlayer1();

    const doesCellContainABoat = service['doesCellContainABoat'](
      targetedPlayer,
      [3, 1],
    );

    expect(service['visiblePlayerBoards'][targetedPlayer.id]).toStrictEqual([
      [1, 1],
      [2, 1],
      [3, 1],
    ]);

    expect(doesCellContainABoat).toEqual(true);
  });

  it('should find the boats of the player that are still in game', () => {
    service.fleets = fleets1();
    const playerBoats = service.fleets['drakenline_0'];

    const stillInGameBoats = service['findStillInGamePlayerBoats'](playerBoats);

    expect(stillInGameBoats).toStrictEqual([
      {
        boatName: BoatName.RAFT,
        emplacement: [
          [3, 1],
          [2, 1],
          [1, 1],
        ],
        hit: [],
        isSunk: false,
      },
    ]);
  });

  it('should update player boat object and not to be sunk at first, then to be sunk', () => {
    service.fleets = fleets1();
    const targetedPlayer = guestPlayer1();

    service['updatePlayerBoatObject'](targetedPlayer, [3, 1]);

    expect(service.fleets[targetedPlayer.id][0]).toStrictEqual({
      boatName: BoatName.RAFT,
      emplacement: [
        [1, 1],
        [2, 1],
        [3, 1],
      ],
      hit: [[3, 1]],
      isSunk: false,
    });

    service['updatePlayerBoatObject'](targetedPlayer, [2, 1]);
    expect(service.fleets[targetedPlayer.id][0].isSunk).toEqual(false);

    service['updatePlayerBoatObject'](targetedPlayer, [1, 1]);
    expect(service.fleets[targetedPlayer.id][0].isSunk).toEqual(true);
  });

  it('should update player boat object and throw an error because boat is already hit on targeted cell ', () => {
    service['gameSettings'] = gameSettings1();
    service.fleets = fleets1();
    const targetedPlayer = guestPlayer1();

    service['updatePlayerBoatObject'](targetedPlayer, [3, 1]);
    service['updatePlayerBoatObject'](targetedPlayer, [2, 1]);
    expect(service.fleets[targetedPlayer.id][0].isSunk).toEqual(false);

    expect(() =>
      service['updatePlayerBoatObject'](targetedPlayer, [3, 1]),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.CELL_ALREADY_HIT,
        message: GameEngineErrorMessages.CELL_ALREADY_HIT,
      }),
    );
    expect(service.fleets[targetedPlayer.id][0].hit).toEqual([
      [2, 1],
      [3, 1],
    ]);
    expect(service.fleets[targetedPlayer.id][0].isSunk).toEqual(false);
  });

  it('should generate the game arsenal', () => {
    service.players = players1();

    expect(service['generateGameArsenal'](gameSettings1())).toEqual(
      gameArsenal1(),
    );
  });

  describe('shoot function', () => {
    beforeEach(() => {
      service.gameState = GameState.PLAYING;
      service['visiblePlayerBoards'] = visiblePlayerBoards1();
      service['masterPlayerBoards'] = masterPlayerBoards1();
      service.players = players1();
      service.fleets = fleets1();
      service['gameArsenal'] = gameArsenal1();
    });

    it('should not shoot because the game is not started', () => {
      service.gameState = GameState.WAITING_TO_START;
      expect(() =>
        service.shoot({
          originCell: [1, 1],
          targetedPlayerId: guestPlayer1().id,
          weaponName: bomb().name,
        }),
      ).toThrowError(
        new GameEngineError({
          code: GameEngineErrorCodes.GAME_NOT_STARTED,
          message: GameEngineErrorMessages.GAME_NOT_STARTED,
        }),
      );
    });

    it('should not shoot because no remaining ammunition', () => {
      service['gameArsenal'][guestPlayer1().id][0].ammunitionRemaining = 0;

      expect(() =>
        service.shoot({
          originCell: [1, 1],
          targetedPlayerId: guestPlayer1().id,
          weaponName: service['gameArsenal'][guestPlayer1().id][0].name,
        }),
      ).toThrowError(
        new GameEngineError({
          code: GameEngineErrorCodes.NO_AMMUNITION_REMAINING,
          message: GameEngineErrorMessages.NO_AMMUNITION_REMAINING,
        }),
      );
    });

    it('should not shoot because the origin cell is out of bound', () => {
      expect(() =>
        service.shoot({
          originCell: [0, 1],
          targetedPlayerId: guestPlayer1().id,
          weaponName: bomb().name,
        }),
      ).toThrowError(
        new GameEngineError({
          code: GameEngineErrorCodes.OUT_OF_BOUNDS,
          message: GameEngineErrorMessages.OUT_OF_BOUNDS,
        }),
      );

      expect(() =>
        service.shoot({
          originCell: [1, 0],
          targetedPlayerId: guestPlayer1().id,
          weaponName: bomb().name,
        }),
      ).toThrowError(
        new GameEngineError({
          code: GameEngineErrorCodes.OUT_OF_BOUNDS,
          message: GameEngineErrorMessages.OUT_OF_BOUNDS,
        }),
      );
    });

    it('should shoot with a bomb weapon', () => {
      const targetedPlayer = guestPlayer1();

      jest
        .spyOn(gameInstanceValidatorsService, 'validateCellHasNotBeenHit')
        .mockReturnValue(true);

      expect(
        service['gameArsenal'][targetedPlayer.id][0].ammunitionRemaining,
      ).toEqual(-1);
      expect(service.fleets[targetedPlayer.id][0].hit).toHaveLength(0);
      expect(() =>
        service.shoot({
          originCell: [1, 1],
          targetedPlayerId: targetedPlayer.id,
          weaponName: service['gameArsenal'][targetedPlayer.id][0].name,
        }),
      ).not.toThrowError();
      expect(service.fleets[targetedPlayer.id][0].hit).toEqual([[1, 1]]);
      expect(
        service['gameArsenal'][targetedPlayer.id][0].ammunitionRemaining,
      ).toEqual(-1);
    });

    it('should shoot with the triple weapon', () => {
      jest
        .spyOn(gameInstanceValidatorsService, 'validateCellHasNotBeenHit')
        .mockReturnValue(true);

      expect(
        service['gameArsenal']['drakenline_0'][1].ammunitionRemaining,
      ).toEqual(1);
      expect(service.fleets['drakenline_0'][0].hit).toHaveLength(0);
      expect(() =>
        service.shoot({
          originCell: [2, 1],
          targetedPlayerId: guestPlayer1().id,
          weaponName: service['gameArsenal']['drakenline_0'][1].name,
        }),
      ).not.toThrowError();
      expect(service.fleets['drakenline_0'][0].hit).toEqual([
        [1, 1],
        [2, 1],
        [3, 1],
      ]);
      expect(service.fleets['drakenline_0'][0].isSunk).toEqual(true);
      expect(
        service['gameArsenal']['drakenline_0'][1].ammunitionRemaining,
      ).toEqual(0);
    });

    it('should shoot with the triple weapon with some cells out of bounds', () => {
      const targetedPlayer = guestPlayer1();

      jest
        .spyOn(gameInstanceValidatorsService, 'validateCellHasNotBeenHit')
        .mockReturnValue(true);

      expect(
        service['gameArsenal'][targetedPlayer.id][1].ammunitionRemaining,
      ).toEqual(1);
      expect(service.fleets[targetedPlayer.id][0].hit).toHaveLength(0);
      expect(() =>
        service.shoot({
          originCell: [3, 1],
          targetedPlayerId: targetedPlayer.id,
          weaponName: service['gameArsenal'][targetedPlayer.id][1].name,
        }),
      ).not.toThrowError();
      expect(service.fleets[targetedPlayer.id][0].hit).toEqual([
        [2, 1],
        [3, 1],
      ]);
      expect(service.fleets[targetedPlayer.id][0].isSunk).toEqual(false);
      expect(
        service['gameArsenal'][targetedPlayer.id][1].ammunitionRemaining,
      ).toEqual(0);
      expect(service['visiblePlayerBoards'][targetedPlayer.id]).toEqual([
        [4, 1],
        [3, 1],
        [2, 1],
      ]);
    });
  });

  it('should get shot cells', () => {
    const shotCells = service['getShotCells'](fakeWeapon(), [5, 5]);

    expect(shotCells).toEqual([
      [6, 4],
      [5, 5],
      [7, 9],
      [5, 6],
      [6, 5],
      [6, 6],
      [4, 6],
    ]);
  });

  it('should sort cells', () => {
    const horizontalCells1: Cell[] = [
      [2, 1],
      [3, 1],
      [1, 1],
    ];
    const horizontalCells2: Cell[] = [
      [2, 1],
      [3, 1],
      [1, 1],
    ];
    const verticalCells1: Cell[] = [
      [1, 2],
      [1, 3],
      [1, 1],
    ];
    const verticalCells2: Cell[] = [
      [1, 2],
      [1, 3],
      [1, 1],
    ];

    service['sortCells'](horizontalCells1, 'x');
    expect(horizontalCells1).toEqual([
      [1, 1],
      [2, 1],
      [3, 1],
    ]);

    service['sortCells'](verticalCells1, 'y');
    expect(verticalCells1).toEqual([
      [1, 1],
      [1, 2],
      [1, 3],
    ]);

    service['sortCells'](horizontalCells2, 'y');
    expect(horizontalCells2).toEqual([
      [2, 1],
      [3, 1],
      [1, 1],
    ]);

    service['sortCells'](verticalCells2, 'x');
    expect(verticalCells2).toEqual([
      [1, 2],
      [1, 3],
      [1, 1],
    ]);
  });

  it('should get the next player', () => {
    const players = [guestPlayer1(), guestPlayer2()];

    expect(service['getNextPlayer'](players[0], players)).toEqual(
      guestPlayer2(),
    );
    expect(service['getNextPlayer'](players[1], players)).toEqual(
      guestPlayer1(),
    );
  });

  it('should generate turns', () => {
    const turns = service['generateTurns']([guestPlayer1(), guestPlayer2()]);

    expect(turns.actionRemaining).toEqual(1);
    expect(turns.isTurnOf).not.toEqual(turns.nextPlayer);
  });

  it('should count down an action', () => {
    const expectedTurn = { ...turn1(), actionRemaining: 0 };
    service['turn'] = turn1();

    const spyActionCanBeExecuted = jest
      .spyOn(gameInstanceValidatorsService, 'validateActionCanBeExecuted')
      .mockReturnValue(true);

    const spyEndTurn = jest
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .spyOn(service as any, 'endTurn')
      .mockImplementation();

    service['countDownAction'](service['turn']);

    expect(spyActionCanBeExecuted).toHaveBeenCalledTimes(1);
    expect(spyEndTurn).toHaveBeenCalledTimes(1);
    expect(service['turn']).toEqual(expectedTurn);
  });

  it('should end the turn', () => {
    service['gameSettings'] = gameSettings1();

    const expectedTurn = {
      actionRemaining: 1,
      isTurnOf: guestPlayer2(),
      nextPlayer: guestPlayer1(),
    };
    service['turn'] = turn1();

    const spyGetNextPlayer = jest
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .spyOn(service as any, 'getNextPlayer')
      .mockReturnValue(guestPlayer1());

    service['endTurn'](service['turn']);

    expect(spyGetNextPlayer).toHaveBeenCalledTimes(1);
    expect(service['turn']).toEqual(expectedTurn);
  });

  it('should return true because the player fleet has been sunk', () => {
    const playerFleet = [validFrigate(), validFrigate()];

    expect(service['hasPlayerFleetBeenSunk'](playerFleet)).toEqual(true);
  });

  it('should return false because the player fleet has been sunk', () => {
    const playerFleet = [validRaft(), validFrigate()];

    expect(service['hasPlayerFleetBeenSunk'](playerFleet)).toEqual(false);
  });

  it('should return false because none fleet have been sunk', () => {
    service['gameSettings'] = gameSettings1();

    expect(service['isGameOver']()).toEqual(false);
  });

  it('should return the end game recap because a fleet have been sunk', () => {
    service.fleets = fleets1();
    service.players = players1();
    service.fleets['drakenline_0'] = [validFrigate(), validFrigate()];

    expect(service['isGameOver']()).toEqual({
      loser: [guestPlayer2()],
      winner: [guestPlayer1()],
    });
  });

  it('should return the end game recap with 2 losers because a fleet have been sunk', () => {
    service.fleets = fleets1();
    service.players = players1();
    service.players.push(loggedPlayer1());
    service.fleets['drakenline_0'] = [validFrigate(), validFrigate()];

    expect(service['isGameOver']()).toEqual({
      loser: [guestPlayer2(), loggedPlayer1()],
      winner: [guestPlayer1()],
    });
  });

  it('should get player by any id', () => {
    service.players = players1();

    expect(service['getPlayerByAnyId']('drakenline_0')).toEqual(guestPlayer1());
    expect(service['getPlayerByAnyId']('wFH34DKHHdQAlanXAAA2')).toEqual(
      guestPlayer2(),
    );
  });

  it('should not get player by id', () => {
    service.players = players1();

    expect(() => service['getPlayerByAnyId']('baptiste')).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.PLAYER_NOT_FOUND,
        message: GameEngineErrorMessages.PLAYER_NOT_FOUND,
      }),
    );
  });

  it('should get weapon by name', () => {
    service['gameArsenal'] = gameArsenal1();

    expect(service['getWeaponByName'](WeaponName.BOMB, 'drakenline_0')).toEqual(
      bomb(),
    );
  });

  it('should not get weapon by name', () => {
    service['gameArsenal'] = gameArsenal1();

    expect(() =>
      service['getWeaponByName'](WeaponName.DRONE, 'drakenline_0'),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.WEAPON_NOT_FOUND,
        message: GameEngineErrorMessages.WEAPON_NOT_FOUND,
      }),
    );
  });

  it('should get the maximum amount of player', () => {
    expect(service['getMaximumPlayers'](GameMode.ONE_VERSUS_ONE)).toEqual(2);
  });

  it('should not get the maximum amount of player', () => {
    expect(() =>
      service['getMaximumPlayers']('blabl' as GameMode),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.INVALID_GAME_MODE,
        message: GameEngineErrorMessages.INVALID_GAME_MODE,
      }),
    );
  });
});
