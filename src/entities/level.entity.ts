import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Media from '@entities/media.entity';

// FIXME

@Entity()
export default class Level {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Media, (media: Media) => media.id)
  @JoinColumn()
  image!: number;

  @Column('integer')
  rank!: number;

  @Column('integer')
  totalXp!: number;
}
