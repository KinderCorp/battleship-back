import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import AppController from '@app/app.controller';
import AppService from '@app/app.service';
import BoatController from '@boat/boat.controller';
import BoatRepository from '@boat/boat.repository';
import BoatService from '@boat/boat.service';
import CharacterController from '@character/character.controller';
import CharacterRepository from '@character/character.repository';
import CharacterService from '@character/character.service';
import { entities } from '@shared/entities.export';
import GameController from '@game/game.controller';
import GameRepository from '@game/game.repository';
import GameService from '@game/game.service';
import LevelController from '@level/level.controller';
import LevelRepository from '@level/level.repository';
import LevelService from '@level/level.service';
import MediaController from '@media/media.controller';
import MediaRepository from '@media/media.repository';
import MediaService from '@media/media.service';
import MediaWithThemeController from '@media-with-theme/media-with-theme.controller';
import MediaWithThemeRepository from '@media-with-theme/media-with-theme.repository';
import MediaWithThemeService from '@media-with-theme/media-with-theme.service';
import ThemeController from '@theme/theme.controller';
import ThemeRepository from '@theme/theme.repository';
import ThemeService from '@theme/theme.service';
import UserController from '@user/user.controller';
import UserRepository from '@user/user.repository';
import UserService from '@user/user.service';
import WeaponController from '@weapon/weapon.controller';
import WeaponRepository from '@weapon/weapon.repository';
import WeaponService from '@weapon/weapon.service';

@Module({
  controllers: [
    AppController,
    BoatController,
    CharacterController,
    GameController,
    MediaController,
    MediaWithThemeController,
    ThemeController,
    LevelController,
    UserController,
    WeaponController,
  ],
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [
    AppService,
    BoatRepository,
    BoatService,
    CharacterRepository,
    CharacterService,
    GameRepository,
    GameService,
    LevelRepository,
    LevelService,
    MediaRepository,
    MediaService,
    MediaWithThemeRepository,
    MediaWithThemeService,
    ThemeRepository,
    ThemeService,
    UserRepository,
    UserService,
    WeaponRepository,
    WeaponService,
  ],
})
export default class DomainModule {}
