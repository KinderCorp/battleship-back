import { Level } from '@interfaces/level.interface';

interface BasePlayer {
  id: string;
  isHost: boolean;
  pseudo: string;
  socketId: string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GuestPlayer extends BasePlayer {}

export interface LoggedPlayer extends GuestPlayer {
  level: Level;
  xp: number;
  character: string; // Join to get the path to the media
}
