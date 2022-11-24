import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@modules/app.module';
import ThemeService from '@theme/theme.service';

// npm run test:unit -- src/tests/theme.service.spec.ts --watch

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<ThemeService>(ThemeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
