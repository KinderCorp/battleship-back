import { IsNotEmpty, IsNumber } from 'class-validator';

import { CreateDtoInterface } from '@dto/dto.interface';

export class CreateCharacterDto implements CreateDtoInterface {
  @IsNotEmpty()
  @IsNumber()
  public media!: number;

  @IsNotEmpty()
  @IsNumber()
  public requiredLevel!: number;
}
