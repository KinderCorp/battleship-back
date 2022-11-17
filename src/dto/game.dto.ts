import { IsNotEmpty, IsUUID } from 'class-validator';

import { CreateDtoInterface } from '@dto/dto.interface';

export class CreateGameDto implements CreateDtoInterface {
  @IsNotEmpty()
  @IsUUID()
  public winner!: string;
}
