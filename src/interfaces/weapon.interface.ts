import { Cell } from '@interfaces/engine.interface';
import { IdentifierInterface } from '@interfaces/entity.interface';
import Level from '@level/level.entity';

export type DamageMatrix = Cell[];

export enum WeaponName {
  BOMB = 'bomb',
  DRONE = 'drone',
  NUCLEAR = 'nuclear',
  TRIPLE = 'triple',
}

export interface WeaponType extends IdentifierInterface {
  id: number;
  name: WeaponName;
  maxAmmunition: number;
  damageArea: DamageMatrix;
  requiredLevel?: Level['id'] | Level;
}
