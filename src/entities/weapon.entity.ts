import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Level from '@entities/level.entity';
import Media from '@entities/media.entity';

type DamageMatrix = {
  b: []; // Bottom
  bl: []; // Bottom left
  br: []; // Bottom right
  l: []; // Left
  m: []; // Middle
  r: []; // Right
  t: []; // Top
  tl: []; // Top left
  tr: []; // Top right
};

@Entity()
export default class Weapon {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  name!: string;

  @ManyToOne(() => Level, (level: Level) => level.id)
  @JoinColumn()
  requiredLevel!: number;

  @OneToOne(() => Media, (media: Media) => media.id)
  @JoinColumn()
  media!: number;

  // TASK Add Api Doc
  // -1 for infinity
  @Column({ default: -1, type: 'integer' })
  maxAmmunition: number;

  @Column('json')
  damage: DamageMatrix;
}

// const regularDamages = {
//     b: [],// Bottom
//     bl: [],// Bottom left
//     br: [],// Bottom right
//     l: [],// Left
//     m: [row, col],// Middle
//     r: [],// Right
//     t: [],// Top
//     tl: [],// Top left
//     tr: []// Top right
//   }

//   const nuclearDamages = {
//     b: [row + 1, col], // Bottom
//     bl: [row + 1, col - 1], // Bottom left
//     br: [row + 1, col + 1], // Bottom right
//     l: [row, col - 1], // Left
//     m: [row, col], // Middle
//     r: [row, col + 1], // Right
//     t: [row - 1, col], // Top
//     tl: [row - 1, col - 1], // Top left
//     tr: [row - 1, col + 1], // Top right
//   }
//   const tripleDamages = {
//     b: [row + 1, col], // Bottom
//     bl: [], // Bottom left
//     br: [], // Bottom right
//     l: [], // Left
//     m: [row, col], // Middle
//     r: [], // Right
//     t: [row - 1, col], // Top
//     tl: [], // Top left
//     tr: [], // Top right
//   }

//   const droneDamages = {
//     b: [],// Bottom
//     bl: [],// Bottom left
//     br: [],// Bottom right
//     l: [],// Left
//     m: [],// Middle
//     r: [],// Right
//     t: [],// Top
//     tl: [],// Top left
//     tr: []// Top right
//   }
