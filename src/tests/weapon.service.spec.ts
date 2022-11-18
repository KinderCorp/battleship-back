import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@modules/app.module';
import WeaponModule from '@modules/weapon.module';
import WeaponService from '@services/weapon.service';

// npm run test:unit -- src/tests/weapon.service.spec.ts --watch

describe('WeaponService', () => {
  let service: WeaponService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, WeaponModule],
    }).compile();

    service = module.get<WeaponService>(WeaponService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
