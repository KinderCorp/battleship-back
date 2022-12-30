import AppService from '@app/app.service';
import Boat from '@boat/boat.entity';
import BoatRepository from '@boat/boat.repository';
import BoatService from '@boat/boat.service';
import Character from '@character/character.entity';
import CharacterRepository from '@character/character.repository';
import CharacterService from '@character/character.service';
import Game from '@game/game.entity';
import GameRepository from '@game/game.repository';
import GameService from '@game/game.service';
import Level from '@level/level.entity';
import LevelRepository from '@level/level.repository';
import LevelService from '@level/level.service';
import Theme from '@theme/theme.entity';
import ThemeRepository from '@theme/theme.repository';
import ThemeService from '@theme/theme.service';
import User from '@user/user.entity';
import UserRepository from '@user/user.repository';
import UserService from '@user/user.service';
import Weapon from '@weapon/weapon.entity';
import WeaponRepository from '@weapon/weapon.repository';
import WeaponService from '@weapon/weapon.service';

export const entities = [Boat, Character, Game, Level, Theme, User, Weapon];

export const repositories = [
  BoatRepository,
  CharacterRepository,
  GameRepository,
  LevelRepository,
  ThemeRepository,
  UserRepository,
  WeaponRepository,
];

export const services = [
  AppService,
  BoatService,
  CharacterService,
  GameService,
  LevelService,
  ThemeService,
  UserService,
  WeaponService,
];
