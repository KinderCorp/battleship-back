import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import MediaWithTheme from '@entities/media-with-theme.entity';

@Entity()
export default class Boat {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  name!: string;

  // FIXME don't work
  @ManyToOne(
    () => MediaWithTheme,
    (mediaWithTheme: MediaWithTheme) => mediaWithTheme.theme,
  )
  @JoinColumn({ name: 'mediaIds' })
  mediaIds!: number[];

  @Column('integer', { default: 1 })
  width!: number;

  @Column('integer')
  length!: number;
}
