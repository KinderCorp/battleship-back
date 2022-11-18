import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@modules/app.module';
import MediaWithThemeController from '@controllers/media-with-theme.controller';
import MediaWithThemeModule from '@modules/media-with-theme.module';

// npm run test:unit -- src/tests/media-with-theme.controller.spec.ts --watch

describe('MediaWithThemeController', () => {
  let controller: MediaWithThemeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, MediaWithThemeModule],
    }).compile();

    controller = module.get<MediaWithThemeController>(MediaWithThemeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
