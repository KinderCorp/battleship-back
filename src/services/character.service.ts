import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import Character from '@entities/character.entity';
import CharacterRepository from '@repositories/character.repository';
import { CreateCharacterDto } from '@dto/character.dto';

@Injectable()
export default class CharacterService {
  public constructor(
    @InjectRepository(Character)
    private characterRepository: CharacterRepository,
  ) {}

  public insert(character: CreateCharacterDto) {
    return this.characterRepository.insert(character);
  }
}
