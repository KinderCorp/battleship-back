import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Game from '@entities/game.entity';
import GameController from '@controllers/game.controller';
import GameRepository from '@repositories/game.repository';
import GameService from '@services/game.service';

@Module({
  controllers: [GameController],
  imports: [TypeOrmModule.forFeature([Game])],
  providers: [GameService, GameRepository],
})
export default class GameModule {}
