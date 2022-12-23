import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

import ApiError from '@shared/api-error';
import { CreateThemeDto } from '@dto/theme.dto';
import { InsertedEntity } from '@interfaces/shared.interface';
import Theme from '@theme/theme.entity';
import ThemeService from '@theme/theme.service';

const entityName = 'Theme';

@ApiTags(entityName)
@Controller('theme')
export default class ThemeController {
  public constructor(private readonly themeService: ThemeService) {}

  @Post()
  @ApiOperation({ summary: 'Insert a new theme' })
  @ApiResponse({
    description: 'Theme correctly inserted in database',
    status: 201,
  })
  public async insert(
    @Body() theme: CreateThemeDto,
  ): Promise<InsertedEntity<Theme>> {
    try {
      return await this.themeService.insert(theme);
    } catch (error) {
      throw new BadRequestException(
        ApiError.InsertionFailed(entityName, error),
      );
    }
  }
}
