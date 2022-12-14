import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import BaseRepository from '@base/base.repository';
import User from '@user/user.entity';

@Injectable()
export default class UserRepository extends BaseRepository<User> {
  public constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super(userRepository);
  }
}
