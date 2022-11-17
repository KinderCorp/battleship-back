import * as argon2 from 'argon2';
import { CreateUserDto } from '@dto/user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import User from '@entities/user.entity';
import UserRepository from '@repositories/user.repository';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
  ) {}

  async insert(user: CreateUserDto): Promise<User> {
    user.password = await this.setPassword(user.password);

    return this.userRepository.insert(user);
  }

  // TASK Move this method into an appropriate file
  private async setPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }
}
