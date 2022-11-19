import { Test, TestingModule } from '@nestjs/testing';

import ApiError from '@shared/api-error';
import { AppModule } from '@modules/app.module';
import { CreateLevelDto } from '@dto/level.dto';
import LevelController from '@level/level.controller';

// npm run test:unit -- src/tests/level.controller.spec.ts --watch

describe('LevelController', () => {
  let controller: LevelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<LevelController>(LevelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should insert a level', async () => {
    const levelToInsert: CreateLevelDto = {
      media: 1,
      rank: 1,
      totalXp: 100,
    };

    const spy = jest.spyOn(controller, 'insert').mockImplementation();
    await controller.insert(levelToInsert);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(levelToInsert);
  });

  it('should not insert a level', async () => {
    await expect(controller.insert({} as CreateLevelDto)).rejects.toThrowError(
      ApiError,
    );
  });
});
