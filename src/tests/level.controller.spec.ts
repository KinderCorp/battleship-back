import { Test, TestingModule } from '@nestjs/testing';

import LevelController from '@controllers/level.controller';
import { LevelModule } from '@modules/level.module';
import LevelService from '@services/level.service';

// FIXME
xdescribe('LevelController', () => {
  let controller: LevelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LevelController],
      imports: [LevelModule],
      providers: [LevelService],
    }).compile();

    controller = module.get<LevelController>(LevelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
