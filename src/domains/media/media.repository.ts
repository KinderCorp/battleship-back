import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import BaseRepository from '@base/base.repository';
import Media from '@media/media.entity';

@Injectable()
export default class MediaRepository extends BaseRepository<Media> {
  public constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
  ) {
    super(mediaRepository);
  }
}
