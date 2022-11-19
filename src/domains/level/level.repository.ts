import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import BaseRepository from '@base/base.repository';
import Level from '@level/level.entity';

@Injectable()
export default class LevelRepository extends BaseRepository<Level> {
  public constructor(
    @InjectRepository(Level) private levelRepository: Repository<Level>,
  ) {
    super(levelRepository);
  }
}
