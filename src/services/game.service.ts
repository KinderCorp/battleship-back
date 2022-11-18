import { CreateGameDto } from '@dto/game.dto';
import Game from '@entities/game.entity';
import GameRepository from '@repositories/game.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

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