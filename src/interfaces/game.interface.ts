import { IdentifierInterface } from '@interfaces/entity.interface';
import User from '@user/user.entity';

export interface GameType extends IdentifierInterface {
  id: string;
  winner: User['id'];
  loser: User['id'];
  createdAt: Date;
}
