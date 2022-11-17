import { Test, TestingModule } from '@nestjs/testing';

import MediaWithThemeController from '@controllers/media-with-theme.controller';

xdescribe('MediaWithThemeController', () => {
  let controller: MediaWithThemeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaWithThemeController],
    }).compile();

    controller = module.get<MediaWithThemeController>(MediaWithThemeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
