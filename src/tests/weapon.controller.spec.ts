import { Test, TestingModule } from '@nestjs/testing';

import ApiError from '@shared/api-error';
import { AppModule } from '@modules/app.module';
import { CreateWeaponDto } from '@dto/weapon.dto';
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

  it('should insert a weapon', async () => {
    const weaponToInsert: CreateWeaponDto = {
      damage: {
        b: [],
        bl: [],
        br: [],
        l: [],
        m: [],
        r: [],
        t: [],
        tl: [],
        tr: [],
      },
      maxAmmunition: -1,
      mediaWithTheme: 1,
      name: 'basic weapon',
      requiredLevel: 1,
    };

    const spy = jest.spyOn(controller, 'insert').mockImplementation();
    await controller.insert(weaponToInsert);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(weaponToInsert);
  });

  it('should not insert a weapon', async () => {
    await expect(controller.insert({} as CreateWeaponDto)).rejects.toThrowError(
      ApiError,
    );
  });
});