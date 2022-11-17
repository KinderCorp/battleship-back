import { Test, TestingModule } from '@nestjs/testing';

import MediaController from '@controllers/media.controller';
import MediaModule from '@modules/media.module';
import MediaService from '@services/media.service';

// FIXME
xdescribe('MediaController', () => {
  let controller: MediaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaController],
      imports: [MediaModule],
      providers: [MediaService],
    }).compile();

    controller = module.get<MediaController>(MediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
