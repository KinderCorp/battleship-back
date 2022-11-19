import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateGameDto } from '@dto/game.dto';
import Game from '@game/game.entity';
import GameRepository from '@game/game.repository';

@Injectable()
export default class GameService {
  public constructor(
    @InjectRepository(Game)
    private gameRepository: GameRepository,
  ) {}

  public async insert(game: CreateGameDto): Promise<Game> {
    return this.gameRepository.insert(game);
  }
}
