import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@modules/app.module';
import CharacterService from '@character/character.service';
import DomainModule from '@modules/domain.module';

// npm run test:unit -- src/tests/character.service.spec.ts --watch

describe('CharacterService', () => {
  let service: CharacterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DomainModule],
    }).compile();

    service = module.get<CharacterService>(CharacterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
