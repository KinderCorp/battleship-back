import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';

import ApiError from '@shared/api-error';
import Character from '@entities/character.entity';
import CharacterService from '@services/character.service';
import { CreateCharacterDto } from '@dto/character.dto';
import { ErrorCodes } from '@interfaces/error.interface';

@ApiTags('Character')
@Controller('character')
export default class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  @ApiOperation({ summary: 'Insert a new character' })
  @ApiResponse({
    description: 'Character correctly inserted in database',
    status: 201,
  })
  async insert(@Body() character: CreateCharacterDto): Promise<Character> {
    try {
      return await this.characterService.insert(character);
    } catch (error) {
      throw new ApiError({
        code: ErrorCodes.WRONG_PARAMS,
        detail: (error as { message: string }).message,
        instance: this.constructor.name,
        title: 'Fail to insert character',
      });
    }
  }
}
