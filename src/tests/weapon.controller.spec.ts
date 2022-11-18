import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@modules/app.module';
import WeaponController from '@controllers/weapon.controller';
import WeaponModule from '@modules/weapon.module';

// npm run test:unit -- src/tests/weapon.controller.spec.ts --watch

describe('WeaponController', () => {
  let controller: WeaponController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, WeaponModule],
    }).compile();

    controller = module.get<WeaponController>(WeaponController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
