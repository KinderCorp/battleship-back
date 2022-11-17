import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Theme from '@entities/theme.entity';
import ThemeController from '@controllers/theme.controller';
import ThemeRepository from '@repositories/theme.repository';
import ThemeService from '@services/theme.service';

@Module({
  controllers: [ThemeController],
  imports: [TypeOrmModule.forFeature([Theme])],
  providers: [ThemeService, ThemeRepository],
})
export default class ThemeModule {}
