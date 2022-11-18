import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@modules/app.module';
import CharacterController from '@controllers/character.controller';
import CharacterModule from '@modules/character.module';

// npm run test:unit -- src/tests/character.controller.spec.ts --watch

describe('CharacterController', () => {
  let controller: CharacterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, CharacterModule],
    }).compile();

    controller = module.get<CharacterController>(CharacterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
