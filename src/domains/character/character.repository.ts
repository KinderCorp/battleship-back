import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import BaseRepository from '@base/base.repository';
import Character from '@character/character.entity';

@Injectable()
export default class CharacterRepository extends BaseRepository<Character> {
  public constructor(
    @InjectRepository(Character)
    repository: Repository<Character>,
  ) {
    super(repository);
  }
}
