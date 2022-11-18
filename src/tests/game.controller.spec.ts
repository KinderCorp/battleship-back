import { Test, TestingModule } from '@nestjs/testing';

import ApiError from '@shared/api-error';
import { AppModule } from '@modules/app.module';
import { CreateGameDto } from '@dto/game.dto';
import GameController from '@controllers/game.controller';
import GameModule from '@modules/game.module';

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

  it('should insert a game', async () => {
    const gameToInsert: CreateGameDto = {
      loser: '2a322532-6fb2-4e72-818c-37b416ea016b',
      winner: 'd58de205-3989-4914-ab5b-6d7bd7489639',
    };

    const spy = jest.spyOn(controller, 'insert').mockImplementation();
    await controller.insert(gameToInsert);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(gameToInsert);
  });

  it('should not insert a game', async () => {
    const gameToInsert: CreateGameDto = {
      loser: 2 as unknown as string,
      winner: 2 as unknown as string,
    };

    await expect(controller.insert(gameToInsert)).rejects.toThrowError(
      ApiError,
    );
  });
});
