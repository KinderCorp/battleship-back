import { Test, TestingModule } from '@nestjs/testing';

import { GameBoat, GamePlayer } from '@interfaces/engine.interface';
import {
  GameEngineErrorCodes,
  GameEngineErrorMessages,
} from '@interfaces/error.interface';
import {
  guestPlayer1,
  guestPlayer2,
  invalidBoatPlacement1,
  invalidBoatPlacement2,
  invalidBoatPlacement3,
  invalidBoatPlacement4,
  invalidBoatPlacement5,
  invalidBoatPlacement6,
  loggedPlayer1,
  loggedPlayer2,
  validBoatPlacement1,
  validBoatPlacement2,
} from '@tests/datasets/game-instance.dataset';
import { DEFAULT_BOARD_GAME } from '@shared/game-instance.const';
import GameEngineError from '@shared/game-engine-error';
import GameInstanceValidatorsService from '@engine/game-instance-validators.service';

// npm run test:unit -- src/tests/game-instance-validators.service.spec.ts --watch

describe('GameInstanceValidatorsService', () => {
  let service: GameInstanceValidatorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameInstanceValidatorsService],
    }).compile();

    service = module.get<GameInstanceValidatorsService>(
      GameInstanceValidatorsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate boat placement', () => {
    expect(
      service['validateBoatPlacement'](DEFAULT_BOARD_GAME, validBoatPlacement1),
    ).toEqual(true);
  });

  it('should throw an error for out of bounds placement', () => {
    expect(() =>
      service['validateBoatPlacement'](
        DEFAULT_BOARD_GAME,
        invalidBoatPlacement1,
      ),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.outOfBounds,
        message: GameEngineErrorMessages.outOfBounds,
      }),
    );
  });

  it('should throw an error for invalid boar placement because boat is not aligned', () => {
    expect(() =>
      service['validateBoatPlacement'](
        DEFAULT_BOARD_GAME,
        invalidBoatPlacement2,
      ),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.invalidBoat,
        message: GameEngineErrorMessages.invalidBoat,
      }),
    );
  });

  it('should throw an error for invalid boar placement because positions are not adjacent', () => {
    expect(() =>
      service['validateBoatPlacement'](
        DEFAULT_BOARD_GAME,
        invalidBoatPlacement3,
      ),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.invalidBoat,
        message: GameEngineErrorMessages.invalidBoat,
      }),
    );

    expect(() =>
      service['validateBoatPlacement'](
        DEFAULT_BOARD_GAME,
        invalidBoatPlacement4,
      ),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.invalidBoat,
        message: GameEngineErrorMessages.invalidBoat,
      }),
    );

    expect(() =>
      service['validateBoatPlacement'](
        DEFAULT_BOARD_GAME,
        invalidBoatPlacement5,
      ),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.invalidBoat,
        message: GameEngineErrorMessages.invalidBoat,
      }),
    );

    expect(() =>
      service['validateBoatPlacement'](
        DEFAULT_BOARD_GAME,
        invalidBoatPlacement6,
      ),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.invalidBoat,
        message: GameEngineErrorMessages.invalidBoat,
      }),
    );
  });

  it('should validate boats of players', () => {
    const boatsPlacement: GameBoat[][] = [
      [validBoatPlacement1, validBoatPlacement2],
      [validBoatPlacement1, validBoatPlacement2],
    ];

    expect(
      service.validateBoatsOfPlayers(DEFAULT_BOARD_GAME, boatsPlacement),
    ).toEqual(true);
  });

  it('should throw an error for invalid boats of players', () => {
    const boatsPlacement: GameBoat[][] = [
      [validBoatPlacement1, validBoatPlacement2],
      [validBoatPlacement1, invalidBoatPlacement1],
    ];

    expect(() =>
      service.validateBoatsOfPlayers(DEFAULT_BOARD_GAME, boatsPlacement),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.outOfBounds,
        message: GameEngineErrorMessages.outOfBounds,
      }),
    );
  });

  it('should validate 2 guest players', () => {
    const players = [guestPlayer1, guestPlayer2];

    expect(service.validatePlayers(players)).toEqual(true);
  });

  it('should validate 2 logged players', () => {
    const players = [loggedPlayer1, loggedPlayer2];

    expect(service.validatePlayers(players)).toEqual(true);
  });

  it('should validate 2 mixed players', () => {
    const players = [guestPlayer1, loggedPlayer1];

    expect(service.validatePlayers(players)).toEqual(true);
  });

  it('should throw a missing player error', () => {
    const players = [guestPlayer1];

    expect(() => service.validatePlayers(players)).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.missingPlayer,
        message: `${GameEngineErrorMessages.invalidNumberOfPlayers}.${GameEngineErrorMessages.twoPlayersRequired}`,
      }),
    );
  });

  it('should throw an invalid number of players error', () => {
    const players = [guestPlayer1, guestPlayer2, loggedPlayer1];

    expect(() => service.validatePlayers(players)).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.invalidNumberOfPlayers,
        message: `${GameEngineErrorMessages.invalidNumberOfPlayers}.${GameEngineErrorMessages.twoPlayersRequired}`,
      }),
    );
  });

  it('should throw an invalid number of players error', () => {
    const players: GamePlayer[] = [];

    expect(() => service.validatePlayers(players)).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.invalidNumberOfPlayers,
        message: `${GameEngineErrorMessages.invalidNumberOfPlayers}.${GameEngineErrorMessages.twoPlayersRequired}`,
      }),
    );
  });

  it('should validate board dimensions', () => {
    expect(service.validateBoardDimensions(10)).toEqual(true);
  });

  it('should invalidate board dimensions because too small', () => {
    expect(() => service.validateBoardDimensions(4)).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.invalidBoardGameDimensions,
        message: GameEngineErrorMessages.invalidBoardGameDimensions,
      }),
    );
  });

  it('should invalidate board dimensions because too large', () => {
    expect(() => service.validateBoardDimensions(100)).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.invalidBoardGameDimensions,
        message: GameEngineErrorMessages.invalidBoardGameDimensions,
      }),
    );
  });
});
