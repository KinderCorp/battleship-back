import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

import ApiError from '@shared/api-error';
import Character from '@character/character.entity';
import CharacterService from '@character/character.service';
import { CreateCharacterDto } from '@dto/character.dto';
import { InsertedEntity } from '@interfaces/shared.interface';

const entityName = 'Character';

@ApiTags(entityName)
@Controller('character')
export default class CharacterController {
  public constructor(private readonly characterService: CharacterService) {}

  @Post()
  @ApiOperation({ summary: 'Insert a new character' })
  @ApiResponse({
    description: 'Character correctly inserted in database',
    status: 201,
  })
  public async insert(
    @Body() character: CreateCharacterDto,
  ): Promise<InsertedEntity<Character>> {
    try {
      return await this.characterService.insert(character);
    } catch (error) {
      throw new BadRequestException(
        ApiError.InsertionFailed(entityName, error),
      );
    }
  }
}
