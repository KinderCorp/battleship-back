import { Test, TestingModule } from '@nestjs/testing';

import { GameMode, GameState } from '@interfaces/engine.interface';
import { gameConfiguration1 } from '@tests/datasets/game-instance.dataset';
import GameInstanceService from '@engine/game-instance.service';
import GameInstanceValidatorsService from '@engine/game-instance-validators.service';

const baseGameConfiguration = {
  gameMode: GameMode.OneVersusOne,
  state: GameState.waitingToStart,
};

// npm run test:unit -- src/tests/game-instance.service.spec.ts --watch

describe('GameInstanceService', () => {
  let service: GameInstanceService;
  let gameInstanceValidatorsService: GameInstanceValidatorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameInstanceValidatorsService],
    }).compile();

    gameInstanceValidatorsService = module.get<GameInstanceValidatorsService>(
      GameInstanceValidatorsService,
    );

    service = new GameInstanceService(
      baseGameConfiguration,
      gameInstanceValidatorsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should start the game', () => {
    service.startGame();

    expect(service.gameState).toEqual(GameState.playing);
  });

  it('should start placing boats', () => {
    jest
      .spyOn(gameInstanceValidatorsService, 'validatePlayers')
      .mockReturnValue(true);

    service.startPlacingBoats(gameConfiguration1);

    expect(service.gameState).toEqual(GameState.placingBoats);
  });

  it('should end the game', () => {
    service.endGame();

    expect(service.gameState).toEqual(GameState.finished);
  });
});
