import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@modules/app.module';
import MediaController from '@controllers/media.controller';
import MediaModule from '@modules/media.module';

// npm run test:unit -- src/tests/media.controller.spec.ts --watch

describe('MediaController', () => {
  let controller: MediaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, MediaModule],
    }).compile();

    controller = module.get<MediaController>(MediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
