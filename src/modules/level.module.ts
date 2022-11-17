import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Level from '@entities/level.entity';
import LevelController from '@controllers/level.controller';
import LevelRepository from '@repositories/level.repository';
import LevelService from '@services/level.service';

@Module({
  controllers: [LevelController],
  imports: [TypeOrmModule.forFeature([Level])],
  providers: [LevelService, LevelRepository],
})
export class LevelModule {}
