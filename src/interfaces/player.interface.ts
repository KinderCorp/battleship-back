import { Level } from '@interfaces/level.interface';

export interface GuestPlayer {
  id: string;
  pseudo: string;
}

export interface LoggedPlayer extends GuestPlayer {
  level: Level;
  xp: number;
  character: string; // Join to get the path to the media
}
