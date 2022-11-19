import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import BaseRepository from '@base/base.repository';
import MediaWithTheme from '@media-with-theme/media-with-theme.entity';

@Injectable()
export default class MediaWithThemeRepository extends BaseRepository<MediaWithTheme> {
  public constructor(
    @InjectRepository(MediaWithTheme)
    private mediaWithThemeRepository: Repository<MediaWithTheme>,
  ) {
    super(mediaWithThemeRepository);
  }
}
