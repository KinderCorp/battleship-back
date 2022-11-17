import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateMediaDto } from '@dto/media.dto';
import Media from '@entities/media.entity';
import MediaRepository from '@repositories/media.repository';

@Injectable()
export default class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: MediaRepository,
  ) {}

  async insert(media: CreateMediaDto): Promise<Media> {
    return this.mediaRepository.insert(media);
  }
}
