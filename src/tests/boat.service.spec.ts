import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@modules/app.module';
import BoatService from '@boat/boat.service';

// npm run test:unit -- src/tests/boat.service.spec.ts --watch

describe('BoatService', () => {
  let service: BoatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<BoatService>(BoatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
