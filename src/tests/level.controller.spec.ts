import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@modules/app.module';
import LevelController from '@controllers/level.controller';
import LevelModule from '@modules/level.module';

// npm run test:unit -- src/tests/level.controller.spec.ts --watch

describe('LevelController', () => {
  let controller: LevelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, LevelModule],
    }).compile();

    controller = module.get<LevelController>(LevelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
