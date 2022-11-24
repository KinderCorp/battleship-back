import { Test, TestingModule } from '@nestjs/testing';

import ApiError from '@shared/api-error';
import { AppModule } from '@modules/app.module';
import { CreateUserDto } from '@dto/user.dto';
import UserController from '@user/user.controller';

// npm run test:unit -- src/tests/user.controller.spec.ts --watch

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = app.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should insert a user', async () => {
    const userToInsert: CreateUserDto = {
      email: 'email@example.com',
      hasBeenConfirmed: false,
      password: '1234',
      pseudo: 'pseudoAnonymous',
    };

    const spy = jest.spyOn(controller, 'insert').mockImplementation();
    await controller.insert(userToInsert);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(userToInsert);
  });

  it('should not insert a user', async () => {
    await expect(controller.insert({} as CreateUserDto)).rejects.toThrowError(
      ApiError,
    );
  });
});
