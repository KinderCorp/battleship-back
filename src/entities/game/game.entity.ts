import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Type } from 'class-transformer';

@Entity()
export class GameEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  // TASK Add ref to USER
  @Column('text')
  winner!: string;

  @CreateDateColumn()
  @Type(() => Date)
  createdAt!: Date;
}
