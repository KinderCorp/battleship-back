import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';

import ApiError from '@shared/api-error';
import { CreateThemeDto } from '@dto/theme.dto';
import { ErrorCodes } from '@interfaces/error.interface/error.interface';
import Theme from '@entities/theme.entity';
import ThemeService from '@services/theme.service';

@ApiTags('Theme')
@Controller('theme')
export default class ThemeController {
  constructor(private readonly themeService: ThemeService) {}

  @Post()
  @ApiOperation({ summary: 'Insert a new theme' })
  @ApiResponse({
    description: 'Insert a new theme into the theme table',
    status: 201,
  })
  async insert(@Body() theme: CreateThemeDto): Promise<Theme> {
    try {
      return await this.themeService.insert(theme);
    } catch (error) {
      throw new ApiError({
        code: ErrorCodes.WRONG_PARAMS,
        detail: (error as { message: string }).message,
        instance: this.constructor.name,
        title: 'Fail to insert theme',
      });
    }
  }
}
