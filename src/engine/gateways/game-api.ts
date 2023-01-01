import { Injectable } from '@nestjs/common';

import GameEngineError from '@shared/game-engine-error';
import { GameEngineErrorCodes } from '@interfaces/error.interface';
import User from '@user/user.entity';
import UserService from '@user/user.service';
import { WeaponName } from '@interfaces/weapon.interface';
import WeaponService from '@weapon/weapon.service';

@Injectable()
export default class GameApi {
  public constructor(
    private userService: UserService,
    private weaponService: WeaponService,
  ) {}

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
