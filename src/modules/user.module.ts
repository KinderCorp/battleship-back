import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserService from '@services/user.service';

import User from '@entities/user.entity';
import UserController from '@controllers/user.controller';
import UserRepository from '@repositories/user.repository';

@Module({
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserRepository, UserService],
})
export default class UserModule {}
