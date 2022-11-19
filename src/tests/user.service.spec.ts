import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@modules/app.module';
import UserService from '@user/user.service';

// npm run test:unit -- src/tests/user.service.spec.ts --watch

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
