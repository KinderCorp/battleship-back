import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import {
  DamageMatrix,
  WeaponName,
  WeaponType,
} from '@interfaces/weapon.interface';
import Level from '@level/level.entity';

@Entity()
export default class Weapon implements WeaponType {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ enum: WeaponName, type: 'enum', unique: true })
  public name!: WeaponName;

  @ManyToOne(() => Level, (level: Level) => level.id)
  @JoinColumn()
  public requiredLevel!: number;

  @ApiProperty({
    default: -1,
    description:
      'Specifies the maximum amount of ammunition. Default to -1 for infinite ammunition',
  })
  @Column({ default: -1, type: 'integer' })
  public maxAmmunition: number;

  // TASK Update the weapon damage to be just an array of cell
  @Column('json')
  public damageArea: DamageMatrix;
}

// const regularDamages = {
//     b: [],// Bottom
//     bl: [],// Bottom left
//     br: [],// Bottom right
//     l: [],// Left
//     o: [0, 0],// Origin - where the player click/touch
//     r: [],// Right
//     t: [],// Top
//     tl: [],// Top left
//     tr: []// Top right
//   }

//   const nuclearDamages = {
//     b: [1, 0], // Bottom
//     bl: [1, -1], // Bottom left
//     br: [1, 1], // Bottom right
//     l: [0, -1], // Left
//     o: [0, 0], // Origin - where the player click/touch
//     r: [0, 1], // Right
//     t: [-1, 0], // Top
//     tl: [-1, -1], // Top left
//     tr: [-1, 1], // Top right
//   }
//   const tripleDamages = {
//     b: [1, 0], // Bottom
//     bl: [], // Bottom left
//     br: [], // Bottom right
//     l: [], // Left
//     o: [0, 0], // Origin - where the player click/touch
//     r: [], // Right
//     t: [-1, 0], // Top
//     tl: [], // Top left
//     tr: [], // Top right
//   }

// const droneDamages = {
//   b: [],// Bottom
//   bl: [],// Bottom left
//   br: [],// Bottom right
//   l: [],// Left
//   o: [],// Origin - where the player click/touch
//   r: [],// Right
//   t: [],// Top
//   tl: [],// Top left
//   tr: []// Top right
// }
