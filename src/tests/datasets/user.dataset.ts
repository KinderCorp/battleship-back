import { faker } from '@faker-js/faker';

import { CreateUserDto } from '@dto/user.dto';

export const userToInsert: () => CreateUserDto = () => {
  return {
    email: faker.internet.email(),
    hasBeenConfirmed: false,
    password: faker.internet.password(),
    pseudo: faker.internet.userName(),
  };
};
