import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';

import ApiError from '@shared/api-error';
import { CreateMediaDto } from '@dto/media.dto';
import { ErrorCodes } from '@interfaces/error.interface';
import Media from '@media/media.entity';
import MediaService from '@media/media.service';

@ApiTags('Media')
@Controller('media')
export default class MediaController {
  public constructor(private readonly mediaService: MediaService) {}

  @Post()
  @ApiOperation({ summary: 'Insert a new media' })
  @ApiResponse({
    description: 'Media correctly inserted in database',
    status: 201,
  })
  public async insert(@Body() media: CreateMediaDto): Promise<Media> {
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
