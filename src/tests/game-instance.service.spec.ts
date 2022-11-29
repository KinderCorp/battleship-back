import { Test, TestingModule } from '@nestjs/testing';

import {
  bomb,
  fakeWeapon,
  gameArsenal1,
  gameConfiguration1,
  masterPlayerBoards1,
  visiblePlayerBoards1,
  visiblePlayerBoards2,
} from '@tests/datasets/game-instance.dataset';
import {
  GameEngineErrorCodes,
  GameEngineErrorMessages,
} from '@interfaces/error.interface';
import { GameMode, GameState } from '@interfaces/engine.interface';
import GameEngineError from '@shared/game-engine-error';
import GameInstanceService from '@engine/game-instance.service';
import GameInstanceValidatorsService from '@engine/game-instance-validators.service';

const baseGameConfiguration = {
  gameMode: GameMode.OneVersusOne,
  state: GameState.waitingToStart,
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
    expect(service['gameMode']).toEqual(GameMode.OneVersusOne);
    expect(service.gameState).toEqual(GameState.waitingToStart);
  });

  it('should start the game', () => {
    service.startGame(gameConfiguration1());

    jest
      .spyOn(gameInstanceValidatorsService, 'validateBoatsOfPlayers')
      .mockReturnValue(true);

    // TASK Update this test
    expect(service.gameState).toEqual(GameState.playing);
  });

  it('should start placing boats', () => {
    const spyValidateBoard = jest
      .spyOn(gameInstanceValidatorsService, 'validateBoardDimensions')
      .mockReturnValue(true);

    const spyValidatePlayers = jest
      .spyOn(gameInstanceValidatorsService, 'validatePlayers')
      .mockReturnValue(true);

    service.startPlacingBoats(gameConfiguration1());

    expect(spyValidateBoard).toHaveBeenCalledTimes(1);
    expect(spyValidatePlayers).toHaveBeenCalledTimes(1);
    expect(service.gameState).toEqual(GameState.placingBoats);
  });

  it('should end the game', () => {
    service.endGame();

    expect(service.gameState).toEqual(GameState.finished);
  });

  it('should generate the master player boards', () => {
    expect(
      service['generateMasterPlayerBoards'](gameConfiguration1().boats),
    ).toStrictEqual(masterPlayerBoards1());
  });

  it('should generate the visible player boards', () => {
    expect(
      service['generateVisiblePlayerBoards'](gameConfiguration1().players),
    ).toStrictEqual(visiblePlayerBoards1());
  });

  it('should thrown an error if the targeted cell has been hit', () => {
    service['visiblePlayerBoards'] = visiblePlayerBoards2();

    expect(() =>
      service['doesCellContainABoat']('player0', [1, 1]),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.cellAlreadyHit,
        message: GameEngineErrorMessages.cellAlreadyHit,
      }),
    );
  });

  it('should add the targeted cell to the visible board and not hit a boat', () => {
    service['visiblePlayerBoards'] = visiblePlayerBoards2();
    service['masterPlayerBoards'] = masterPlayerBoards1();

    const doesCellContainABoat = service['doesCellContainABoat'](
      'player0',
      [1, 10],
    );

    expect(service['visiblePlayerBoards']['player0']).toStrictEqual([
      [1, 1],
      [2, 1],
      [1, 10],
    ]);

    expect(doesCellContainABoat).toEqual(false);
  });

  it('should add the targeted cell to the visible board and hit a boat', () => {
    service['visiblePlayerBoards'] = visiblePlayerBoards2();
    service['masterPlayerBoards'] = masterPlayerBoards1();
    service['playersFleet'] = gameConfiguration1().boats;

    const doesCellContainABoat = service['doesCellContainABoat'](
      'player0',
      [3, 1],
    );

    expect(service['visiblePlayerBoards']['player0']).toStrictEqual([
      [1, 1],
      [2, 1],
      [3, 1],
    ]);

    expect(doesCellContainABoat).toEqual(true);
  });

  it('should find the boats of the player that are still in game', () => {
    service['playersFleet'] = gameConfiguration1().boats;
    const playerBoats = service['playersFleet']['player0'];

    const stillInGameBoats = service['findStillInGamePlayerBoats'](playerBoats);

    expect(stillInGameBoats).toStrictEqual([
      {
        boatName: 'destroyer',
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
    service['playersFleet'] = gameConfiguration1().boats;

    service['updatePlayerBoatObject']('player0', [3, 1]);

    expect(service['playersFleet']['player0'][0]).toStrictEqual({
      boatName: 'destroyer',
      emplacement: [
        [3, 1],
        [2, 1],
        [1, 1],
      ],
      hit: [[3, 1]],
      isSunk: false,
    });

    service['updatePlayerBoatObject']('player0', [2, 1]);
    expect(service['playersFleet']['player0'][0].isSunk).toEqual(false);

    service['updatePlayerBoatObject']('player0', [1, 1]);
    expect(service['playersFleet']['player0'][0].isSunk).toEqual(true);
  });

  it('should update player boat object and throw an error because boat is already hit on targeted cell ', () => {
    service['playersFleet'] = gameConfiguration1().boats;

    service['updatePlayerBoatObject']('player0', [3, 1]);

    expect(service['playersFleet']['player0'][0]).toStrictEqual({
      boatName: 'destroyer',
      emplacement: [
        [3, 1],
        [2, 1],
        [1, 1],
      ],
      hit: [[3, 1]],
      isSunk: false,
    });

    service['updatePlayerBoatObject']('player0', [2, 1]);
    expect(service['playersFleet']['player0'][0].isSunk).toEqual(false);

    expect(() =>
      service['updatePlayerBoatObject']('player0', [3, 1]),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.cellAlreadyHit,
        message: GameEngineErrorMessages.cellAlreadyHit,
      }),
    );
    expect(service['playersFleet']['player0'][0].hit).toEqual([
      [3, 1],
      [2, 1],
    ]);
    expect(service['playersFleet']['player0'][0].isSunk).toEqual(false);
  });

  it('should generate the game arsenal', () => {
    expect(service['generateGameArsenal'](gameConfiguration1())).toEqual(
      gameArsenal1(),
    );
  });

  it('should not shoot because the game is not started', () => {
    expect(() => service.shoot('player0', bomb(), [1, 1])).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.gameNotStarted,
        message: GameEngineErrorMessages.gameNotStarted,
      }),
    );
  });

  it('should not shoot because no remaining ammunition', () => {
    service.gameState = GameState.playing;

    const weapon = bomb();
    weapon.ammunitionRemaining = 0;

    expect(() => service.shoot('player0', weapon, [1, 1])).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.noRemainingAmmunition,
        message: GameEngineErrorMessages.noRemainingAmmunition,
      }),
    );
  });

  it('should not shoot because the origin cell is out of bound', () => {
    service.gameState = GameState.playing;

    expect(() => service.shoot('player0', bomb(), [0, 1])).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.outOfBounds,
        message: GameEngineErrorMessages.outOfBounds,
      }),
    );

    expect(() => service.shoot('player0', bomb(), [1, 0])).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.outOfBounds,
        message: GameEngineErrorMessages.outOfBounds,
      }),
    );
  });

  it('should shoot', () => {
    service.gameState = GameState.playing;

    expect(() => service.shoot('player0', bomb(), [1, 1])).not.toThrowError();
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
});
