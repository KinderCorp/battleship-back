import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import BaseRepository from '@base/base.repository';
import Theme from '@theme/theme.entity';

@Injectable()
export default class ThemeRepository extends BaseRepository<Theme> {
  public constructor(
    @InjectRepository(Theme)
    private themeRepository: Repository<Theme>,
  ) {
    super(themeRepository);
  }
}
