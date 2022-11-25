import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

import ApiError from '@shared/api-error';
import { CreateWeaponDto } from '@dto/weapon.dto';
import Weapon from '@weapon/weapon.entity';
import WeaponService from '@weapon/weapon.service';

const entityName = 'Weapon';

@ApiTags(entityName)
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
      throw new BadRequestException(ApiError.InsertionFailed(entityName));
    }
  }
}
