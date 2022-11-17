import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import BaseRepository from '@repositories/base.repository';
import Theme from '@entities/theme.entity';

@Injectable()
export default class ThemeRepository extends BaseRepository<Theme> {
  public constructor(
    @InjectRepository(Theme)
    private themeRepository: Repository<Theme>,
  ) {
    super(themeRepository);
  }
}
