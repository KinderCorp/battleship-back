import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { AppModule } from '@modules/app.module';
import { CreateWeaponDto } from '@dto/weapon.dto';
import WeaponController from '@weapon/weapon.controller';
import { WeaponName } from '@interfaces/weapon.interface';

// npm run test:unit -- src/tests/weapon.controller.spec.ts --watch

describe('WeaponController', () => {
  let controller: WeaponController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<WeaponController>(WeaponController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should insert a weapon', async () => {
    const weaponToInsert: CreateWeaponDto = {
      damageArea: [],
      maxAmmunition: -1,
      name: WeaponName.BOMB,
      requiredLevel: 1,
    };

    const spy = jest.spyOn(controller, 'insert').mockImplementation();
    await controller.insert(weaponToInsert);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(weaponToInsert);
  });

  it('should not insert a weapon', async () => {
    await expect(controller.insert({} as CreateWeaponDto)).rejects.toThrowError(
      BadRequestException,
    );
  });
});
