import { IdentifierInterface } from '@interfaces/entity.interface';

export interface Level {
  media: string; // Join to get the path to the media
  rank: number;
}

export interface LevelType extends IdentifierInterface {
  id: number;
  rank: number;
  totalXp: number;
}
