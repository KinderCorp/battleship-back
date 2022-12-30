import Character from '@character/character.entity';
import { IdentifierInterface } from '@interfaces/entity.interface';
import Level from '@level/level.entity';

export interface UserType extends IdentifierInterface {
  id: string;
  email: string;
  password: string;
  hasBeenConfirmed: boolean;
  level: Level['id'] | Level;
  xp: number;
  character: Character['id'] | Character;
  createdAt: Date;
}
