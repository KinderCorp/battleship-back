import { IdentifierInterface } from '@interfaces/entity.interface';
import Level from '@level/level.entity';

export interface CharacterType extends IdentifierInterface {
  id: number;
  requiredLevel: Level['id'] | Level;
}
