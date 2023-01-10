import * as argon2 from 'argon2';
import { omit } from 'radash';

import { CreateUserDto } from '@dto/user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InsertedEntity } from '@interfaces/shared.interface';

import User from '@user/user.entity';
import UserRepository from '@user/user.repository';

@Injectable()
export default class UserService {
  public constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
  ) {}

  public async findById(id: User['id']) {
    const user = await this.userRepository.findOneById(id);

    if (!user) {
      return user;
    }

    return omit(user, ['password']);
  }

  public async insert(user: CreateUserDto): Promise<InsertedEntity<User>> {
    user.password = await this.setPassword(user.password);

    // TASK Get theses ids from database
    user.level = 1;
    user.character = 1;

    return this.userRepository.insert(user);
  }

  // TASK Move this method into an appropriate file
  private async setPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }
}
