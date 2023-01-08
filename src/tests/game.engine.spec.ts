import { Test, TestingModule } from '@nestjs/testing';

import {
  exampleGamePreset,
  storedFrigate,
  storedRaft,
} from '@datasets/game-instance.dataset';
import { AppModule } from '@modules/app.module';
import { BoatName } from '@interfaces/boat.interface';
import GameEngine from '@engine/game-engine';

// npm run test:unit -- src/tests/game.engine.spec.ts --watch

describe('GameEngine', () => {
  let service: GameEngine;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<GameEngine>(GameEngine);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should build authorised fleet from game preset', () => {
    const spyBoatStore = jest
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .spyOn((service as any).boatStore, 'getByName')
      .mockImplementation((boatName) => {
        return boatName === BoatName.RAFT ? storedRaft() : storedFrigate();
      });

    const authorisedFleet = service.buildAuthorisedFleetFromGamePreset(
      exampleGamePreset(),
    );

    expect(spyBoatStore).toHaveBeenCalledTimes(2);

    expect(authorisedFleet).toEqual([
      {
        authorisedNumber: 4,
        boat: {
          beam: 1,
          lengthOverall: 1,
          name: 'raft',
          src: '/images/boats/boat-1x1.png',
        },
      },
      {
        authorisedNumber: 3,
        boat: {
          beam: 1,
          lengthOverall: 3,
          name: 'frigate',
          src: '/images/boats/boat-3x1.png',
        },
      },
    ]);
  });
});
