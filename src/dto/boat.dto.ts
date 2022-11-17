import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { CreateDtoInterface } from '@dto/dto.interface';

export class CreateBoatDto implements CreateDtoInterface {
  @IsNotEmpty()
  @IsString()
  public name!: string;

  @IsNotEmpty()
  @IsArray()
  public imageIds!: number[];

  @IsNotEmpty()
  @IsNumber()
  public width!: number;

  @IsNotEmpty()
  @IsNumber()
  public length!: number;
}
