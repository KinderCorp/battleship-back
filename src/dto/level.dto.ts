import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CreateDtoInterface } from '@dto/dto.interface';

export class CreateLevelDto implements CreateDtoInterface {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public rank!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public totalXp!: number;
}
