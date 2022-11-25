import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CreateDtoInterface } from '@dto/dto.interface';
import { DamageMatrix } from '@interfaces/weapon.interface';

export class CreateWeaponDto implements CreateDtoInterface {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public name!: string;

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
      m: [],
      r: [],
      t: [],
      tl: [],
      tr: []
    }"`,
  })
  @IsNotEmpty()
  @IsObject()
  public damage!: DamageMatrix;
}
