import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@modules/app.module';
import GameModule from '@modules/game.module';
import GameService from '@services/game.service';

// npm run test:unit -- src/tests/game.service.spec.ts --watch

describe('GameService', () => {
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, GameModule],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
