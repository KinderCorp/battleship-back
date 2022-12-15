import { Cell } from '@interfaces/engine.interface';

export interface DamageMatrix {
  b: Cell | []; // Bottom
  bl: Cell | []; // Bottom left
  br: Cell | []; // Bottom right
  l: Cell | []; // Left
  o: Cell | []; // Origin – Where the player click/touch to shoot
  r: Cell | []; // Right
  t: Cell | []; // Top
  tl: Cell | []; // Top left
  tr: Cell | []; // Top right
}

export enum WeaponName {
  BOMB = 'bomb',
  DRONE = 'drone',
  NUCLEAR = 'nuclear',
  TRIPLE = 'triple',
}

export interface WeaponType {
  id: number;
  name: WeaponName;
  maxAmmunition: number;
  damageArea: DamageMatrix;
}
