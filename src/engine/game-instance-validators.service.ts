import { Injectable } from '@nestjs/common';

import {
  Cell,
  GameBoard,
  GameBoat,
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
import GameEngineError from '@shared/game-engine-error';

@Injectable()
export default class GameInstanceValidatorsService {
  public validateActionCanBeExecuted(turn: Turn) {
    if (turn.actionRemaining < 1) {
      const errorKey = 'noAmmunitionRemaining';

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
        code: GameEngineErrorCodes.invalidBoardGameDimensions,
        message: GameEngineErrorMessages.invalidBoardGameDimensions,
      });
    }

    return true;
  }

  private validateBoatPlacement(gameBoard: GameBoard, boatPlacement: GameBoat) {
    const [xBoardPositions, yBoardPositions] = gameBoard;

    // Check if positions are out of bounds
    boatPlacement.emplacement.forEach(([xPosition, yPosition]) => {
      const isXPositionValid = xBoardPositions.includes(xPosition);
      const isYPositionValid = yBoardPositions.includes(yPosition);

      if (!isXPositionValid || !isYPositionValid) {
        throw new GameEngineError({
          code: GameEngineErrorCodes.outOfBounds,
          message: GameEngineErrorMessages.outOfBounds,
        });
      }
    });

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
        code: GameEngineErrorCodes.invalidBoat,
        message: GameEngineErrorMessages.invalidBoat,
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
    gameBoard: GameBoard,
    boatsPlacementOfPlayers: GameBoat[][],
  ) {
    boatsPlacementOfPlayers.forEach((boatPlacements) => {
      boatPlacements.forEach((boatPlacement) => {
        this.validateBoatPlacement(gameBoard, boatPlacement);
      });
    });

    return true;
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
        code: GameEngineErrorCodes.cellAlreadyHit,
        message: GameEngineErrorMessages.cellAlreadyHit,
      });
    }

    return true;
  }

  public validateNumbersAreAdjacent(arrayOfNumbers: number[]) {
    arrayOfNumbers.sort((a, b) => a - b);

    arrayOfNumbers.forEach((axisPosition, index) => {
      if (index === 0 && axisPosition + 1 !== arrayOfNumbers[index + 1]) {
        throw new GameEngineError({
          code: GameEngineErrorCodes.invalidBoat,
          message: GameEngineErrorMessages.invalidBoat,
        });
      }

      const isNotFirstIndex = index > 0 && index < arrayOfNumbers.length - 1;

      if (
        (isNotFirstIndex && axisPosition + 1 !== arrayOfNumbers[index + 1]) ||
        (isNotFirstIndex && axisPosition - 1 !== arrayOfNumbers[index - 1])
      ) {
        throw new GameEngineError({
          code: GameEngineErrorCodes.invalidBoat,
          message: GameEngineErrorMessages.invalidBoat,
        });
      }
    });
  }

  public validatePlayers(players: GamePlayer[]) {
    if (players.length !== 2) {
      const code =
        players.length === 1
          ? GameEngineErrorCodes.missingPlayer
          : GameEngineErrorCodes.invalidNumberOfPlayers;

      throw new GameEngineError({
        code,
        message: `${GameEngineErrorMessages.invalidNumberOfPlayers}.${GameEngineErrorMessages.twoPlayersRequired}`,
      });
    }

    return true;
  }
}
