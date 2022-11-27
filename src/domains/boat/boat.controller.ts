import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateBoatDto } from '@dto/boat.dto';

import ApiError from '@shared/api-error';
import Boat from '@boat/boat.entity';
import BoatService from '@boat/boat.service';

const entityName = 'Boat';

@ApiTags(entityName)
@Controller('boat')
export default class BoatController {
  public constructor(private readonly boatService: BoatService) {}

  @Post()
  @ApiOperation({ summary: 'Insert a new boat' })
  @ApiResponse({
    description: 'Boat correctly inserted in database',
    status: 201,
  })
  public async insert(@Body() boat: CreateBoatDto): Promise<Boat> {
    try {
      return await this.boatService.insert(boat);
    } catch (error) {
      throw new BadRequestException(
        ApiError.InsertionFailed(entityName, error),
      );
    }
  }
}
