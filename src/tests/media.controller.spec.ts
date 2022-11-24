import { Test, TestingModule } from '@nestjs/testing';

import ApiError from '@shared/api-error';
import { AppModule } from '@modules/app.module';
import { CreateMediaDto } from '@dto/media.dto';
import MediaController from '@controllers/media.controller';
import MediaModule from '@modules/media.module';

// npm run test:unit -- src/tests/media.controller.spec.ts --watch

describe('MediaController', () => {
  let controller: MediaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, MediaModule],
    }).compile();

    controller = module.get<MediaController>(MediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should insert a media', async () => {
    const mediaToInsert: CreateMediaDto = {
      path: '/src/assets/media',
    };

    const spy = jest.spyOn(controller, 'insert').mockImplementation();
    await controller.insert(mediaToInsert);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(mediaToInsert);
  });

  it('should not insert a media', async () => {
    await expect(controller.insert({} as CreateMediaDto)).rejects.toThrowError(
      ApiError,
    );
  });
});
