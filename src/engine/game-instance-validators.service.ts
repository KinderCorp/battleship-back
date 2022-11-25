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
    boatPlacement.emplacement.forEach(([xPosition, yPosition]) => {
      const [xBoardPositions, yBoardPositions] = gameBoard;

      const isXPositionValid = xBoardPositions.includes(xPosition);
      const isYPositionValid = yBoardPositions.includes(yPosition);

      if (!isXPositionValid || !isYPositionValid) {
        throw new GameEngineError({
          code: GameEngineErrorCodes.outOfBounds,
          message: GameEngineErrorMessages.outOfBounds,
        });
      }
    });
    return true;
  }

  // TASK Check that xPosition || yPosition is the same on every positions

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
