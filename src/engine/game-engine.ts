import { Socket } from 'socket.io';

import GameInstanceService from '@engine/game-instance.service';
import { GameState } from '@interfaces/engine.interface';

export default class GameEngine {
  private instances: GameInstanceService[] = [];

  public addInstance(instance: GameInstanceService): void {
    this.instances.push(instance);
  }

  public destroy(instance: GameInstanceService): void {
    const index = this.instances.indexOf(instance);
    this.instances.splice(index, 1);
  }

  public get(instanceIdToFind: string) {
    return this.instances.find((instance) => instance.id === instanceIdToFind);
  }

  public getInstanceByPlayerSocketId(playerSocketId: string) {
    if (!this.instances.length) {
      return;
    }

    return this.instances.find((instance) =>
      instance.players.find((player) => player.socketId === playerSocketId),
    );
  }

  public getInstanceSockets(instance: GameInstanceService) {
    return instance.players.map((player) => player.socketId);
  }

  // TEST to add
  // TASK To move in a file name game-engine-validators.service.ts
  public validateSessionCanBeDestroyed(
    instance: GameInstanceService,
    socket: Socket,
  ): boolean {
    const player = instance.players.find(
      (player) => player.socketId === socket.id,
    );

    return (
      player.isHost ||
      ![GameState.WAITING_TO_RIVAL, GameState.WAITING_TO_START].includes(
        instance.gameState,
      )
    );
  }
}
