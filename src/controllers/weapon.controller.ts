import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateWeaponDto } from '@dto/weapon.dto';
import { ErrorCodes } from '@interfaces/error.interface';

import ApiError from '@shared/api-error';
import Weapon from '@entities/weapon.entity';
import WeaponService from '@services/weapon.service';

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
      throw new ApiError({
        code: ErrorCodes.WRONG_PARAMS,
        detail: (error as { message: string }).message,
        instance: this.constructor.name,
        title: 'Fail to insert weapon',
      });
    }
  }
}
