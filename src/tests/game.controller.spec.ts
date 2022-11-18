import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@modules/app.module';
import GameController from '@controllers/game.controller';
import { GameModule } from '@modules/game.module';

// npm run test:unit -- src/tests/game.controller.spec.ts --watch

describe('GameController', () => {
  let controller: GameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, GameModule],
    }).compile();

    controller = module.get<GameController>(GameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
