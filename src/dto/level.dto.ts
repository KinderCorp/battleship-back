import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CreateDtoInterface } from '@dto/dto.interface';

export class CreateLevelDto implements CreateDtoInterface {
  @ApiProperty({ description: 'Must match with a media Id' })
  @IsNotEmpty()
  @IsNumber()
  public media!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public rank!: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  public totalXp!: number;
}
