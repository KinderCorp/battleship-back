import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

import ApiError from '@shared/api-error';
import { CreateGameDto } from '@dto/game.dto';
import Game from '@game/game.entity';
import GameService from '@game/game.service';

const entityName = 'Game';

@ApiTags(entityName)
@Controller('game')
export default class GameController {
  public constructor(private readonly gameService: GameService) {}

  @Post()
  @ApiOperation({ summary: 'Insert a new game' })
  @ApiResponse({
    description: 'Game correctly inserted in database',
    status: 201,
  })
  public async insert(@Body() game: CreateGameDto): Promise<Game> {
    try {
      return await this.gameService.insert(game);
    } catch (error) {
      throw new BadRequestException(
        ApiError.InsertionFailed(entityName, error),
      );
    }
  }
}
