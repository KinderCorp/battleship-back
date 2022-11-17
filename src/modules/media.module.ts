import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Media from '@entities/media.entity';
import MediaController from '@controllers/media.controller';
import MediaRepository from '@repositories/media.repository';
import MediaService from '@services/media.service';

@Module({
  controllers: [MediaController],
  imports: [TypeOrmModule.forFeature([Media])],
  providers: [MediaService, MediaRepository],
})
export default class MediaModule {}
