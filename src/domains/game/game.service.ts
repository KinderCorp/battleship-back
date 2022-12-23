import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import ApiError from '@shared/api-error';
import { CreateGameDto } from '@dto/game.dto';
import Game from '@game/game.entity';
import GameRepository from '@game/game.repository';
import { InsertedEntity } from '@interfaces/shared.interface';

@Injectable()
export default class GameService {
  public constructor(
    @InjectRepository(Game)
    private gameRepository: GameRepository,
  ) {}

  public async insert(game: CreateGameDto): Promise<InsertedEntity<Game>> {
    if (!game.winner && !game.loser) {
      throw new BadRequestException(
        ApiError.ValidationError('Please enter at least a winner or a loser'),
      );
    }

    return this.gameRepository.insert(game);
  }
}
