import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateMediaDto } from '@dto/media.dto';
import Media from '@media/media.entity';
import MediaRepository from '@media/media.repository';

@Injectable()
export default class MediaService {
  public constructor(
    @InjectRepository(Media)
    private mediaRepository: MediaRepository,
  ) {}

  public async insert(media: CreateMediaDto): Promise<Media> {
    return this.mediaRepository.insert(media);
  }
}
