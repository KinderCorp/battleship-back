import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@modules/app.module';
import ThemeController from '@controllers/theme.controller';
import ThemeModule from '@modules/theme.module';

// npm run test:unit -- src/tests/theme.controller.spec.ts --watch

describe('ThemeController', () => {
  let controller: ThemeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, ThemeModule],
    }).compile();

    controller = module.get<ThemeController>(ThemeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
