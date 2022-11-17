import { Logger, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiSuccessInterceptor } from '@interceptors/api-success/api-success.interceptor';
import AppController from '@controllers/app.controller';
import { AppService } from '@services/app.service';
import Boat from '@entities/boat.entity';
import Character from '@entities/character.entity';
import { CharacterModule } from '@modules/character.module';
import Game from '@entities/game.entity';
import Level from '@entities/level.entity';
import { LevelModule } from '@modules/level.module';
import { LoggerInterceptor } from '@interceptors/logger/logger.interceptor';
import Media from '@entities/media.entity';
import { MediaModule } from '@modules/media.module';
import MediaWithTheme from '@entities/media-with-theme.entity';
import Theme from '@entities/theme.entity';
import User from '@entities/user.entity';
import { UserModule } from '@modules/user.module';
import Weapon from '@entities/weapon.entity';

const entities = [
  Boat,
  Character,
  Game,
  Level,
  Media,
  MediaWithTheme,
  Theme,
  User,
  Weapon,
];

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env', '.env.production'],
    }),
    TypeOrmModule.forRoot({
      database: process.env.POSTGRESQL_DATABASE,
      entities: entities,
      host: process.env.POSTGRESQL_HOST,
      password: process.env.POSTGRESQL_PASSWORD,
      port: Number(process.env.POSTGRESQL_PORT),
      synchronize: process.env.POSTGRESQL_HOST === 'localhost',
      type: 'postgres',
      username: process.env.POSTGRESQL_USER,
    }),
    UserModule,
    CharacterModule,
    LevelModule,
    MediaModule,
  ],
  providers: [
    AppService,
    Logger,
    { provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ApiSuccessInterceptor },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
