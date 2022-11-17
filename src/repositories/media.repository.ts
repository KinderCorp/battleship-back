import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import BaseRepository from '@repositories/base.repository';
import Media from '@entities/media.entity';

@Injectable()
export default class MediaRepository extends BaseRepository<Media> {
  public constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {
    super(mediaRepository);
  }
}
