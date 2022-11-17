import { Test, TestingModule } from '@nestjs/testing';

import CharacterController from '@controllers/character.controller';
import CharacterModule from '@modules/character.module';

// FIXME
xdescribe('CharacterController', () => {
  let controller: CharacterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharacterController],
      imports: [CharacterModule],
    }).compile();

    controller = module.get<CharacterController>(CharacterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
