import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import BaseRepository from '@base/base.repository';
import Game from '@game/game.entity';

@Injectable()
export default class GameRepository extends BaseRepository<Game> {
  public constructor(
    @InjectRepository(Game)
    repository: Repository<Game>,
  ) {
    super(repository);
  }
}
