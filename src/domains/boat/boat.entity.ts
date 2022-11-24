import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import MediaWithTheme from '@media-with-theme/media-with-theme.entity';

@Entity()
export default class Boat {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column('text')
  public name!: string;

  @OneToOne(
    () => MediaWithTheme,
    (mediaWithTheme: MediaWithTheme) => mediaWithTheme.id,
  )
  @JoinColumn()
  public mediaWithTheme!: number;

  @ApiProperty({ default: 1 })
  @Column('integer', { default: 1 })
  public width!: number;

  @Column('integer')
  public length!: number;
}
