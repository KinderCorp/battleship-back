import { Level } from '@interfaces/level.interface';

interface BasePlayer {
  id: string;
  pseudo: string;
  socketId?: string; // TASK It's not optional - Update tests
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GuestPlayer extends BasePlayer {}

export interface LoggedPlayer extends GuestPlayer {
  level: Level;
  xp: number;
  character: string; // Join to get the path to the media
}
