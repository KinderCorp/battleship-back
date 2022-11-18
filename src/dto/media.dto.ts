import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CreateDtoInterface } from '@dto/dto.interface';

export class CreateMediaDto implements CreateDtoInterface {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public path!: string;
}
