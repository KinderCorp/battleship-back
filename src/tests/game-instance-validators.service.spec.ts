import { Test, TestingModule } from '@nestjs/testing';

import {
  BoatDirection,
  GameBoat,
  GamePlayer,
} from '@interfaces/engine.interface';
import {
  GameEngineErrorCodes,
  GameEngineErrorMessages,
} from '@interfaces/error.interface';
import { BoatName } from '@interfaces/boat.interface';
import GameEngineError from '@shared/game-engine-error';
import GameInstanceValidatorsService from '@engine/game-instance-validators.service';

import {
  DEFAULT_AUTHORISED_FLEET,
  DEFAULT_BOARD_GAME,
} from '@shared/game-instance.const';
import {
  gameBoatConfigurationGalley,
  gameBoatConfigurationHugeRaft,
  gameBoatConfigurationRaft,
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
  storedHugeRaft,
  storedRaft,
  validGalley,
  validPlayerFleet,
  validRaft,
  validShallop,
  visiblePlayerBoards2,
} from '@tests/datasets/game-instance.dataset';
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
      service.validateBoatsOfPlayers(
        DEFAULT_AUTHORISED_FLEET,
        DEFAULT_BOARD_GAME,
        boatsPlacement,
      ),
    ).toEqual(true);
  });

  it('should throw an error for invalid boats of players', () => {
    jest.spyOn(service, 'validateAuthorisedFleet').mockReturnValue(true);
    const boatsPlacement: GameBoat[][] = [
      [validRaft(), validGalley()],
      [validRaft(), invalidGalley1()],
    ];

    expect(() =>
      service.validateBoatsOfPlayers(
        DEFAULT_AUTHORISED_FLEET,
        DEFAULT_BOARD_GAME,
        boatsPlacement,
      ),
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
    expect(
      service.validateAuthorisedFleet(
        DEFAULT_AUTHORISED_FLEET,
        validPlayerFleet(),
      ),
    ).toEqual(true);
    expect(
      service.validateAuthorisedFleet(
        DEFAULT_AUTHORISED_FLEET,
        shuffle(validPlayerFleet()),
      ),
    ).toEqual(true);
  });

  it('should not validate authorised fleet', () => {
    const errorKey = 'UNAUTHORISED_FLEET';
    expect(() =>
      service.validateAuthorisedFleet(
        DEFAULT_AUTHORISED_FLEET,
        validPlayerFleet().slice(2),
      ),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes[errorKey],
        message: GameEngineErrorMessages[errorKey],
      }),
    );
  });

  it('should validate boat names', () => {
    const arrayOfBoatConfigurations = [
      gameBoatConfigurationRaft(),
      gameBoatConfigurationGalley(),
    ];

    expect(() =>
      service.validateBoatNames(arrayOfBoatConfigurations),
    ).not.toThrowError();
  });

  it('should not validate boat names', () => {
    const arrayOfBoatConfigurations = [
      gameBoatConfigurationRaft(),
      gameBoatConfigurationGalley(),
    ];

    arrayOfBoatConfigurations[0].name = 'pikachu' as BoatName;

    expect(() =>
      service.validateBoatNames(arrayOfBoatConfigurations),
    ).toThrowError(
      new GameEngineError({
        code: GameEngineErrorCodes.INVALID_BOAT_NAME,
        message: GameEngineErrorMessages.INVALID_BOAT_NAME,
      }),
    );
  });

  it('should validate boat width', () => {
    expect(() =>
      service.validateBoatWidth(gameBoatConfigurationRaft(), storedRaft()),
    ).not.toThrowError();

    expect(() =>
      service.validateBoatWidth(
        gameBoatConfigurationHugeRaft(),
        storedHugeRaft(),
      ),
    ).not.toThrowError();
  });

  it('should not validate boat width', () => {
    expect(() =>
      service.validateBoatWidth(gameBoatConfigurationRaft(), storedHugeRaft()),
    ).toThrowError();
  });

  it('should validate cell is in bounds', () => {
    expect(() =>
      service.validateCellIsInBounds([1, 1], DEFAULT_BOARD_GAME),
    ).not.toThrowError();
    expect(() =>
      service.validateCellIsInBounds([10, 10], DEFAULT_BOARD_GAME),
    ).not.toThrowError();
  });

  it('should not validate cell is in bounds', () => {
    const error = new GameEngineError({
      code: GameEngineErrorCodes.OUT_OF_BOUNDS,
      message: GameEngineErrorMessages.OUT_OF_BOUNDS,
    });

    expect(() =>
      service.validateCellIsInBounds([-1, 1], DEFAULT_BOARD_GAME),
    ).toThrowError(error);
    expect(() =>
      service.validateCellIsInBounds([11, 9], DEFAULT_BOARD_GAME),
    ).toThrowError(error);
  });

  it('should validate cells are aligned with direction', () => {
    const spyValidateNumbersAreAdjacent = jest
      .spyOn(service, 'validateNumbersAreAdjacent')
      .mockImplementation();

    service.validateBowCellsAreAlignedWithDirection(BoatDirection.NORTH, [
      [5, 6],
      [5, 5],
    ]);
    expect(spyValidateNumbersAreAdjacent).toHaveBeenCalledWith([6, 5]);

    service.validateBowCellsAreAlignedWithDirection(BoatDirection.SOUTH, [
      [5, 6],
      [5, 5],
    ]);
    expect(spyValidateNumbersAreAdjacent).toHaveBeenCalledWith([6, 5]);

    service.validateBowCellsAreAlignedWithDirection(BoatDirection.EAST, [
      [5, 5],
      [6, 5],
    ]);
    expect(spyValidateNumbersAreAdjacent).toHaveBeenCalledWith([6, 5]);

    service.validateBowCellsAreAlignedWithDirection(BoatDirection.WEST, [
      [5, 5],
      [6, 5],
    ]);
    expect(spyValidateNumbersAreAdjacent).toHaveBeenCalledWith([6, 5]);

    service.validateBowCellsAreAlignedWithDirection(BoatDirection.NORTH, [
      [5, 5],
    ]);

    expect(spyValidateNumbersAreAdjacent).toHaveBeenCalledTimes(4);
  });
});
