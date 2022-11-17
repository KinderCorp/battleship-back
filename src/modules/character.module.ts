import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Character from '@entities/character.entity';
import CharacterController from '@controllers/character.controller';
import CharacterRepository from '@repositories/character.repository';
import CharacterService from '@services/character.service';

@Module({
  controllers: [CharacterController],
  imports: [TypeOrmModule.forFeature([Character])],
  providers: [CharacterService, CharacterRepository],
})
export default class CharacterModule {}
