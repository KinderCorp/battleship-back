import { Test, TestingModule } from '@nestjs/testing';

import ApiError from '@shared/api-error';
import { AppModule } from '@modules/app.module';
import { CreateThemeDto } from '@dto/theme.dto';
import ThemeController from '@theme/theme.controller';

// npm run test:unit -- src/tests/theme.controller.spec.ts --watch

describe('ThemeController', () => {
  let controller: ThemeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = module.get<ThemeController>(ThemeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should insert a theme', async () => {
    const themeToInsert: CreateThemeDto = {
      name: 'Prehistoric',
    };

    const spy = jest.spyOn(controller, 'insert').mockImplementation();
    await controller.insert(themeToInsert);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(themeToInsert);
  });

  it('should not insert a theme', async () => {
    await expect(controller.insert({} as CreateThemeDto)).rejects.toThrowError(
      ApiError,
    );
  });
});
