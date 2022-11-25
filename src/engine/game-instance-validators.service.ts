import { Injectable } from '@nestjs/common';

import {
  BoatPlacement,
  GameBoard,
  GamePlayer,
} from '@interfaces/engine.interface';
import {
  GameEngineErrorCodes,
  GameEngineErrorMessages,
} from '@interfaces/error.interface';
import GameEngineError from '@shared/game-engine-error';

@Injectable()
export default class GameInstanceValidatorsService {
  public validateBoatPlacement(
    gameBoard: GameBoard,
    boatPlacement: BoatPlacement,
  ) {
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

  public validateNumbersAreAdjacent(arrayOfNumbers: number[]) {
    arrayOfNumbers.sort((a, b) => a - b);

    arrayOfNumbers.forEach((yPosition, index) => {
      if (index === 0 && yPosition + 1 !== arrayOfNumbers[index + 1]) {
        throw new GameEngineError({
          code: GameEngineErrorCodes.invalidBoat,
          message: GameEngineErrorMessages.invalidBoat,
        });
      }

      const isNotFirstIndex = index > 0 && index < arrayOfNumbers.length - 1;

      if (
        (isNotFirstIndex && yPosition + 1 !== arrayOfNumbers[index + 1]) ||
        (isNotFirstIndex && yPosition - 1 !== arrayOfNumbers[index - 1])
      ) {
        throw new GameEngineError({
          code: GameEngineErrorCodes.invalidBoat,
          message: GameEngineErrorMessages.invalidBoat,
        });
      }
    });
  }

  public validatePlayerBoats(
    gameBoard: GameBoard,
    boatsPlacement: BoatPlacement[],
  ) {
    boatsPlacement.forEach((boatPlacement) => {
      this.validateBoatPlacement(gameBoard, boatPlacement);
    });
    return true;
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
