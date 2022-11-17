import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

import {
  USER_PSEUDO_MAX_LENGTH,
  USER_PSEUDO_MIN_LENGTH,
  VARCHAR_COMMON_LENGTH,
} from '@shared/entity.const';
import { CreateDtoInterface } from '@dto/dto.interface';

export class CreateUserDto implements CreateDtoInterface {
  @IsNotEmpty()
  @IsString()
  @Length(USER_PSEUDO_MIN_LENGTH, USER_PSEUDO_MAX_LENGTH)
  public pseudo!: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(VARCHAR_COMMON_LENGTH)
  public email!: string;

  @IsNotEmpty()
  @IsString()
  public password!: string;

  @IsOptional()
  @IsBoolean()
  hasBeenConfirmed!: boolean;
}
