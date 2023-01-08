import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { ThemeType } from '@interfaces/theme.interface';

@Entity()
export default class Theme implements ThemeType {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column('text')
  public name!: string;
}
