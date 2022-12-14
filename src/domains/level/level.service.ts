import { CreateLevelDto } from '@dto/level.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import Level from '@level/level.entity';
import LevelRepository from '@level/level.repository';

@Injectable()
export default class LevelService {
  public constructor(
    @InjectRepository(Level)
    private levelRepository: LevelRepository,
  ) {}

  public async insert(level: CreateLevelDto): Promise<Level> {
    return this.levelRepository.insert(level);
  }
}
