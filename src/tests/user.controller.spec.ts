import { Test, TestingModule } from '@nestjs/testing';

import UserController from '@controllers/user.controller';
import { UserModule } from '@modules/user.module';
import UserService from '@services/user.service';

// FIXME
xdescribe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      imports: [UserModule],
      providers: [UserService],
    }).compile();

    userController = app.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });
});
