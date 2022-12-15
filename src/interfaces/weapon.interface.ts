import { Cell } from '@interfaces/engine.interface';

export type DamageMatrix = Cell[];

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
