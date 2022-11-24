import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { AppModule } from '@modules/app.module';
import CharacterController from '@character/character.controller';
import { CreateCharacterDto } from '@dto/character.dto';

// npm run test:unit -- src/tests/character.controller.spec.ts --watch

describe('CharacterController', () => {
  let controller: CharacterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<CharacterController>(CharacterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should insert a character', async () => {
    const characterToInsert: CreateCharacterDto = {
      media: 0,
      requiredLevel: 0,
    };

    const spy = jest.spyOn(controller, 'insert').mockImplementation();
    await controller.insert(characterToInsert);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(characterToInsert);
  });

  it('should not insert a character', async () => {
    const characterToInsert: CreateCharacterDto = {
      media: '0' as unknown as number,
      requiredLevel: '0' as unknown as number,
    };

    await expect(controller.insert(characterToInsert)).rejects.toThrowError(
      BadRequestException,
    );
  });
});
