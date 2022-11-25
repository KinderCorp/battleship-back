import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CreateDtoInterface } from '@dto/dto.interface';

export class CreateBoatDto implements CreateDtoInterface {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public name!: string;

  @ApiProperty({ default: 1, required: false })
  @IsOptional()
  @IsNumber()
  public width: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public length!: number;
}
