import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import ApiError from '@shared/api-error';
import { CreateWeaponDto } from '@dto/weapon.dto';
import Weapon from '@weapon/weapon.entity';
import WeaponService from '@weapon/weapon.service';

const entityName = 'Weapon';

@ApiTags(entityName)
@Controller('weapon')
export default class WeaponController {
  public constructor(private readonly weaponService: WeaponService) {}

  @Get()
  @ApiOperation({ summary: 'Get all weapons' })
  @ApiResponse({
    description: 'The weapons has been successfully retrieved',
    status: 200,
  })
  public async findAll() {
    try {
      return await this.weaponService.findAll();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(':name')
  @ApiOperation({ summary: 'Get a weapon by the given name' })
  @ApiResponse({
    description: 'The weapon has been successfully retrieved',
    status: 200,
  })
  public async findByName(
    @Param('name') name: Weapon['name'],
    loadRelations = false,
  ) {
    try {
      return await this.weaponService.findByName(name, loadRelations);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Insert a new weapon' })
  @ApiResponse({
    description: 'Weapon correctly inserted in database',
    status: 201,
  })
  public async insert(@Body() weapon: CreateWeaponDto) {
    try {
      return await this.weaponService.insert(weapon);
    } catch (error) {
      throw new BadRequestException(
        ApiError.InsertionFailed(entityName, error),
      );
    }
  }
}
