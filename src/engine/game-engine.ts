import BoatStore from '@store/boat.store';
import { GameBoatConfiguration } from '@interfaces/engine.interface';
import GameInstanceService from '@engine/game-instance.service';

export default class GameEngine {
  private instances: GameInstanceService[] = [];

  public constructor(public boatStore: BoatStore) {}

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

  public getStoredBoatsForInstance(boats: GameBoatConfiguration[]) {
    const boatNames = boats.map((boat) => boat.name);
    const uniqueBoatNames = [...new Set(boatNames)];
    return uniqueBoatNames.map((boatName) =>
      this.boatStore.getByName(boatName),
    );
  }
}
