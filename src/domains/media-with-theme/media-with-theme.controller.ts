import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';

import ApiError from '@shared/api-error';
import { CreateMediaWithThemeDto } from '@dto/media-with-theme.dto';
import { ErrorCodes } from '@interfaces/error.interface';
import MediaWithTheme from '@media-with-theme/media-with-theme.entity';
import MediaWithThemeService from '@media-with-theme/media-with-theme.service';

@ApiTags('Media with theme')
@Controller('media-with-theme')
export default class MediaWithThemeController {
  public constructor(
    private readonly mediaWithThemeService: MediaWithThemeService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Insert a new media with theme' })
  @ApiResponse({
    description: 'Media with theme correctly inserted in database',
    status: 201,
  })
  public async insert(
    @Body() mediaWithTheme: CreateMediaWithThemeDto,
  ): Promise<MediaWithTheme> {
    try {
      return await this.mediaWithThemeService.insert(mediaWithTheme);
    } catch (error) {
      throw new ApiError({
        code: ErrorCodes.WRONG_PARAMS,
        detail: (error as { message: string }).message,
        instance: this.constructor.name,
        title: 'Fail to insert user',
      });
    }
  }
}
