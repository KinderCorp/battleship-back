import { Test, TestingModule } from '@nestjs/testing';
import WeaponController from '@controllers/weapon.controller';

xdescribe('WeaponController', () => {
  let controller: WeaponController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeaponController],
    }).compile();

    controller = module.get<WeaponController>(WeaponController);
  });

  xit('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
