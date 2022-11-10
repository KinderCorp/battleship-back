import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Level from '@entities/level.entity';
import Media from '@entities/media.entity';

@Entity()
export default class Weapon {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  name!: string;

  @OneToOne(() => Level, (level: Level) => level.id)
  @JoinColumn()
  requiredLevel!: string;

  @OneToOne(() => Media, (media: Media) => media.id)
  @JoinColumn()
  media!: string;

  @Column({ nullable: true, type: 'integer' })
  maxAmmunition: null | number;

  @Column('integer', { array: true })
  damage!: number[][];
}
