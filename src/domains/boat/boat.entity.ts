import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export default class Boat {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column('text')
  public name!: string;

  @ApiProperty({ default: 1 })
  @Column('integer', { default: 1 })
  public width!: number;

  @Column('integer')
  public length!: number;
}
