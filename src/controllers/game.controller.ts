import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';

import ApiError from '@shared/api-error';
import { CreateGameDto } from '@dto/game.dto';
import { ErrorCodes } from '@interfaces/error.interface/error.interface';
import Game from '@entities/game.entity';
import GameService from '@services/game.service';

@ApiTags('Game')
@Controller('game')
export default class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @ApiOperation({ summary: 'Insert a new game' })
  @ApiResponse({
    description: 'Game correctly inserted in database',
    status: 201,
  })
  async insert(@Body() game: CreateGameDto): Promise<Game> {
    try {
      return await this.gameService.insert(game);
    } catch (error) {
      throw new ApiError({
        code: ErrorCodes.WRONG_PARAMS,
        detail: (error as { message: string }).message,
        instance: this.constructor.name,
        title: 'Fail to insert game',
      });
    }
  }
}
