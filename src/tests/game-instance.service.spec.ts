import { Test, TestingModule } from '@nestjs/testing';

import {
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
      service.generateMasterPlayerBoards(gameConfiguration1().boats),
    ).toStrictEqual(masterPlayerBoards1());
  });

  it('should generate the visible player boards', () => {
    expect(
      service.generateVisiblePlayerBoards(gameConfiguration1().players),
    ).toStrictEqual(visiblePlayerBoards1());
  });

  it('should return true because the targeted cell has been already  hit', () => {
    service['visiblePlayerBoards'] = visiblePlayerBoards2();
    const hasCellAlreadyBeenHit = service.hasCellAlreadyBeenHit(
      'player0',
      [1, 1],
    );

    expect(hasCellAlreadyBeenHit).toEqual(true);
  });

  it('should return false because the targeted cell has not been already hit', () => {
    service['visiblePlayerBoards'] = visiblePlayerBoards2();
    const hasCellAlreadyBeenHit = service.hasCellAlreadyBeenHit(
      'player0',
      [1, 10],
    );

    expect(hasCellAlreadyBeenHit).toEqual(false);
  });

  it('should thrown an error if the targeted cell has been hit', () => {
    service['visiblePlayerBoards'] = visiblePlayerBoards2();

    expect(() => service.doesCellContainABoat('player0', [1, 1])).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.cellAlreadyHit,
        message: GameEngineErrorMessages.cellAlreadyHit,
      }),
    );
  });

  it('should add the targeted cell to the visible board and not hit a boat', () => {
    service['visiblePlayerBoards'] = visiblePlayerBoards2();
    service['masterPlayerBoards'] = masterPlayerBoards1();

    const doesCellContainABoat = service.doesCellContainABoat(
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

    const doesCellContainABoat = service.doesCellContainABoat(
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
});
