import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { DamageMatrix } from '@interfaces/weapon.interface';
import Level from '@entities/level.entity';
import MediaWithTheme from '@entities/media-with-theme.entity';

@Entity()
export default class Weapon {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column('text')
  public name!: string;

  @ManyToOne(() => Level, (level: Level) => level.id)
  @JoinColumn()
  public requiredLevel!: number;

  @OneToOne(
    () => MediaWithTheme,
    (mediaWithTheme: MediaWithTheme) => mediaWithTheme.id,
  )
  @JoinColumn()
  public mediaWithTheme!: number;

  @ApiProperty({
    default: -1,
    description:
      'Specifies the maximum amount of ammunition. Default to -1 for infinite ammunition',
  })
  @Column({ default: -1, type: 'integer' })
  public maxAmmunition: number;

  @Column('json')
  public damage: DamageMatrix;
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

// const droneDamages = {
//   b: [],// Bottom
//   bl: [],// Bottom left
//   br: [],// Bottom right
//   l: [],// Left
//   m: [],// Middle
//   r: [],// Right
//   t: [],// Top
//   tl: [],// Top left
//   tr: []// Top right
// }
