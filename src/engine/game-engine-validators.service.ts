import { Injectable } from '@nestjs/common';

import { GamePlayer, GameState } from '@interfaces/engine.interface';
import GameInstanceService from '@engine/game-instance.service';

@Injectable()
export default class GameEngineValidatorsService {
  /**
   * Checks if socket session and instance can be destroyed
   * The session can be destroyed when :
   * The host player leave
   * The player isn't the host and the game state is before placing boats
   * No players left in the instance
   * @param instance
   * @param disconnectedPlayer
   */
  public validateSessionCanBeDestroyed(
    instance: GameInstanceService,
    disconnectedPlayer: GamePlayer,
  ): boolean {
    return (
      disconnectedPlayer.isHost ||
      ![GameState.WAITING_TO_RIVAL, GameState.WAITING_TO_START].includes(
        instance.gameState,
      ) ||
      !instance.players.length
    );
  }
}
