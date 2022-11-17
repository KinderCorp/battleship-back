import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { CreateDtoInterface } from '@dto/dto.interface';

export class CreateWeaponDto implements CreateDtoInterface {
  @IsNotEmpty()
  @IsString()
  public name!: string;

  @IsNotEmpty()
  @IsNumber()
  public requiredLevel!: number;

  @IsNotEmpty()
  @IsNumber()
  public image!: number;

  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  public maxAmmunition: number;

  @IsNotEmpty()
  @IsNumber()
  @IsArray()
  public damage!: number[][];
}
