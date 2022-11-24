import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateLevelDto } from '@dto/level.dto';
import { ErrorCodes } from '@interfaces/error.interface';

import ApiError from '@shared/api-error';
import Level from '@level/level.entity';
import LevelService from '@level/level.service';

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
      throw new BadRequestException(
        new ApiError({
          code: ErrorCodes.INSERTION_FAILED,
          message: 'Fail to insert boat.',
        }),
      );
    }
  }
}
