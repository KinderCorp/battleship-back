import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';

import ApiError from '@shared/api-error';
import { CreateMediaDto } from '@dto/media.dto';
import { ErrorCodes } from '@interfaces/error.interface/error.interface';
import Media from '@entities/media.entity';
import MediaService from '@services/media.service';

@ApiTags('Media')
@Controller('media')
export default class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @ApiOperation({ summary: 'Insert a new media' })
  @ApiResponse({
    description: 'Insert a new media into the media table',
    status: 201,
  })
  async insert(@Body() media: CreateMediaDto): Promise<Media> {
    try {
      return await this.mediaService.insert(media);
    } catch (error) {
      throw new ApiError({
        code: ErrorCodes.WRONG_PARAMS,
        detail: (error as { message: string }).message,
        instance: this.constructor.name,
        title: 'Fail to insert media',
      });
    }
  }
}
