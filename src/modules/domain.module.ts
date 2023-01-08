import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { entities, repositories, services } from '@shared/entities.export';
import AppController from '@app/app.controller';
import BoatController from '@boat/boat.controller';
import CharacterController from '@character/character.controller';
import GameController from '@game/game.controller';
import LevelController from '@level/level.controller';
import ThemeController from '@theme/theme.controller';
import UserController from '@user/user.controller';
import WeaponController from '@weapon/weapon.controller';

@Module({
  controllers: [
    AppController,
    BoatController,
    CharacterController,
    GameController,
    ThemeController,
    LevelController,
    UserController,
    WeaponController,
  ],
  exports: [...repositories, ...services],
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...repositories, ...services],
})
export default class DomainModule {}
