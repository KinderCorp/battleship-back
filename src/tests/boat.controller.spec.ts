import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@modules/app.module';
import BoatController from '@controllers/boat.controller';
import BoatModule from '@modules/boat.module';

// npm run test:unit -- src/tests/boat.controller.spec.ts --watch

describe('BoatController', () => {
  let controller: BoatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, BoatModule],
    }).compile();

    controller = module.get<BoatController>(BoatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
