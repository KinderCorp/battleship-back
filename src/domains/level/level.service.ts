import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateLevelDto } from '@dto/level.dto';
import { InsertedEntity } from '@interfaces/shared.interface';
import Level from '@level/level.entity';
import LevelRepository from '@level/level.repository';

@Injectable()
export default class LevelService {
  public constructor(
    @InjectRepository(Level)
    private levelRepository: LevelRepository,
  ) {}

  public async insert(level: CreateLevelDto): Promise<InsertedEntity<Level>> {
    return this.levelRepository.insert(level);
  }
}
