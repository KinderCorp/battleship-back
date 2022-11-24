import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateGameDto } from '@dto/game.dto';
import Game from '@entities/game.entity';
import GameRepository from '@repositories/game.repository';

@Injectable()
export default class GameService {
  public constructor(
    @InjectRepository(Game)
    private gameRepository: GameRepository,
  ) {}

  public async insert(game: CreateGameDto): Promise<Game> {
    if (!game.winner && !game.loser) {
      throw new BadRequestException(
        'A game can only be inserted if there was a  user logged into the game.',
      );
    }

    return this.gameRepository.insert(game);
  }
}
