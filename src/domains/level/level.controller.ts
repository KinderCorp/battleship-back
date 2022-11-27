import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

import ApiError from '@shared/api-error';
import { CreateLevelDto } from '@dto/level.dto';
import Level from '@level/level.entity';
import LevelService from '@level/level.service';

const entityName = 'Level';

@ApiTags(entityName)
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
        ApiError.InsertionFailed(entityName, error),
      );
    }
  }
}
