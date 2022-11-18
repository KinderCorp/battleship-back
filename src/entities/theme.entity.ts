import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import MediaWithTheme from '@entities/media-with-theme.entity';

@Entity()
export default class Theme {
  @OneToMany(
    () => MediaWithTheme,
    (mediaWithTheme: MediaWithTheme) => mediaWithTheme.theme,
  )
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  name!: string;
}
