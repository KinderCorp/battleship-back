import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CreateDtoInterface } from '@dto/dto.interface';

export class CreateMediaWithThemeDto implements CreateDtoInterface {
  @ApiProperty({ description: 'Must match with a media Id' })
  @IsNotEmpty()
  @IsNumber()
  public media!: number;

  @ApiProperty({ description: 'Must match with a theme Id' })
  @IsNotEmpty()
  @IsNumber()
  public theme!: number;
}
