import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@modules/app.module';
import MediaModule from '@modules/media.module';
import MediaService from '@services/media.service';

// npm run test:unit -- src/tests/media.service.spec.ts --watch

describe('MediaService', () => {
  let service: MediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, MediaModule],
    }).compile();

    service = module.get<MediaService>(MediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
