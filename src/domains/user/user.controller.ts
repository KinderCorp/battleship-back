import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

import ApiError from '@shared/api-error';
import { CreateUserDto } from '@dto/user.dto';
import User from '@user/user.entity';
import UserService from '@user/user.service';

const entityName = 'User';

@ApiTags(entityName)
@Controller('user')
export default class UserController {
  public constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Insert a new user' })
  @ApiResponse({
    description: 'User correctly inserted in database',
    status: 201,
  })
  public async insert(@Body() user: CreateUserDto): Promise<User> {
    try {
      return await this.userService.insert(user);
    } catch (error) {
      throw new BadRequestException(ApiError.InsertionFailed(entityName));
    }
  }
}
