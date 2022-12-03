import { GamePlayer } from './../interfaces/engine.interface';
import { Test, TestingModule } from '@nestjs/testing';

import {
  bomb,
  fakeWeapon,
  gameArsenal1,
  gameConfiguration1,
  guestPlayer1,
  guestPlayer2,
  loggedPlayer1,
  masterPlayerBoards1,
  turn1,
  validBoatPlacement1,
  validBoatPlacement3,
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

const firstPlayer = {
  id: '1a21eb98-e697-4ff3-aa0b-055b27f84a15',
  pseudo: 'Zakary',
};

const baseGameConfiguration = {
  gameMode: GameMode.OneVersusOne,
  firstPlayer: firstPlayer,
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
    const gameConfiguration = gameConfiguration1();
    const spyValidateBoats = jest
      .spyOn(gameInstanceValidatorsService, 'validateBoatsOfPlayers')
      .mockReturnValue(true);

    service.startGame(gameConfiguration);

    expect(spyValidateBoats).toHaveBeenCalledTimes(1);
    expect(service['gameConfiguration']).toEqual(gameConfiguration);
    expect(service['masterPlayerBoards']).toBeDefined();
    expect(service['visiblePlayerBoards']).toBeDefined();
    expect(service['gameArsenal']).toBeDefined();
    expect(service['turn']).toBeDefined();
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
        code: GameEngineErrorCodes.cellAlreadyHit,
        message: GameEngineErrorMessages.cellAlreadyHit,
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
    service['gameConfiguration'] = gameConfiguration1();
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
    service['gameConfiguration'] = gameConfiguration1();
    const playerBoats = service['gameConfiguration']['boats']['drakenline_0'];

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
    service['gameConfiguration'] = gameConfiguration1();
    const targetedPlayer = guestPlayer1();

    service['updatePlayerBoatObject'](targetedPlayer, [3, 1]);

    expect(
      service['gameConfiguration']['boats'][targetedPlayer.id][0],
    ).toStrictEqual({
      boatName: 'destroyer',
      emplacement: [
        [1, 1],
        [2, 1],
        [3, 1],
      ],
      hit: [[3, 1]],
      isSunk: false,
    });

    service['updatePlayerBoatObject'](targetedPlayer, [2, 1]);
    expect(
      service['gameConfiguration']['boats'][targetedPlayer.id][0].isSunk,
    ).toEqual(false);

    service['updatePlayerBoatObject'](targetedPlayer, [1, 1]);
    expect(
      service['gameConfiguration']['boats'][targetedPlayer.id][0].isSunk,
    ).toEqual(true);
  });

  it('should update player boat object and throw an error because boat is already hit on targeted cell ', () => {
    service['gameConfiguration'] = gameConfiguration1();
    const targetedPlayer = guestPlayer1();

    service['updatePlayerBoatObject'](targetedPlayer, [3, 1]);

    expect(
      service['gameConfiguration']['boats'][targetedPlayer.id][0],
    ).toStrictEqual({
      boatName: 'destroyer',
      emplacement: [
        [1, 1],
        [2, 1],
        [3, 1],
      ],
      hit: [[3, 1]],
      isSunk: false,
    });

    service['updatePlayerBoatObject'](targetedPlayer, [2, 1]);
    expect(
      service['gameConfiguration']['boats'][targetedPlayer.id][0].isSunk,
    ).toEqual(false);

    expect(() =>
      service['updatePlayerBoatObject'](targetedPlayer, [3, 1]),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.cellAlreadyHit,
        message: GameEngineErrorMessages.cellAlreadyHit,
      }),
    );
    expect(
      service['gameConfiguration']['boats'][targetedPlayer.id][0].hit,
    ).toEqual([
      [2, 1],
      [3, 1],
    ]);
    expect(
      service['gameConfiguration']['boats'][targetedPlayer.id][0].isSunk,
    ).toEqual(false);
  });

  it('should generate the game arsenal', () => {
    expect(service['generateGameArsenal'](gameConfiguration1())).toEqual(
      gameArsenal1(),
    );
  });

  it('should not shoot because the game is not started', () => {
    expect(() => service.shoot(guestPlayer1(), bomb(), [1, 1])).toThrowError(
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

    expect(() => service.shoot(guestPlayer1(), weapon, [1, 1])).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.noAmmunitionRemaining,
        message: GameEngineErrorMessages.noAmmunitionRemaining,
      }),
    );
  });

  it('should not shoot because the origin cell is out of bound', () => {
    service.gameState = GameState.playing;

    expect(() => service.shoot(guestPlayer1(), bomb(), [0, 1])).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.outOfBounds,
        message: GameEngineErrorMessages.outOfBounds,
      }),
    );

    expect(() => service.shoot(guestPlayer1(), bomb(), [1, 0])).toThrowError(
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
    service['gameConfiguration'] = gameConfiguration1();
    service['gameArsenal'] = gameArsenal1();
    const targetedPlayer = guestPlayer1();

    jest
      .spyOn(gameInstanceValidatorsService, 'validateCellHasNotBeenHit')
      .mockReturnValue(true);

    expect(
      service['gameArsenal'][targetedPlayer.id][0].ammunitionRemaining,
    ).toEqual(-1);
    expect(
      service['gameConfiguration']['boats'][targetedPlayer.id][0].hit,
    ).toHaveLength(0);
    expect(() =>
      service.shoot(
        targetedPlayer,
        service['gameArsenal'][targetedPlayer.id][0],
        [1, 1],
      ),
    ).not.toThrowError();
    expect(
      service['gameConfiguration']['boats'][targetedPlayer.id][0].hit,
    ).toEqual([[1, 1]]);
    expect(
      service['gameArsenal'][targetedPlayer.id][0].ammunitionRemaining,
    ).toEqual(-1);
  });

  it('should shoot with the triple weapon', () => {
    service.gameState = GameState.playing;
    service['visiblePlayerBoards'] = visiblePlayerBoards1();
    service['masterPlayerBoards'] = masterPlayerBoards1();
    service['gameConfiguration'] = gameConfiguration1();
    service['gameArsenal'] = gameArsenal1();

    jest
      .spyOn(gameInstanceValidatorsService, 'validateCellHasNotBeenHit')
      .mockReturnValue(true);

    expect(
      service['gameArsenal']['drakenline_0'][1].ammunitionRemaining,
    ).toEqual(1);
    expect(
      service['gameConfiguration']['boats']['drakenline_0'][0].hit,
    ).toHaveLength(0);
    expect(() =>
      service.shoot(
        guestPlayer1(),
        service['gameArsenal']['drakenline_0'][1],
        [2, 1],
      ),
    ).not.toThrowError();
    expect(
      service['gameConfiguration']['boats']['drakenline_0'][0].hit,
    ).toEqual([
      [1, 1],
      [2, 1],
      [3, 1],
    ]);
    expect(
      service['gameConfiguration']['boats']['drakenline_0'][0].isSunk,
    ).toEqual(true);
    expect(
      service['gameArsenal']['drakenline_0'][1].ammunitionRemaining,
    ).toEqual(0);
  });

  it('should shoot with the triple weapon with some cells out of bounds', () => {
    service.gameState = GameState.playing;
    service['visiblePlayerBoards'] = visiblePlayerBoards1();
    service['masterPlayerBoards'] = masterPlayerBoards1();
    service['gameConfiguration'] = gameConfiguration1();
    service['gameArsenal'] = gameArsenal1();
    const targetedPlayer = guestPlayer1();

    jest
      .spyOn(gameInstanceValidatorsService, 'validateCellHasNotBeenHit')
      .mockReturnValue(true);

    expect(
      service['gameArsenal'][targetedPlayer.id][1].ammunitionRemaining,
    ).toEqual(1);
    expect(
      service['gameConfiguration']['boats'][targetedPlayer.id][0].hit,
    ).toHaveLength(0);
    expect(() =>
      service.shoot(
        targetedPlayer,
        service['gameArsenal'][targetedPlayer.id][1],
        [3, 1],
      ),
    ).not.toThrowError();
    expect(
      service['gameConfiguration']['boats'][targetedPlayer.id][0].hit,
    ).toEqual([
      [2, 1],
      [3, 1],
    ]);
    expect(
      service['gameConfiguration']['boats'][targetedPlayer.id][0].isSunk,
    ).toEqual(false);
    expect(
      service['gameArsenal'][targetedPlayer.id][1].ammunitionRemaining,
    ).toEqual(0);
    expect(service['visiblePlayerBoards'][targetedPlayer.id]).toEqual([
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
    service['gameConfiguration'] = gameConfiguration1();

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
    const playerFleet = [validBoatPlacement3(), validBoatPlacement3()];

    expect(service['hasPlayerFleetBeenSunk'](playerFleet)).toEqual(true);
  });

  it('should return false because the player fleet has been sunk', () => {
    const playerFleet = [validBoatPlacement1(), validBoatPlacement3()];

    expect(service['hasPlayerFleetBeenSunk'](playerFleet)).toEqual(false);
  });

  it('should return false because none fleet have been sunk', () => {
    service['gameConfiguration'] = gameConfiguration1();

    expect(service['isGameOver']()).toEqual(false);
  });

  it('should return the end game recap because a fleet have been sunk', () => {
    service['gameConfiguration'] = gameConfiguration1();
    service['gameConfiguration'].boats['drakenline_0'] = [
      validBoatPlacement3(),
      validBoatPlacement3(),
    ];

    expect(service['isGameOver']()).toEqual({
      loser: [guestPlayer2()],
      winner: [guestPlayer1()],
    });
  });

  it('should return the end game recap with 2 losers because a fleet have been sunk', () => {
    service['gameConfiguration'] = gameConfiguration1();
    service['gameConfiguration'].players.push(loggedPlayer1());
    service['gameConfiguration'].boats['drakenline_0'] = [
      validBoatPlacement3(),
      validBoatPlacement3(),
    ];

    expect(service['isGameOver']()).toEqual({
      loser: [guestPlayer2(), loggedPlayer1()],
      winner: [guestPlayer1()],
    });
  });
});
