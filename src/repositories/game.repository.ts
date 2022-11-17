import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import BaseRepository from '@repositories/base.repository';
import Game from '@entities/game.entity';

@Injectable()
export default class GameRepository extends BaseRepository<Game> {
  public constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {
    super(gameRepository);
  }
}
