import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import ApiError from '@shared/api-error';
import { CreateUserDto } from '@dto/user.dto';
import User from '@user/user.entity';
import UserService from '@user/user.service';

const entityName = 'User';

@ApiTags(entityName)
@Controller('user')
export default class UserController {
  public constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiResponse({
    description: 'The user has been successfully retrieved',
    status: 200,
    type: User,
  })
  public async findById(
    @Param('id') id: User['id'],
  ): Promise<Omit<User, 'password'>> {
    try {
      return await this.userService.findById(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Insert a new user' })
  @ApiResponse({
    description: 'User correctly inserted in database',
    status: 201,
  })
  public async insert(@Body() user: CreateUserDto): Promise<User['id']> {
    try {
      const result = await this.userService.insert(user);
      return result.identifiers.at(0).id;
    } catch (error) {
      throw new BadRequestException(
        ApiError.InsertionFailed(entityName, error),
      );
    }
  }
}
