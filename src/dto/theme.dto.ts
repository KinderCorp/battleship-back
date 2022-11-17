import { IsNotEmpty, IsString } from 'class-validator';

import { CreateDtoInterface } from '@dto/dto.interface';

export class CreateThemeDto implements CreateDtoInterface {
  @IsNotEmpty()
  @IsString()
  public name!: string;
}
