import { Test, TestingModule } from '@nestjs/testing';
import BoatController from '@controllers/boat.controller';

xdescribe('BoatController', () => {
  let controller: BoatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoatController],
    }).compile();

    controller = module.get<BoatController>(BoatController);
  });

  xit('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
