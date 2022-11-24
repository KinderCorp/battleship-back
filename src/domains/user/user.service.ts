import * as argon2 from 'argon2';
import { CreateUserDto } from '@dto/user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import User from '@user/user.entity';
import UserRepository from '@user/user.repository';

@Injectable()
export default class UserService {
  public constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
  ) {}

  public async insert(user: CreateUserDto): Promise<User> {
    user.password = await this.setPassword(user.password);

    return this.userRepository.insert(user);
  }

  // TASK Move this method into an appropriate file
  private async setPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }
}
