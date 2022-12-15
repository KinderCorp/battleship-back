import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { DamageMatrix, WeaponName } from '@interfaces/weapon.interface';
import { CreateDtoInterface } from '@dto/dto.interface';

export class CreateWeaponDto implements CreateDtoInterface {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public name!: WeaponName;

  @ApiProperty({ description: 'Must match with a level Id' })
  @IsNotEmpty()
  @IsNumber()
  public requiredLevel!: number;

  @ApiProperty({
    default: -1,
    description:
      'Specifies the maximum amount of ammunition. Default to -1 for infinite ammunition',
  })
  @IsNotEmpty()
  @IsNumber()
  public maxAmmunition: number;

  @ApiProperty({
    description: `Must follow the following pattern:
    "{
      b: [],
      bl: [],
      br: [],
      l: [],
      o: [],
      r: [],
      t: [],
      tl: [],
      tr: []
    }"`,
  })
  @IsNotEmpty()
  @IsObject()
  public damageArea!: DamageMatrix;
}
