import GameInstanceService from '@engine/game-instance.service';

export default class GameEngine {
  private instances: GameInstanceService[];

  public destroy(instance: GameInstanceService): void {
    const index = this.instances.indexOf(instance);
    delete this.instances[index];
  }
}
