import { CreateUserDto } from '@dto/user.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import User from '@entities/user.entity';
import UserRepository from '@repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: UserRepository,
  ) {}

  async insert(body: CreateUserDto): Promise<User> {
    return this.userRepository.insert(body);
  }
}
