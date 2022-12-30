import { Inject } from '@nestjs/common';

import BoatStore from '@store/boat.store';
import { GameBoatSettings } from '@interfaces/engine.interface';
import GameEngineError from '@shared/game-engine-error';
import { GameEngineErrorCodes } from '@interfaces/error.interface';
import GameInstanceService from '@engine/game-instance.service';
import User from '@user/user.entity';
import UserService from '@user/user.service';
import { WeaponName } from '@interfaces/weapon.interface';
import WeaponService from '@weapon/weapon.service';

export default class GameEngine {
  private instances: GameInstanceService[] = [];

  public constructor(@Inject('BOAT_STORE') private boatStore: BoatStore,
    private userService: UserService,
    private weaponService: WeaponService,
  ) {}

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

  public getStoredBoatsForInstance(boats: GameBoatSettings[]) {
    const boatNames = boats.map((boat) => boat.name);
    const uniqueBoatNames = [...new Set(boatNames)];
    return uniqueBoatNames.map((boatName) =>
      this.boatStore.getByName(boatName),
    );
  }

  public async getWeaponsFromUserId(userId: User['id']) {
    const user = await this.userService.findById(userId);

    if (!user) {
      const bomb = await this.weaponService.findByName(WeaponName.BOMB);
      return [bomb];
    }

    // TASK Implement query for authenticated user
    throw new GameEngineError({
      code: GameEngineErrorCodes.NOT_IMPLEMENTED,
      message: GameEngineErrorCodes.NOT_IMPLEMENTED,
    });
  }
}
