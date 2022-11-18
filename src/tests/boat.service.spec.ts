import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@modules/app.module';
import BoatModule from '@modules/boat.module';
import BoatService from '@services/boat.service';

// npm run test:unit -- src/tests/boat.service.spec.ts --watch

describe('BoatService', () => {
  let service: BoatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, BoatModule],
    }).compile();

    service = module.get<BoatService>(BoatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
