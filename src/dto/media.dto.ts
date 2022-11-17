import { IsNotEmpty, IsString } from 'class-validator';

import { CreateDtoInterface } from '@dto/dto.interface';

export class CreateMediaDto implements CreateDtoInterface {
  @IsNotEmpty()
  @IsString()
  public path!: string;
}
