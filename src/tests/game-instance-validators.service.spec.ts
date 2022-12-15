import { Test, TestingModule } from '@nestjs/testing';

import { GameBoat, GamePlayer } from '@interfaces/engine.interface';
import {
  GameEngineErrorCodes,
  GameEngineErrorMessages,
} from '@interfaces/error.interface';
import {
  guestPlayer1,
  guestPlayer2,
  invalidBoatPlacement2,
  invalidBoatPlacement3,
  invalidBoatPlacement4,
  invalidBoatPlacement5,
  invalidBoatPlacement6,
  invalidBoatPlacement7,
  invalidGalley1,
  loggedPlayer1,
  loggedPlayer2,
  validGalley,
  validPlayerFleet,
  validRaft,
  validShallop,
  visiblePlayerBoards2,
} from '@tests/datasets/game-instance.dataset';
import { DEFAULT_BOARD_GAME } from '@shared/game-instance.const';
import GameEngineError from '@shared/game-engine-error';
import GameInstanceValidatorsService from '@engine/game-instance-validators.service';
import { shuffle } from 'radash';

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
      service['validateBoatPlacement'](DEFAULT_BOARD_GAME, validRaft()),
    ).toEqual(true);

    expect(
      service['validateBoatPlacement'](DEFAULT_BOARD_GAME, validShallop()),
    ).toEqual(true);
  });

  it('should throw an error for out of bounds placement', () => {
    expect(() =>
      service['validateBoatPlacement'](DEFAULT_BOARD_GAME, invalidGalley1()),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.OUT_OF_BOUNDS,
        message: GameEngineErrorMessages.OUT_OF_BOUNDS,
      }),
    );
  });

  it('should throw an error for invalid boar placement because boat is not aligned', () => {
    expect(() =>
      service['validateBoatPlacement'](
        DEFAULT_BOARD_GAME,
        invalidBoatPlacement2(),
      ),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.INVALID_BOAT,
        message: GameEngineErrorMessages.INVALID_BOAT,
      }),
    );
  });

  it('should throw an error for invalid boar placement because positions are not adjacent', () => {
    expect(() =>
      service['validateBoatPlacement'](
        DEFAULT_BOARD_GAME,
        invalidBoatPlacement3(),
      ),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.INVALID_BOAT,
        message: GameEngineErrorMessages.INVALID_BOAT,
      }),
    );

    expect(() =>
      service['validateBoatPlacement'](
        DEFAULT_BOARD_GAME,
        invalidBoatPlacement4(),
      ),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.INVALID_BOAT,
        message: GameEngineErrorMessages.INVALID_BOAT,
      }),
    );

    expect(() =>
      service['validateBoatPlacement'](
        DEFAULT_BOARD_GAME,
        invalidBoatPlacement5(),
      ),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.INVALID_BOAT,
        message: GameEngineErrorMessages.INVALID_BOAT,
      }),
    );

    expect(() =>
      service['validateBoatPlacement'](
        DEFAULT_BOARD_GAME,
        invalidBoatPlacement6(),
      ),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.INVALID_BOAT,
        message: GameEngineErrorMessages.INVALID_BOAT,
      }),
    );

    expect(() =>
      service['validateBoatPlacement'](
        DEFAULT_BOARD_GAME,
        invalidBoatPlacement7(),
      ),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.INVALID_BOAT,
        message: GameEngineErrorMessages.INVALID_BOAT,
      }),
    );
  });

  it('should validate boats of players', () => {
    jest.spyOn(service, 'validateAuthorisedFleet').mockReturnValue(true);

    const boatsPlacement: GameBoat[][] = [
      [validRaft(), validGalley()],
      [validRaft(), validGalley()],
    ];

    expect(
      service.validateBoatsOfPlayers(DEFAULT_BOARD_GAME, boatsPlacement),
    ).toEqual(true);
  });

  it('should throw an error for invalid boats of players', () => {
    jest.spyOn(service, 'validateAuthorisedFleet').mockReturnValue(true);
    const boatsPlacement: GameBoat[][] = [
      [validRaft(), validGalley()],
      [validRaft(), invalidGalley1()],
    ];

    expect(() =>
      service.validateBoatsOfPlayers(DEFAULT_BOARD_GAME, boatsPlacement),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.OUT_OF_BOUNDS,
        message: GameEngineErrorMessages.OUT_OF_BOUNDS,
      }),
    );
  });

  it('should validate 2 guest players', () => {
    const players = [guestPlayer1(), guestPlayer2()];

    expect(service.validatePlayers(players)).toEqual(true);
  });

  it('should validate 2 logged players', () => {
    const players = [loggedPlayer1(), loggedPlayer2()];

    expect(service.validatePlayers(players)).toEqual(true);
  });

  it('should validate 2 mixed players', () => {
    const players = [guestPlayer1(), loggedPlayer1()];

    expect(service.validatePlayers(players)).toEqual(true);
  });

  it('should throw a missing player error', () => {
    const players = [guestPlayer1()];

    expect(() => service.validatePlayers(players)).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.MISSING_PLAYER,
        message: `${GameEngineErrorMessages.INVALID_NUMBER_OF_PLAYERS}.${GameEngineErrorMessages.TWO_PLAYERS_REQUIRED}`,
      }),
    );
  });

  it('should throw an invalid number of players error', () => {
    const players = [guestPlayer1(), guestPlayer2(), loggedPlayer1()];

    expect(() => service.validatePlayers(players)).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.INVALID_NUMBER_OF_PLAYERS,
        message: `${GameEngineErrorMessages.INVALID_NUMBER_OF_PLAYERS}.${GameEngineErrorMessages.TWO_PLAYERS_REQUIRED}`,
      }),
    );
  });

  it('should throw an invalid number of players error', () => {
    const players: GamePlayer[] = [];

    expect(() => service.validatePlayers(players)).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.INVALID_NUMBER_OF_PLAYERS,
        message: `${GameEngineErrorMessages.INVALID_NUMBER_OF_PLAYERS}.${GameEngineErrorMessages.TWO_PLAYERS_REQUIRED}`,
      }),
    );
  });

  it('should validate board dimensions', () => {
    expect(service.validateBoardDimensions(10)).toEqual(true);
  });

  it('should invalidate board dimensions because too small', () => {
    expect(() => service.validateBoardDimensions(4)).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.INVALID_BOARD_GAME_DIMENSIONS,
        message: GameEngineErrorMessages.INVALID_BOARD_GAME_DIMENSIONS,
      }),
    );
  });

  it('should invalidate board dimensions because too large', () => {
    expect(() => service.validateBoardDimensions(100)).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.INVALID_BOARD_GAME_DIMENSIONS,
        message: GameEngineErrorMessages.INVALID_BOARD_GAME_DIMENSIONS,
      }),
    );
  });

  it('should return throw an error because the targeted cell has been already  hit', () => {
    const visiblePlayerBoards = visiblePlayerBoards2();
    const arrayOfCells = visiblePlayerBoards['drakenline_0'];

    expect(() =>
      service.validateCellHasNotBeenHit(arrayOfCells, [1, 1]),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.CELL_ALREADY_HIT,
        message: GameEngineErrorMessages.CELL_ALREADY_HIT,
      }),
    );
  });

  it('should return true because the targeted cell has not been already hit', () => {
    const visiblePlayerBoards = visiblePlayerBoards2();
    const arrayOfCells = visiblePlayerBoards['drakenline_0'];

    const hasCellAlreadyBeenHit = service.validateCellHasNotBeenHit(
      arrayOfCells,
      [1, 10],
    );

    expect(hasCellAlreadyBeenHit).toEqual(true);
  });

  it('should validate authorised fleet', () => {
    expect(service.validateAuthorisedFleet(validPlayerFleet())).toEqual(true);
    expect(
      service.validateAuthorisedFleet(shuffle(validPlayerFleet())),
    ).toEqual(true);
  });

  it('should not validate authorised fleet', () => {
    const errorKey = 'UNAUTHORISED_FLEET';
    expect(() =>
      service.validateAuthorisedFleet(validPlayerFleet().slice(2)),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes[errorKey],
        message: GameEngineErrorMessages[errorKey],
      }),
    );
  });
});
