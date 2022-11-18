import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import MediaWithTheme from '@entities/media-with-theme.entity';

@Entity()
export default class Boat {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  name!: string;

  @OneToOne(
    () => MediaWithTheme,
    (mediaWithTheme: MediaWithTheme) => mediaWithTheme.id,
  )
  @JoinColumn()
  mediaWithTheme!: number;

  @Column('integer', { default: 1 })
  width!: number;

  @Column('integer')
  length!: number;
}
