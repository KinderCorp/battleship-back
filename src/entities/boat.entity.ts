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

  @ManyToOne(
    () => MediaWithTheme,
    (mediaWithTheme: MediaWithTheme) => mediaWithTheme.theme,
  )
  @JoinColumn({ name: 'imageIds' })
  imageIds!: number[];

  @Column('integer')
  width!: number;

  @Column('integer')
  length!: number;
}
