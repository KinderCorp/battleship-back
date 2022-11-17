import { Test, TestingModule } from '@nestjs/testing';

import UserController from '@controllers/user.controller';
import { UserModule } from '@modules/user.module';
import { UserService } from '@services/user.service';

xdescribe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  xit('should be defined', () => {
    expect(userController).toBeDefined();
  });
});
