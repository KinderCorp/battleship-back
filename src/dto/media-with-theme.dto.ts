import { IsNotEmpty, IsNumber } from 'class-validator';

import { CreateDtoInterface } from '@dto/dto.interface';

export class CreateMediaWithThemeDto implements CreateDtoInterface {
  @IsNotEmpty()
  @IsNumber()
  public image!: number;

  @IsNotEmpty()
  @IsNumber()
  public theme!: number;
}
