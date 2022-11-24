import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '@modules/app.module';
import CharacterModule from '@modules/character.module';
import CharacterService from '@services/character.service';

// npm run test:unit -- src/tests/character.service.spec.ts --watch

describe('CharacterService', () => {
  let service: CharacterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, CharacterModule],
    }).compile();

    service = module.get<CharacterService>(CharacterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
