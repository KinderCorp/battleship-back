import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@modules/app.module';
import UserController from '@controllers/user.controller';
import UserModule from '@modules/user.module';

// npm run test:unit -- src/tests/game.controller.spec.ts --watch

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UserModule],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });
});
