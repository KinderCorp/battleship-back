import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CreateDtoInterface } from '@dto/dto.interface';

export class CreateGameDto implements CreateDtoInterface {
  @ApiProperty({ description: 'Must match with an user Id' })
  @IsNotEmpty()
  @IsUUID()
  public winner!: string;

  @ApiProperty({ description: 'Must match with an user Id' })
  @IsNotEmpty()
  @IsUUID()
  public loser!: string;
}
