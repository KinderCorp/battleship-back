import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { AppModule } from '@modules/app.module';
import { CreateWeaponDto } from '@dto/weapon.dto';
import { level1 } from '@datasets/level.dataset';
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

  it('should get a weapon by name', async () => {
    const weapon = await controller.findByName(WeaponName.BOMB);
    expect(weapon).toEqual({
      damageArea: [[0, 0]],
      id: 1,
      maxAmmunition: -1,
      name: 'bomb',
      requiredLevel: level1(),
    });
  });

  it('should not get a weapon by name', async () => {
    await expect(
      controller.findByName(faker.random.word() as WeaponName),
    ).rejects.toThrowError(BadRequestException);
  });
});
