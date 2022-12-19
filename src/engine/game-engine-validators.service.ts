import GameInstanceService from '@engine/game-instance.service';
import { GameState } from '@interfaces/engine.interface';
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export default class GameEngineValidatorsService {
  public validateSessionCanBeDestroyed(
    instance: GameInstanceService,
    socket: Socket,
  ): boolean {
    const player = instance.getPlayerByAnyId(socket.id);

    return (
      player.isHost ||
      ![GameState.WAITING_TO_RIVAL, GameState.WAITING_TO_START].includes(
        instance.gameState,
      )
    );
  }
}
