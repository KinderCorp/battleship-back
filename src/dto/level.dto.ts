import { IsNotEmpty, IsNumber } from 'class-validator';

import { CreateDtoInterface } from '@dto/dto.interface';

export class CreateLevelDto implements CreateDtoInterface {
  @IsNotEmpty()
  @IsNumber()
  public image!: number;

  @IsNotEmpty()
  @IsNumber()
  public rank!: number;

  @IsNotEmpty()
  @IsNumber()
  public totalXp!: number;
}
