import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import {
  USER_PSEUDO_MAX_LENGTH,
  USER_PSEUDO_MIN_LENGTH,
  VARCHAR_COMMON_LENGTH,
} from '@shared/entity.const';
import { CreateDtoInterface } from '@dto/dto.interface';

export class CreateUserDto implements CreateDtoInterface {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(USER_PSEUDO_MIN_LENGTH, USER_PSEUDO_MAX_LENGTH)
  public pseudo!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(VARCHAR_COMMON_LENGTH)
  public email!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public password!: string;

  @ApiProperty({ default: false, required: false })
  @IsOptional()
  @IsBoolean()
  public hasBeenConfirmed?: boolean;

  @ApiProperty({ default: 1, required: false })
  @IsOptional()
  @IsNumber()
  public level?: number;

  @ApiProperty({ default: 1, required: false })
  @IsOptional()
  @IsNumber()
  public character?: number;
}
