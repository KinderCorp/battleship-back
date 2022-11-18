import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateLevelDto } from '@dto/level.dto';
import { ErrorCodes } from '@interfaces/error.interface';

import ApiError from '@shared/api-error';
import Level from '@entities/level.entity';
import LevelService from '@services/level.service';

@ApiTags('Level')
@Controller('level')
export default class LevelController {
  public constructor(private readonly levelService: LevelService) {}

  @Post()
  @ApiOperation({ summary: 'Insert a new level' })
  @ApiResponse({
    description: 'Level correctly inserted in database',
    status: 201,
  })
  public async insert(@Body() level: CreateLevelDto): Promise<Level> {
    try {
      return await this.levelService.insert(level);
    } catch (error) {
      throw new ApiError({
        code: ErrorCodes.WRONG_PARAMS,
        detail: (error as { message: string }).message,
        instance: this.constructor.name,
        title: 'Fail to insert level',
      });
    }
  }
}
