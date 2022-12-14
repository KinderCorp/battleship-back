import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { AppModule } from '@modules/app.module';
import BoatController from '@boat/boat.controller';
import { CreateBoatDto } from '@dto/boat.dto';

// npm run test:unit -- src/tests/boat.controller.spec.ts --watch

describe('BoatController', () => {
  let controller: BoatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<BoatController>(BoatController);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should insert a boat', async () => {
    const boatToInsert: CreateBoatDto = {
      length: 1,
      name: 'Kayak',
      width: 1,
    };

    const spy = jest.spyOn(controller, 'insert').mockImplementation();
    await controller.insert(boatToInsert);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(boatToInsert);
  });

  it('should not insert a boat', async () => {
    await expect(controller.insert({} as CreateBoatDto)).rejects.toThrowError(
      BadRequestException,
    );
  });
});
