import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateBoatDto } from '@dto/boat.dto';
import { ErrorCodes } from '@interfaces/error.interface';

import ApiError from '@shared/api-error';
import Boat from '@entities/boat.entity';
import BoatService from '@services/boat.service';

@ApiTags('Boat')
@Controller('boat')
export default class BoatController {
  constructor(private readonly boatService: BoatService) {}

  @Post()
  @ApiOperation({ summary: 'Insert a new boat' })
  @ApiResponse({
    description: 'Boat correctly inserted in database',
    status: 201,
  })
  async insert(@Body() boat: CreateBoatDto): Promise<Boat> {
    try {
      return await this.boatService.insert(boat);
    } catch (error) {
      throw new ApiError({
        code: ErrorCodes.WRONG_PARAMS,
        detail: (error as { message: string }).message,
        instance: this.constructor.name,
        title: 'Fail to insert boat',
      });
    }
  }
}
