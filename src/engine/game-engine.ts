import GameInstanceService from '@engine/game-instance.service';

export default class GameEngine {
  private instances: GameInstanceService[] = [];

  public addInstance(instance: GameInstanceService): void {
    this.instances.push(instance);
  }

  public destroy(instance: GameInstanceService): void {
    const index = this.instances.indexOf(instance);
    delete this.instances[index];
  }

  public get(instanceIdToFind: string) {
    return this.instances.find((instance) => instance.id === instanceIdToFind);
  }

  public getInstanceByPlayerSocketId(playerSocketId: string) {
    return this.instances.find((instance) =>
      instance.players.find((player) => player.socketId === playerSocketId),
    );
  }

  public getInstanceLength() {
    return this.instances.length;
  }

  public getInstanceSockets(instance: GameInstanceService) {
    return instance.players.map((player) => player.socketId);
  }
}
