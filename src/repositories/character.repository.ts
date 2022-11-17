import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import BaseRepository from '@repositories/base.repository';
import Character from '@entities/character.entity';

@Injectable()
export default class CharacterRepository extends BaseRepository<Character> {
  public constructor(
    @InjectRepository(Character)
    private characterRepository: Repository<Character>,
  ) {
    super(characterRepository);
  }
}
