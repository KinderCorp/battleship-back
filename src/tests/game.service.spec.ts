import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@modules/app.module';
import GameService from '@game/game.service';

// npm run test:unit -- src/tests/game.service.spec.ts --watch

describe('GameService', () => {
  let service: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
