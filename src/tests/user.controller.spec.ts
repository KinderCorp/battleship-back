import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { AppModule } from '@modules/app.module';
import { CreateUserDto } from '@dto/user.dto';
import User from '@user/user.entity';
import UserController from '@user/user.controller';
import { userToInsert } from '@datasets/user.dataset';

// npm run test:unit -- src/tests/user.controller.spec.ts --watch

describe('UserController', () => {
  let controller: UserController;
  let insertedUserId: User['id'];

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    controller = app.get<UserController>(UserController);

    insertedUserId = await controller.insert(userToInsert());
    expect(insertedUserId).toBeDefined();
  });

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
    const spy = jest.spyOn(controller, 'insert').mockImplementation();
    const rawInsertedUser = userToInsert();

    await controller.insert(rawInsertedUser);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(rawInsertedUser);
  });

  it('should not insert a user', async () => {
    await expect(controller.insert({} as CreateUserDto)).rejects.toThrowError(
      BadRequestException,
    );
  });

  it('should get user by Id', async () => {
    const user = await controller.findById(insertedUserId);

    [
      'id',
      'pseudo',
      'email',
      'hasBeenConfirmed',
      'level',
      'xp',
      'character',
      'createdAt',
    ].forEach((property) => {
      expect(user).toHaveProperty(property);
    });

    expect(user).not.toHaveProperty('password');
  });

  it('should not get user by Id', async () => {
    expect(
      await controller.findById('11111111-1111-1111-1111-111111111111'),
    ).toBeNull();
  });
});
