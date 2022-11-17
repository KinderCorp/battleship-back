import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import MediaWithTheme from '@entities/media-with-theme.entity';
import MediaWithThemeController from '@controllers/media-with-theme.controller';
import MediaWithThemeRepository from '@repositories/media-with-theme.repository';
import MediaWithThemeService from '@services/media-with-theme.service';

@Module({
  controllers: [MediaWithThemeController],
  imports: [TypeOrmModule.forFeature([MediaWithTheme])],
  providers: [MediaWithThemeService, MediaWithThemeRepository],
})
export default class MediaWithThemeModule {}
