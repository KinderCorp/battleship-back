import GameInstanceService from '@engine/game-instance.service';

export default class GameEngine {
  private instances: GameInstanceService[];

  public addInstance(instance: GameInstanceService): void {
    this.instances.push(instance);
    console.log('instances', this.instances);
  }

  public destroy(instance: GameInstanceService): void {
    const index = this.instances.indexOf(instance);
    delete this.instances[index];
  }
}
