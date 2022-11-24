import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import MediaWithTheme from '@media-with-theme/media-with-theme.entity';

@Entity()
export default class Theme {
  @OneToMany(
    () => MediaWithTheme,
    (mediaWithTheme: MediaWithTheme) => mediaWithTheme.theme,
  )
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column('text')
  public name!: string;
}
