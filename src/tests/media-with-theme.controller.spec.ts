import { Test, TestingModule } from '@nestjs/testing';

import ApiError from '@shared/api-error';
import { AppModule } from '@modules/app.module';
import { CreateMediaWithThemeDto } from '@dto/media-with-theme.dto';
import MediaWithThemeController from '@media-with-theme/media-with-theme.controller';

// npm run test:unit -- src/tests/media-with-theme.controller.spec.ts --watch

describe('MediaWithThemeController', () => {
  let controller: MediaWithThemeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<MediaWithThemeController>(MediaWithThemeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should insert a mediaWithTheme', async () => {
    const mediaWithThemeToInsert: CreateMediaWithThemeDto = {
      media: 1,
      theme: 1,
    };

    const spy = jest.spyOn(controller, 'insert').mockImplementation();
    await controller.insert(mediaWithThemeToInsert);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(mediaWithThemeToInsert);
  });

  it('should not insert a mediaWithTheme', async () => {
    const mediaWithThemeToInsert: CreateMediaWithThemeDto = {
      media: '2' as unknown as number,
      theme: '2' as unknown as number,
    };

    await expect(
      controller.insert(mediaWithThemeToInsert),
    ).rejects.toThrowError(ApiError);
  });
});
