import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CreateWeaponDto } from '@dto/weapon.dto';
import { ErrorCodes } from '@interfaces/error.interface';

import ApiError from '@shared/api-error';
import Weapon from '@weapon/weapon.entity';
import WeaponService from '@weapon/weapon.service';

@ApiTags('Weapon')
@Controller('weapon')
export default class WeaponController {
  public constructor(private readonly weaponService: WeaponService) {}

  @Post()
  @ApiOperation({ summary: 'Insert a new weapon' })
  @ApiResponse({
    description: 'Weapon correctly inserted in database',
    status: 201,
  })
  public async insert(@Body() weapon: CreateWeaponDto): Promise<Weapon> {
    try {
      return await this.weaponService.insert(weapon);
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
