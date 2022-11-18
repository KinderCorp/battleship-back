import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@modules/app.module';
import MediaWithThemeModule from '@modules/media-with-theme.module';
import MediaWithThemeService from '@services/media-with-theme.service';

// npm run test:unit -- src/tests/media-with-theme.service.spec.ts --watch

describe('MediaWithThemeService', () => {
  let service: MediaWithThemeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, MediaWithThemeModule],
    }).compile();

    service = module.get<MediaWithThemeService>(MediaWithThemeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
