import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateThemeDto } from '@dto/theme.dto';
import Theme from '@entities/theme.entity';
import ThemeRepository from '@repositories/theme.repository';

@Injectable()
export default class ThemeService {
  public constructor(
    @InjectRepository(Theme)
    private themeRepository: ThemeRepository,
  ) {}

  public async insert(theme: CreateThemeDto): Promise<Theme> {
    return this.themeRepository.insert(theme);
  }
}
