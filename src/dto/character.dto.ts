import { IsNotEmpty, IsNumber } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { CreateDtoInterface } from '@dto/dto.interface';

export class CreateCharacterDto implements CreateDtoInterface {
  @ApiProperty({ description: 'Must match with a level Id' })
  @IsNotEmpty()
  @IsNumber()
  public requiredLevel!: number;
}
