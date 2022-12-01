import { Test, TestingModule } from '@nestjs/testing';

import {
  bomb,
  fakeWeapon,
  gameArsenal1,
  gameConfiguration1,
  masterPlayerBoards1,
  visiblePlayerBoards1,
  visiblePlayerBoards2,
  visiblePlayerBoards3,
} from '@tests/datasets/game-instance.dataset';
import { Cell, GameMode, GameState } from '@interfaces/engine.interface';
import {
  GameEngineErrorCodes,
  GameEngineErrorMessages,
} from '@interfaces/error.interface';
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
    const spyValidateBoats = jest
      .spyOn(gameInstanceValidatorsService, 'validateBoatsOfPlayers')
      .mockReturnValue(true);

    service.startGame(gameConfiguration1());

    expect(service.gameState).toEqual(GameState.playing);
    expect(spyValidateBoats).toHaveBeenCalledTimes(1);
    expect(service['masterPlayerBoards']).toBeDefined();
    expect(service['visiblePlayerBoards']).toBeDefined();
    expect(service['gameArsenal']).toBeDefined();
    expect(service['gameConfiguration']).toBeDefined();
    expect(service['playersFleet']).toBeDefined();
    expect(service['temporaryPlayerPseudos']).toBeDefined();
    expect(service['temporaryPlayerPseudos']).toHaveLength(2);
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
    const temporaryPlayerPseudos = ['drakenline0', 'nonma1'];

    expect(
      service['generateVisiblePlayerBoards'](temporaryPlayerPseudos),
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
        [1, 1],
        [2, 1],
        [3, 1],
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
        [1, 1],
        [2, 1],
        [3, 1],
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
      [2, 1],
      [3, 1],
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

  it('should shoot with a bomb weapon', () => {
    service.gameState = GameState.playing;
    service['visiblePlayerBoards'] = visiblePlayerBoards2();
    service['masterPlayerBoards'] = masterPlayerBoards1();
    service['playersFleet'] = gameConfiguration1().boats;
    service['gameArsenal'] = gameArsenal1();

    jest
      .spyOn(gameInstanceValidatorsService, 'validateCellHasNotBeenHit')
      .mockReturnValue(true);

    expect(service['gameArsenal']['player0'][0].ammunitionRemaining).toEqual(
      -1,
    );
    expect(service['playersFleet']['player0'][0].hit).toHaveLength(0);
    expect(() =>
      service.shoot('player0', service['gameArsenal']['player0'][0], [1, 1]),
    ).not.toThrowError();
    expect(service['playersFleet']['player0'][0].hit).toEqual([[1, 1]]);
    expect(service['gameArsenal']['player0'][0].ammunitionRemaining).toEqual(
      -1,
    );
  });

  it('should shoot with the triple weapon', () => {
    service.gameState = GameState.playing;
    service['visiblePlayerBoards'] = visiblePlayerBoards3();
    service['masterPlayerBoards'] = masterPlayerBoards1();
    service['playersFleet'] = gameConfiguration1().boats;
    service['gameArsenal'] = gameArsenal1();

    jest
      .spyOn(gameInstanceValidatorsService, 'validateCellHasNotBeenHit')
      .mockReturnValue(true);

    expect(service['gameArsenal']['player0'][1].ammunitionRemaining).toEqual(1);
    expect(service['playersFleet']['player0'][0].hit).toHaveLength(0);
    expect(() =>
      service.shoot('player0', service['gameArsenal']['player0'][1], [2, 1]),
    ).not.toThrowError();
    expect(service['playersFleet']['player0'][0].hit).toEqual([
      [1, 1],
      [2, 1],
      [3, 1],
    ]);
    expect(service['playersFleet']['player0'][0].isSunk).toEqual(true);
    expect(service['gameArsenal']['player0'][1].ammunitionRemaining).toEqual(0);
  });

  it('should shoot with the triple weapon with some cells out of bounds', () => {
    service.gameState = GameState.playing;
    service['visiblePlayerBoards'] = visiblePlayerBoards3();
    service['masterPlayerBoards'] = masterPlayerBoards1();
    service['playersFleet'] = gameConfiguration1().boats;
    service['gameArsenal'] = gameArsenal1();
    const targetedPlayer = 'player0';

    jest
      .spyOn(gameInstanceValidatorsService, 'validateCellHasNotBeenHit')
      .mockReturnValue(true);

    expect(
      service['gameArsenal'][targetedPlayer][1].ammunitionRemaining,
    ).toEqual(1);
    expect(service['playersFleet'][targetedPlayer][0].hit).toHaveLength(0);
    expect(() =>
      service.shoot(
        targetedPlayer,
        service['gameArsenal'][targetedPlayer][1],
        [3, 1],
      ),
    ).not.toThrowError();
    expect(service['playersFleet'][targetedPlayer][0].hit).toEqual([
      [2, 1],
      [3, 1],
    ]);
    expect(service['playersFleet'][targetedPlayer][0].isSunk).toEqual(false);
    expect(
      service['gameArsenal'][targetedPlayer][1].ammunitionRemaining,
    ).toEqual(0);
    expect(service['visiblePlayerBoards'][targetedPlayer]).toEqual([
      [4, 1],
      [3, 1],
      [2, 1],
    ]);
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

  it('should generate temporary pseudo for players', () => {
    const temporaryPlayerPseudos = service['generateTemporaryPlayerPseudos'](
      gameConfiguration1().players,
    );

    expect(temporaryPlayerPseudos).toEqual(['drakenline0', 'nonma1']);
  });
});
