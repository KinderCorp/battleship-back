import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@modules/app.module';
import LevelModule from '@modules/level.module';
import LevelService from '@services/level.service';

// npm run test:unit -- src/tests/level.service.spec.ts --watch

describe('LevelService', () => {
  let service: LevelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, LevelModule],
    }).compile();

    service = module.get<LevelService>(LevelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
