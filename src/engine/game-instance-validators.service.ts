import { Injectable } from '@nestjs/common';
import { isEqual } from 'radash';

import {
  AuthorisedFleet,
  BoatDirection,
  Cell,
  GameBoard,
  GameBoat,
  GameBoatSettings,
  GamePlayer,
  Turn,
} from '@interfaces/engine.interface';
import {
  GameEngineErrorCodes,
  GameEngineErrorMessages,
} from '@interfaces/error.interface';
import {
  MAX_BOARD_GAME_DIMENSIONS,
  MIN_BOARD_GAME_DIMENSIONS,
} from '@shared/game-instance.const';
import Boat from '@boat/boat.entity';
import { BoatName } from '@interfaces/boat.interface';
import GameEngineError from '@shared/game-engine-error';

@Injectable()
export default class GameInstanceValidatorsService {
  public validateActionCanBeExecuted(turn: Turn) {
    if (turn.actionRemaining < 1) {
      const errorKey = 'NO_ACTION_REMAINING';

      throw new GameEngineError({
        code: GameEngineErrorCodes[errorKey],
        message: GameEngineErrorMessages[errorKey],
      });
    }

    return true;
  }

  public validateAuthorisedFleet(
    authorisedFleet: AuthorisedFleet,
    playerFleet: GameBoat[],
  ) {
    const expectedReducedAuthorisedFleet = authorisedFleet.reduce(
      (acc, currentValue) => {
        acc[currentValue.boat.name] = currentValue.authorisedNumber;
        return acc;
      },
      {} as Record<string, number>,
    );

    const actualReducedAuthorisedFleet = playerFleet.reduce(
      (acc, currentValue) => {
        const { boatName } = currentValue;
        acc[boatName] = playerFleet.filter(
          (boat) => boat.boatName === currentValue.boatName,
        ).length;
        return acc;
      },
      {} as Record<string, number>,
    );

    if (
      !isEqual(expectedReducedAuthorisedFleet, actualReducedAuthorisedFleet)
    ) {
      const errorKey = 'UNAUTHORISED_FLEET';

      throw new GameEngineError({
        code: GameEngineErrorCodes[errorKey],
        message: GameEngineErrorMessages[errorKey],
      });
    }

    return true;
  }

  public validateBoardDimensions(boardDimensions: number) {
    if (
      boardDimensions < MIN_BOARD_GAME_DIMENSIONS ||
      boardDimensions > MAX_BOARD_GAME_DIMENSIONS
    ) {
      throw new GameEngineError({
        code: GameEngineErrorCodes.INVALID_BOARD_GAME_DIMENSIONS,
        message: GameEngineErrorMessages.INVALID_BOARD_GAME_DIMENSIONS,
      });
    }

    return true;
  }

  public validateBoatNames(boats: GameBoatSettings[]) {
    boats.forEach((boat) => {
      if (!Object.values(BoatName).includes(boat.name)) {
        const errorKey = 'INVALID_BOAT_NAME';

        throw new GameEngineError({
          code: GameEngineErrorCodes[errorKey],
          message: GameEngineErrorMessages[errorKey],
        });
      }
    });
  }

  private validateBoatPlacement(gameBoard: GameBoard, boatPlacement: GameBoat) {
    boatPlacement.emplacement.forEach((cell: Cell) =>
      this.validateCellIsInBounds(cell, gameBoard),
    );

    // Check if position are next to each other
    const xPositionsMap = boatPlacement.emplacement.map(
      ([xPosition]) => xPosition,
    );
    const xPositionsSet = [...new Set(xPositionsMap)];
    const yPositionsMap = boatPlacement.emplacement.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_xPosition, yPosition]) => yPosition,
    );
    const yPositionsSet = [...new Set(yPositionsMap)];

    if (xPositionsSet.length !== 1 && yPositionsSet.length !== 1) {
      throw new GameEngineError({
        code: GameEngineErrorCodes.INVALID_BOAT,
        message: GameEngineErrorMessages.INVALID_BOAT,
      });
    }

    if (xPositionsSet.length !== 1) {
      this.validateNumbersAreAdjacent(xPositionsMap);
    }

    if (yPositionsSet.length !== 1) {
      this.validateNumbersAreAdjacent(yPositionsMap);
    }

    return true;
  }

  public validateBoatsOfPlayers(
    authorisedFleet: AuthorisedFleet,
    gameBoard: GameBoard,
    playersFleet: GameBoat[][],
  ) {
    playersFleet.forEach((boatPlacements) => {
      this.validateFleetOfOnePlayer(authorisedFleet, gameBoard, boatPlacements);
    });

    return true;
  }

  public validateBoatWidth(boat: GameBoatSettings, storedBoat: Boat) {
    if (boat.bowCells.length !== storedBoat.width) {
      const errorKey = 'INVALID_BOAT';

      throw new GameEngineError({
        code: GameEngineErrorCodes[errorKey],
        message: GameEngineErrorMessages[errorKey],
      });
    }
  }

  public validateBowCellsAreAlignedWithDirection(
    boatDirection: BoatDirection,
    bowCells: Cell[],
  ) {
    if (bowCells.length === 1) {
      return;
    }

    let axisToCheck: number[];

    switch (boatDirection) {
      case BoatDirection.NORTH:
      case BoatDirection.SOUTH:
        axisToCheck = bowCells.map((cell) => cell.at(1));
        break;

      case BoatDirection.WEST:
      case BoatDirection.EAST:
        axisToCheck = bowCells.map((cell) => cell.at(0));
        break;
    }

    this.validateNumbersAreAdjacent(axisToCheck);
  }

  public validateCellHasNotBeenHit(
    arrayOfCells: Cell[],
    [xTargetedCell, yTargetedCell]: Cell,
  ) {
    const hasCellAlreadyBeenHit = arrayOfCells.some(
      ([xVisibleCell, yVisibleCell]) =>
        xVisibleCell === xTargetedCell && yVisibleCell === yTargetedCell,
    );

    if (hasCellAlreadyBeenHit) {
      throw new GameEngineError({
        code: GameEngineErrorCodes.CELL_ALREADY_HIT,
        message: GameEngineErrorMessages.CELL_ALREADY_HIT,
      });
    }

    return true;
  }

  public validateCellIsInBounds(
    [x, y]: Cell,
    [xBoardPositions, yBoardPositions]: GameBoard,
  ) {
    if (!xBoardPositions.includes(x) || !yBoardPositions.includes(y)) {
      const errorKey = 'OUT_OF_BOUNDS';

      throw new GameEngineError({
        code: GameEngineErrorCodes[errorKey],
        message: GameEngineErrorMessages[errorKey],
      });
    }
  }

  public validateFleetOfOnePlayer(
    authorisedFleet: AuthorisedFleet,
    gameBoard: GameBoard,
    playerFleet: GameBoat[],
  ) {
    playerFleet.forEach((boatPlacement) => {
      this.validateBoatPlacement(gameBoard, boatPlacement);
      this.validateAuthorisedFleet(authorisedFleet, playerFleet);
    });
  }

  public validateNumbersAreAdjacent(arrayOfNumbers: number[]) {
    arrayOfNumbers.sort((a, b) => a - b);

    arrayOfNumbers.forEach((axisPosition, index) => {
      if (index === 0 && axisPosition + 1 !== arrayOfNumbers[index + 1]) {
        throw new GameEngineError({
          code: GameEngineErrorCodes.INVALID_BOAT,
          message: GameEngineErrorMessages.INVALID_BOAT,
        });
      }

      const isNotFirstIndex = index > 0 && index < arrayOfNumbers.length - 1;

      if (
        (isNotFirstIndex && axisPosition + 1 !== arrayOfNumbers[index + 1]) ||
        (isNotFirstIndex && axisPosition - 1 !== arrayOfNumbers[index - 1])
      ) {
        throw new GameEngineError({
          code: GameEngineErrorCodes.INVALID_BOAT,
          message: GameEngineErrorMessages.INVALID_BOAT,
        });
      }
    });
  }

  public validatePlayers(players: GamePlayer[]) {
    if (players.length !== 2) {
      const code =
        players.length === 1
          ? GameEngineErrorCodes.MISSING_PLAYER
          : GameEngineErrorCodes.INVALID_NUMBER_OF_PLAYERS;

      throw new GameEngineError({
        code,
        message: `${GameEngineErrorMessages.INVALID_NUMBER_OF_PLAYERS}.${GameEngineErrorMessages.TWO_PLAYERS_REQUIRED}`,
      });
    }

    return true;
  }
}
