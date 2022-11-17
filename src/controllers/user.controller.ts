import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '@dto/user.dto';
import { UserService } from '@services/user.service';

import ApiError from '@shared/api-error';
import { ErrorCodes } from '@interfaces/error.interface/error.interface';
import User from '@entities/user.entity';

@ApiTags('User')
@Controller('/user')
export default class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    description: 'User correctly inserted in database',
    status: 201,
  })
  async insert(@Body() body: CreateUserDto): Promise<User> {
    try {
      return await this.userService.insert(body);
    } catch (error) {
      throw new ApiError({
        code: ErrorCodes.WRONG_PARAMS,
        detail: (error as { message: string }).message,
        instance: this.constructor.name,
        title: 'Fail to insert user',
      });
    }
  }
}