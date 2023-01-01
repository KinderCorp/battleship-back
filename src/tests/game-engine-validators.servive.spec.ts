import { Test, TestingModule } from '@nestjs/testing';

import {
  baseGameSettings,
  players1,
} from '@tests/datasets/game-instance.dataset';
import GameEngineValidatorsService from '@engine/game-engine-validators.service';
import GameInstanceService from '@engine/game-instance.service';
import GameInstanceValidatorsService from '@engine/game-instance-validators.service';
import { GameState } from '@interfaces/engine.interface';

describe('GameEngineValidatorsService', () => {
  let service: GameEngineValidatorsService;
  let gameInstance: GameInstanceService;
  let gameInstanceValidators: GameInstanceValidatorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameEngineValidatorsService, GameInstanceValidatorsService],
    }).compile();

    service = module.get<GameEngineValidatorsService>(
      GameEngineValidatorsService,
    );

    gameInstanceValidators = module.get<GameInstanceValidatorsService>(
      GameInstanceValidatorsService,
    );

    gameInstance = new GameInstanceService(
      baseGameSettings,
      gameInstanceValidators,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate session can be destroyed because player is host', () => {
    gameInstance.players = players1();

    expect(
      service.validateSessionCanBeDestroyed(gameInstance, players1().at(0)),
    ).toBeTruthy();
  });

  it('should validate session can be destroyed because game state allow it', () => {
    gameInstance.players = players1();
    gameInstance.gameState = GameState.PLAYING;

    expect(
      service.validateSessionCanBeDestroyed(gameInstance, players1().at(1)),
    ).toBeTruthy();
  });

  it('should not validate session can be destroyed because player is not host', () => {
    gameInstance.players = players1();

    expect(
      service.validateSessionCanBeDestroyed(gameInstance, players1().at(1)),
    ).toBeFalsy();
  });

  it('should not validate session can be destroyed because game state does not allow it', () => {
    gameInstance.players = players1();
    gameInstance.gameState = GameState.WAITING_TO_RIVAL;

    expect(
      service.validateSessionCanBeDestroyed(gameInstance, players1().at(1)),
    ).toBeFalsy();
  });
});
