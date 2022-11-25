import { Test, TestingModule } from '@nestjs/testing';

import { BoatPlacement, GamePlayer } from '@interfaces/engine.interface';
import {
  GameEngineErrorCodes,
  GameEngineErrorMessages,
} from '@interfaces/error.interface';
import {
  guestPlayer1,
  guestPlayer2,
  invalidBoatPlacement1,
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
      service.validateBoatPlacement(DEFAULT_BOARD_GAME, validBoatPlacement1),
    ).toEqual(true);
  });

  it('should throw an error for invalid boat placement', () => {
    expect(() =>
      service.validateBoatPlacement(DEFAULT_BOARD_GAME, invalidBoatPlacement1),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.outOfBounds,
        message: GameEngineErrorMessages.outOfBounds,
      }),
    );
  });

  it('should validate players boats', () => {
    const boatsPlacement: BoatPlacement[] = [
      validBoatPlacement1,
      validBoatPlacement2,
    ];

    expect(
      service.validatePlayerBoats(DEFAULT_BOARD_GAME, boatsPlacement),
    ).toEqual(true);
  });

  it('should throw an error for invalid player boats', () => {
    const boatsPlacement: BoatPlacement[] = [
      validBoatPlacement1,
      invalidBoatPlacement1,
    ];

    expect(() =>
      service.validatePlayerBoats(DEFAULT_BOARD_GAME, boatsPlacement),
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
});
