import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateMediaWithThemeDto } from '@dto/media-with-theme.dto';
import MediaWithTheme from '@entities/media-with-theme.entity';
import MediaWithThemeRepository from '@repositories/media-with-theme.repository';

@Injectable()
export default class MediaWithThemeService {
  public constructor(
    @InjectRepository(MediaWithTheme)
    private mediaWithThemeRepository: MediaWithThemeRepository,
  ) {}

  public async insert(
    mediaWithTheme: CreateMediaWithThemeDto,
  ): Promise<MediaWithTheme> {
    return this.mediaWithThemeRepository.insert(mediaWithTheme);
  }
}
